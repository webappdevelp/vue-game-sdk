<template>
  <section class="poly">
    <hy-alert :show.sync="showLimitTip" :closeable="false" title="温馨提示">
      <div slot="body">{{ limitTipText }}</div>
      <template slot="footer">
        <a class="msg-btn" @click="hideLimitTip">知道了</a>
      </template>
    </hy-alert>
    <iframe
      v-if="gameDatas.link !== ''"
      @load="gameInit"
      ref="gameWindow"
      :src="gameDatas.link"
      id="gameWindow"
      height="100%"
      width="100%"
      scrolling="auto"
      allowtransparency="true"
      allowfullscreen
      frameborder="0"
      :style="iframeStyle"
    ></iframe>
  </section>
</template>
<script lang="ts">
// 火箭H5
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import HyAlert from '@/components/core/msgBox/index.vue';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
let hyPSMSource: any = null;
let postInterval: any = null;

@Component({
  components: {
    HyAlert
  }
})
export default class Poly extends Mixins(pageCommonMix) {
  @Prop({
    type: Object,
    default: () => {}
  })
  private datas!: {
    hy_gid: string;
    hy_channel_id: string;
    aid: string;
    start_origin: string;
    uid: string;
    token: string;
  };

  private data() {
    return {
      sdkOptions: {
        app_id: '',
        app: '',
        channel_id: '',
        channel: '',
        aid: '0',
        deviceId: '',
        start_origin: ''
      },
      userInfo: {
        hyUid: '',
        channelUserId: '',
        channelUserName: '',
        userId: '',
        token: '',
        openid: '',
        mobile: ''
      },
      iframeStyle: {
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'none',
        background: 'transparent',
        pointerEvents: 'auto'
      },
      gameDatas: {
        link: ''
      },
      showLimitTip: false,
      limitTipText: ''
    };
  }
  // 获取页面初始化信息
  private async getInitData() {
    const { sdkOptions, gameDatas } = this.$data;
    let { device_type } = this.$data;
    device_type = device_type || '';
    try {
      const result = await this.getPageDatas();
      if (result) {
        const { cp_url, json_param } = result;
        document.title = (json_param && json_param.title) || '';
        this.$data.gameDatas = {
          ...gameDatas,
          ...json_param,
          link:
            cp_url.indexOf('?') >= 0
              ? `${cp_url}&device_type=${device_type}`
              : `${cp_url}?device_type=${device_type}`
        };
      }
    } catch (err) {
      this.updateToast(err && err.message);
    }
  }
  // 游戏载入后初始化通信
  private async gameInit() {
    hyPSMSource = (this.$refs.gameWindow as HTMLIFrameElement).contentWindow;
    // 设备初始化
    // await this.deviceInit();
    // sdk 之间初始化通信
    const _self = this;
    postInterval = setInterval(() => {
      _self.postMessage({
        action: 'init'
      });
    }, 800);
  }
  // sdk通信连接
  private postMessage(params: { action: string; datas?: any }) {
    if (hyPSMSource) {
      hyPSMSource.postMessage(JSON.stringify(params), '*');
    } else {
      console.log('初始时，通信连接失败，正尝试重新连接');
    }
  }
  // 接收cpsdk消息，并根据消息行为进行其他操作
  private async dispatchMessage(e: MessageEvent) {
    const { origin, data } = e;
    if (origin === window.location.origin || typeof data === 'object') {
      return;
    }
    let cpDatas = JSON.parse(data || 'null');
    cpDatas = cpDatas || {};
    const { action, datas } = cpDatas;

    if (action) {
      console.log(`${action}：hyCpSDK -> hySDK successed`);
      switch (action) {
        case 'blur':
          if (document.scrollingElement) {
            document.scrollingElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
          window.ZKSDK.focusout();
          break;
        case 'initSuccess':
          clearInterval(postInterval);
          postInterval = null;
          break;
        case 'login':
          await this.sdkLogin();
          break;
        case 'roleReport':
          this.roleReport({
            ...datas
          });
          break;
        case 'pay':
          const result = await this.payRequest({
            productOrderId: datas.productOrderId,
            amount: datas.amount,
            productDesc: datas.productDesc,
            productName: datas.productName,
            callbackUrl: datas.callbackUrl,
            appExt: datas.appExt,
            serverId: datas.serverId,
            roleId: datas.roleId,
            level: datas.level,
            goodsId: datas.goodsId
          });
          const { status, data } = result;
          if (status === 0) {
            const { ext, order_id } = data;
            const payParams = JSON.parse(JSON.stringify(ext && ext[0]));
            payParams.order_id = order_id;
            payParams.amount = datas.amount;
            payParams.goodsId = datas.goodsId;
            payParams.productName = datas.productName;
            payParams.productDesc = datas.productDesc;
            payParams.serverId = datas.serverId;
            payParams.roleId = datas.roleId;
            payParams.roleName = datas.roleName || datas.roleId;
            this.sdkPay(payParams);
          } else {
            this.postMessage({
              action: 'payFail'
            });
          }
          break;
      }
    }
  }
  // 关闭实名认证提示文案弹窗
  public hideLimitTip() {
    this.$data.limitTipText = '';
    this.$data.showLimitTip = false;
  }
  // sdk login
  private async sdkLogin() {
    if (!window.ZKSDK) {
      return this.updateToast('当前环境无法登录');
    }
    window.ZKSDK.login(async (res: any) => {
      const { state, data, msg } = res;
      let age = -1;
      try {
        window.ZKSDK.isIdentity(async (res: any) => {
          if (res.state === 1) {
            const { is_adults } = res.data;
            age = is_adults === 0 ? 15 : is_adults === 1 ? 18 : is_adults;
          }
          await this.setUserInfo({ ...data, age });
        });
      } catch (err) {
        if (state === 1) {
          await this.setUserInfo({ ...data, age });
        } else {
          this.updateToast(msg || '渠道SDK登录失败');
        }
      }
    });
  }
  private async setUserInfo(data: any = {}) {
    const { userInfo, sdkOptions } = this.$data;
    const { uid, token, age } = data;
    this.$data.userInfo = {
      ...userInfo,
      hyUid: uid,
      channelUserId: uid,
      channelUserName: uid,
      token,
      age
    };
    this.$data.sdkOptions = {
      ...sdkOptions,
      imei: `9ishouyou_${uid}`
    };
    this.reportOnlineTime(() => {
      window.ZKSDK.logout();
    });
    await this.deviceInit();
    const user = await this.loginRequest({
      ...this.datas,
      ...data
    });
    this.postMessage({
      action: 'loginSuccess',
      datas: {
        ...user
      }
    });
  }
  // sdk pay
  private sdkPay(params: any) {
    try {
      window.ZKSDK.pay({
        out_trade_no: params.order_id,
        total_charge: params.amount,
        callback_url: params.url,
        product_id: params.goodsId,
        product_name: params.productName,
        product_desc: params.productDesc,
        product_amount: 1,
        server_id: params.serverId,
        role_id: params.roleId,
        role_name: params.roleName,
        extend: ''
      });
    } catch (err) {
      this.postMessage({
        action: 'payFail'
      });
    }
  }
  private async created() {
    try {
      await loadJS('//upload.9ishouyou.com/jssdk/sdkv4.min.js');
      window.addEventListener('message', this.dispatchMessage);
      const { sdkOptions, userInfo } = this.$data;
      const { hy_gid, hy_channel_id, aid, start_origin } = this.datas;
      this.$data.sdkOptions = {
        ...sdkOptions,
        app_id: hy_gid,
        app: hy_gid,
        channel_id: hy_channel_id,
        channel: hy_channel_id,
        aid: aid || '0',
        start_origin
      };
      // 初始化接口
      window.ZKSDK.init((res: { state: number; msg: string }) => {
        if (res.state === 0) {
          this.updateToast(res.msg || '渠道SDK初始化失败');
        } else {
          // 监听注销操作
          window.ZKSDK.onLogout(() => {
            window.location.reload();
          });
        }
      });
      this.getInitData();
    } catch (err) {
      this.updateToast((err && err.message) || '渠道SDK加载失败');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }
  private mounted() {
    // this.init();
  }
}
</script>
<style>
html,
body,
#app,
.poly {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.poly,
#gameWindow {
  width: 100%;
  overflow: hidden;
}
.msg-btn {
	display: block;
  padding: 14px 0 12px;
  font-size: 14px;
  text-align: center;
  color: #007aff;
  box-sizing: border-box;
  &:hover,
  &:active {
    background: rgba(221, 221, 221, 0.2);
  }
}
</style>
