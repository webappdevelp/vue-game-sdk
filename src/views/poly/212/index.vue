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
// 9G
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
let hyPSMSource: any = null;
let postInterval: any = null;
let game9g: any = null;
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
    gameid: string;
    channel: string;
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
    game9g.ready(function(data: any) {
      console.log(data);
    });
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
        case 'cpReport':
          this.sdkReport({
            ...datas
          });
          break;
        case 'pay':
          let ext = {
            productName: datas.productName,
            level: datas.level,
            goodsId: datas.goodsId
          };
          const result = await this.payRequest({
            productOrderId: datas.productOrderId,
            amount: datas.amount,
            productDesc: datas.productDesc,
            productName: datas.productName,
            callbackUrl: datas.callbackUrl,
            appExt: datas.appExt,
            ext: JSON.stringify(ext),
            serverId: datas.serverId,
            roleId: datas.roleId,
            level: datas.level,
            goodsId: datas.goodsId
          });
          const { status, data } = result;
          if (status === 0) {
            const { ext, order_id } = data;
            const payParams = JSON.parse(JSON.stringify(ext && ext[0]));
            //接口返回：sign spid
            payParams.orderid = order_id;
            payParams.money = datas.amount;
            payParams.product = datas.productName;
            payParams.role_id = datas.roleId;
            payParams.server_id = datas.serverId;
            payParams.attach = order_id;
            let _self = this;
            payParams.onPayCallback = function(suc: any) {
              _self.postMessage({
                action: 'paySuccess'
              });
            };
            payParams.onPayCancel = function(cancel: any) {
              _self.postMessage({
                action: 'payFail'
              });
            };
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
      game9g.pay(datas);
    } catch (err) {
      this.postMessage({
        action: 'payFail'
      });
    }
  }
  //渠道数据上报
  private sdkReport(datas: {
    cpAction: string;
    serverId: number;
    serverName: string;
    roleId: number;
    roleName: string;
  }) {
    if (datas.cpAction === 'enterGame') {
      return;
    }
    switch (datas.cpAction) {
      case 'selectServer':
        game9g.selectServer(
          {
            server_id: datas.serverId,
            server_name: datas.serverName || datas.serverId
          },
          (suc: any) => {
            console.log(suc);
          }
        );
        break;
      case 'createRole':
        game9g.createRole(
          {
            server_id: datas.serverId,
            server_name: datas.serverName || datas.serverId,
            role_id: datas.roleId,
            nickname: datas.roleName || datas.roleId
          },
          (suc: any) => {
            console.log(suc);
          }
        );
        break;
    }
  }
  private async created() {
    try {
      await loadJS('//game.9g.com/js/lib.v2.js');
      window.addEventListener('message', this.dispatchMessage);
      const { sdkOptions, userInfo } = this.$data;
      const {
        hy_gid,
        hy_channel_id,
        aid,
        start_origin,
        gameid,
        channel,
        token
      } = this.datas;
      this.$data.sdkOptions = {
        ...sdkOptions,
        app_id: hy_gid,
        app: hy_gid,
        channel_id: hy_channel_id,
        channel: hy_channel_id,
        imei: `9g_${token}`,
        aid: aid || '0',
        start_origin
      };
      game9g = new window.Game9G({
        gameid,
        channel,
        token
      });
      game9g.getUserInfo((res: any) => {
        this.$data.userInfo = {
          ...userInfo,
          channelUserId: res.uid || '',
          channelUserName: res.nickname || res.uid,
          hyUid: res.uid || '',
          token: token || ''
        };
      });
      this.getInitData();
    } catch (err) {
      this.updateToast((err && err.message) || '渠道SDK加载失败');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
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
