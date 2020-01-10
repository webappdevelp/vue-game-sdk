<template>
  <section class="poly">
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
// 爱玩H5
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
let hyPSMSource: any = null;
let postInterval: any = null;

@Component
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
      }
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
    if (origin === window.location.origin) {
      return;
    }
    let cpDatas = JSON.parse(data || 'null');
    cpDatas = cpDatas || {};
    const { action, datas } = cpDatas;

    if (action) {
      const { sdkOptions, userInfo } = this.$data;
      console.log(`${action}：hyCpSDK -> hySDK successed`);
      switch (action) {
        case 'blur':
          if (document.scrollingElement) {
            document.scrollingElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
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
        case 'cpReport':
          this.sdkReport({
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
            payParams.count = datas.amount || 0;
            payParams.order_id = order_id || '';
            payParams.roleId = datas.roleId || 1;
            payParams.roleName = datas.roleName || '';
            payParams.serverId = datas.serverId || '1';
            payParams.level = datas.level || 1;
            payParams.productName = datas.productName || '';
            payParams.productDesc = datas.productDesc || '';
            payParams.goodsId = datas.goodsId || '1';
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
  // sdk report
  private sdkReport(params: {
    cpAction: string;
    isNew: number;
    roleCreateTime: number;
    serverId: number;
    serverName: string;
    roleId: number;
    roleName: string;
    roleBalance: string;
    vip: number;
    level: number;
    partyId: number;
    partyName: string;
  }) {
    const { userInfo } = this.$data;
    window.QuickSDK.uploadGameRoleInfo(
      JSON.stringify({
        uid: userInfo.channelUserId,
        username: userInfo.channelUserName,
        isCreateRole: !!params.isNew,
        roleCreateTime: params.roleCreateTime,
        serverId: params.serverId,
        serverName: params.serverName,
        userRoleId: params.roleId,
        userRoleName: params.roleName,
        userRoleBalance: params.roleBalance,
        userRoleLevel: params.level,
        vipLevel: params.vip,
        partyId: params.partyId,
        partyName: params.partyName
      }),
      (res: any) => {
        console.log(res);
      }
    );
  }
  // sdk登录
  private async sdkLogin() {
    if (!window.QuickSDK) {
      return this.updateToast('当前环境无法登录');
    }
    const { gameDatas, sdkOptions } = this.$data;
    const productCode = gameDatas.product_code || '';
    const productKey = gameDatas.product_no || '';
    window.QuickSDK.init(productCode, productKey, true, () => {
      console.log('渠道SDK init success');
      window.QuickSDK.login(async (res: { data: any; status: boolean }) => {
        const { status, data } = res;
        if (status) {
          const { uid, username, token } = data;
          const { userInfo } = this.$data;
          this.$data.userInfo = {
            ...userInfo,
            hyUid: uid,
            channelUserId: uid,
            channelUserName: username || uid,
            token
          };
          this.$data.sdkOptions = {
            ...sdkOptions,
            imei: `aiwan_${uid}`
          };
          await this.deviceInit();
          const user = await this.loginRequest({
            ...this.datas
          });
          this.postMessage({
            action: 'loginSuccess',
            datas: {
              ...user
            }
          });
        } else {
          this.sdkLogin();
        }
      });
    });
  }
  // sdk pay
  private sdkPay(params: any) {
    const { userInfo, gameDatas } = this.$data;
    const orderInfo: string = JSON.stringify({
      productCode: gameDatas.product_code || '',
      uid: userInfo.channelUserId || '',
      username: userInfo.channelUserName,
      userRoleId: params.roleId || 1,
      userRoleName: params.roleName || userInfo.channelUserName,
      serverId: params.serverId,
      userServer: params.serverId,
      userLevel: params.level,
      cpOrderNo: params.order_id || '',
      amount: params.amount,
      count: params.count,
      quantifier: '个',
      subject: params.productName,
      desc: params.productDesc,
      callbackUrl: params.url,
      extrasParams: params.ext || '{}',
      goodsId: params.goodsId,
      goods_id: params.goodsId
    });
    try {
      window.QuickSDK.pay(orderInfo, (res: any) => {
        const { status } = res;
        if (!status) {
          this.postMessage({
            action: 'payFail'
          });
        }
      });
    } catch (err) {
      this.updateToast(err && err.message);
    }
  }
  private async created() {
    try {
      await loadJS(
        'https://sdkapi02.quicksdk.net/static/lib/libQuickSDK_v2.js'
      );
      window.addEventListener('message', this.dispatchMessage);
      const { sdkOptions } = this.$data;
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
.btn {
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 0;
  right: 0;
  width: 50%;
  margin: 0 auto;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  color: #fff;
  background: #409eff;
  text-align: center;
}
</style>
