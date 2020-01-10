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
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
let hyPSMSource: any = null;
let postInterval: any = null;
let loginLock: boolean = false;

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
    const { sdkOptions, gameDatas, device_type } = this.$data;
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
      console.log('通知CP初始化');
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
          this.sdkLogin();
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
            goodsId: datas.goodsId,
            ext: JSON.stringify({ productName: datas.productName })
          });
          this.sdkPay({
            ...result
          });
          break;
      }
    }
  }
  // 渠道SDK支付
  private sdkPay(params: any) {
    window.HwFastappObject.pay(
      JSON.stringify({
        orderInfo: params.data.orderInfo
      })
    );
  }
  // 渠道登录
  private sdkLogin() {
    if (loginLock) {
      return;
    }
    loginLock = true;
    if (!window.HwFastappObject) {
      return this.updateToast('当前环境无法登录');
    }
    const { gameDatas } = this.$data;
    window.HwFastappObject.gameLogin(
      JSON.stringify({
        forceLogin: 1,
        appid: gameDatas.app_id || ''
      })
    );
  }
  // window -> app bridge
  private windowBridge() {
    //登录结果
    window.HwFastappObject.onGameLoginResult = async (result: any) => {
      // 登录解锁
      loginLock = false;
      if (result.gameUserData.isAuth === 1) {
        const { userInfo, sdkOptions } = this.$data;
        this.$data.userInfo = {
          ...userInfo,
          ...result.gameUserData,
          hyUid: result.gameUserData.playerId,
          token: result.gameUserData.gameAuthSign,
          channelUserId: result.gameUserData.playerId,
          channelUserName: result.gameUserData.playerId,
          mobile: true
        };
        this.$data.sdkOptions = {
          ...sdkOptions,
          imei: `huawei_${result.gameUserData.playerId}`
        };
        if (result.gameUserData.gameAuthSign) {
          // 设备初始化
          const res = await this.deviceInit();
          if (res) {
            const user = await this.loginRequest(this.$data.userInfo);
            this.postMessage({
              action: 'loginSuccess',
              datas: {
                ...user
              }
            });
          }
        }
      }
    };
    //支付结果
    window.HwFastappObject.onPayResult = (result: any) => {
      if (result.code) {
        this.postMessage({
          action: 'payFail'
        });
      }
    };
  }
  private created() {
    window.addEventListener('message', this.dispatchMessage);
    this.windowBridge();
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
</style>
