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
// 呵呵玩
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
    openid: string;
    gameid: string;
    platform: string;
    timestamp: string;
    nickname: string;
    sign: string;
    params: string;
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
    // 设备初始化
    await this.deviceInit();
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
          break;
        case 'initSuccess':
          clearInterval(postInterval);
          postInterval = null;
          break;
        case 'login':
          const userInfo = await this.loginRequest({
            ...this.datas
          });
          this.postMessage({
            action: 'loginSuccess',
            datas: {
              ...userInfo
            }
          });
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
            payParams.productName = datas.productName;
            payParams.serverId = datas.serverId;
            payParams.roleId = datas.roleId;
            payParams.order_id = order_id;
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
  // sdk pay
  private sdkPay(datas: any) {
    try {
      const { openid, gameid, params, platform } = this.datas;
      window.sharepay({
        openid,
        gameid,
        params,
        platform,
        roleid: datas.roleId,
        rolename: datas.roleId,
        serverid: datas.serverId || '',
        servername: datas.roleId || '',
        tradename: datas.productName || '',
        recharge: datas.recharge || 0,
        timestamp: datas.timestamp,
        custom: datas.order_id || openid || gameid
      });
    } catch (err) {
      this.postMessage({
        action: 'payFail'
      });
    }
  }
  private async created() {
    try {
      await loadJS('//sharesdk.shishagame.com/api/sharesdk.js');
      window.addEventListener('message', this.dispatchMessage);
      const { sdkOptions, userInfo } = this.$data;
      const {
        hy_gid,
        hy_channel_id,
        aid,
        start_origin,
        openid,
        gameid,
        platform,
        timestamp,
        nickname,
        sign
      } = this.datas;
      this.$data.sdkOptions = {
        ...sdkOptions,
        app_id: hy_gid,
        app: hy_gid,
        channel_id: hy_channel_id,
        channel: hy_channel_id,
        imei: `hehewan_${openid}`,
        aid: aid || '0',
        start_origin
      };
      this.$data.userInfo = {
        ...userInfo,
        channelUserId: openid || '',
        channelUserName: nickname || openid || '',
        hyUid: openid || '',
        openid,
        token: sign || ''
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
