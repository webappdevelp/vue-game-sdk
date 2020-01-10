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
// 群黑H5
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
let hyPSMSource: any = null;
let postInterval: any = null;
let feihuoSDK: any = null;

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
    username: string;
    serverid: string;
    time: string;
    nname: string;
    flag: string;
    qhchannel: string;
    qhchannelid: string;
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
        // 初始化渠道sdk
        const { username, qhchannel, qhchannelid, time } = this.datas;
        window.qhsdk.init({
          username,
          qhchannel,
          qhchannelid,
          time,
          gid: json_param['APP_ID']
        });
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
          const user = await this.loginRequest({
            ...this.datas
          });
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
        case 'cpReport':
          this.sdkReport({
            ...datas
          });
          break;
        case 'share':
          this.share();
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
            ext: JSON.stringify({ userId: this.datas.username })
          });
          const { status, data } = result;
          if (status === 0) {
            const { ext } = data;
            const payParams = JSON.parse(JSON.stringify(ext && ext[0]));
            delete payParams.url;
            payParams.goodsId = datas.goodsId;
            payParams.productName = datas.productName;
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
  // sdk share
  private share() {
    window.qhsdk.share();
  }
  // sdk report
  private sdkReport(params: {
    cpAction: string;
    serverId: number;
    roleId: number;
    roleName: string;
    level: number;
    rolePower: number;
  }) {
    window.qhsdk.role({
      act: params.cpAction || 2,
      serverid: params.serverId,
      roleid: params.roleId,
      rolename: params.roleName,
      level: params.level,
      power: params.rolePower
    });
  }
  // sdk pay
  private sdkPay(params: {
    goodsId: string;
    productName: string;
    ext: string;
    money: string;
    serverId: string;
    roleId: string;
    roleName: string;
    sign: string;
  }) {
    try {
      const { userInfo, gameDatas } = this.$data;
      window.qhsdk.pay({
        userId: userInfo.channelUserId,
        gid: gameDatas['APP_ID'],
        money: params.money,
        goodsId: params.goodsId,
        goodsName: params.productName,
        serverId: params.serverId,
        roleId: params.roleId,
        roleName: params.roleName,
        ext: params.ext,
        sign: params.sign
      });
    } catch (err) {
      this.postMessage({
        action: 'payFail'
      });
    }
  }
  private async created() {
    try {
      const {
        hy_gid,
        hy_channel_id,
        aid,
        start_origin,
        username,
        nname,
        flag
      } = this.datas;
      await loadJS('//port.2r3r.com/game/qhjssdk');
      window.addEventListener('message', this.dispatchMessage);
      const { sdkOptions, userInfo } = this.$data;
      this.$data.sdkOptions = {
        ...sdkOptions,
        app_id: hy_gid,
        app: hy_gid,
        channel_id: hy_channel_id,
        channel: hy_channel_id,
        imei: `qunhei_${username}`,
        aid: aid || '0',
        start_origin
      };
      this.$data.userInfo = {
        ...userInfo,
        hyUid: username,
        channelUserId: username,
        channelUserName: nname || username,
        token: flag
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
