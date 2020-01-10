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
// tt玩
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import { post } from '@/utils/ts/fetch';
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
      currentAction: 'preInit',
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
    if (origin === window.location.origin) {
      return;
    }
    let cpDatas = JSON.parse(data || 'null');
    cpDatas = cpDatas || {};
    const { action, datas } = cpDatas;

    if (action) {
      this.$data.currentAction = action;
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
          if (!userInfo.hyUid) {
            this.sdkLogin();
          }
          const user = await this.loginRequest();
          this.postMessage({
            action: 'loginSuccess',
            datas: {
              ...user
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
            this.sdkPay({
              ...datas,
              ...payParams,
              order_id
            });
          } else {
            this.postMessage({
              action: 'payFail'
            });
          }
          break;
      }
    }
  }
  // 渠道SDK支付
  private sdkPay(params: any) {
    const { gameDatas, userInfo } = this.$data;
    window.TZAppBridge({
      cmd: 'pay',
      req: {
        appKey: gameDatas.app_init_no,
        gameId: Number(gameDatas.app_id),
        roleName: params.roleName,
        serverID: params.serverId,
        childUserID: userInfo.channelUserId,
        cpOrderID: params.order_id,
        cpFee: params.amount,
        subject: params.productName,
        body: params.productDesc,
        exInfo: params.order_id,
        bundleID: gameDatas.apk_name,
        cpCallbackUrl: params.url
      },
      callbackName: 'TZAppBridgeCallback'
    });
  }
  // tt 登录
  private sdkLogin() {
    if (!window.TZAppBridge) {
      return this.updateToast('当前环境无法登录');
    }
    window.TZAppBridge({
      cmd: 'login',
      req: {},
      callbackName: 'TZAppBridgeCallback'
    });
  }
  // window -> app bridge
  private windowBridge() {
    window.TZAppBridgeCallback = (datas: any) => {
      const { currentAction, userInfo, sdkOptions } = this.$data;
      const { result, msg, data } = datas;
      switch (currentAction) {
        case 'preInit':
          const { childUserID, accessToken } = data;
          this.$data.userInfo = {
            ...userInfo,
            hyUid: childUserID,
            channelUserId: childUserID,
            channelUserName: childUserID,
            token: accessToken,
            mobile: true
          };
          this.$data.sdkOptions = {
            ...sdkOptions,
            imei: `tt_${childUserID}`
          };
          break;
        case 'pay':
          if (result === 0) {
            this.postMessage({
              action: 'paySuccess'
            });
          } else {
            this.postMessage({
              action: 'payFail'
            });
          }
          break;
      }
    };
  }
  private created() {
    window.addEventListener('message', this.dispatchMessage);
    this.windowBridge();
    this.sdkLogin();
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
