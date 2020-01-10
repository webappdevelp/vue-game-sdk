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
// 蝴蝶H5
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
let hyPSMSource: any = null;
let postInterval: any = null;
let hGameSDK: any = null;

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
    game_url: string;
    game_key: string;
    timestamp: string;
    signature: string;
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
    const { sdkOptions } = this.$data;
    this.$data.sdkOptions = {
      ...sdkOptions,
      imei: `hudie_${new Date().getTime()}_${Math.ceil(Math.random() * 1000)}`
    };
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
        case 'logOut':
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
        case 'setShare':
          this.setShare({
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
            ext: JSON.stringify({
              open_id: userInfo.channelUserId,
              productName: datas.productName
            }),
            serverId: datas.serverId,
            roleId: datas.roleId,
            level: datas.level,
            goodsId: datas.goodsId
          });
          const { status, data } = result;
          if (status === 0) {
            const { ext } = data;
            const payParams = JSON.parse(JSON.stringify(ext && ext[0]));
            delete payParams.url;
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
  private setShare(params: {
    title: string;
    desc: string;
    imgUrl: string;
    url?: string;
    extend?: object;
  }) {
    try {
      const { userInfo } = this.$data;
      const { timestamp, signature, game_key } = this.datas;
      hGameSDK.setShareData(
        {
          open_id: userInfo.channelUserId,
          game_key,
          timestamp,
          signature,
          title: params.title || '',
          message: params.desc || '',
          imgUrl: params.imgUrl || '',
          url: params.url || '',
          extend: params.extend || {},
          callback: (res: any) => {
            this.postMessage({
              action: 'shareComplete',
              datas: res
            });
          }
        },
        (res: any) => {
          console.log(res);
        }
      );
    } catch (err) {
      this.updateToast(err && err.message);
    }
  }
  // sdk login
  private async sdkLogin() {
    if (!hGameSDK) {
      return this.updateToast('当前环境无法登录');
    }
    hGameSDK.login(async (res: any) => {
      const { userInfo } = this.$data;
      this.$data.userInfo = {
        ...userInfo,
        hyUid: 'open_id',
        channelUserId: 'open_id',
        channelUserName: 'nickname',
        token: res.ticket || 'ticket'
      };
      const user = await this.loginRequest({
        ...this.datas,
        game_url: escape(this.datas['game_url'] || '')
      });
      this.postMessage({
        action: 'loginSuccess',
        datas: {
          ...user
        }
      });
    });
  }
  // sdk pay
  private sdkPay(params: any) {
    try {
      hGameSDK.pay(params, '', (res: any) => {
        const { code } = res;
        if (code === 0) {
          this.postMessage({
            action: 'paySuccess'
          });
        } else {
          this.postMessage({
            action: 'payFail'
          });
        }
      });
    } catch (err) {
      this.updateToast(err && err.message);
    }
  }
  // sdk report
  private sdkReport(params: {
    cpAction: string;
    level: number;
    vip?: number;
    roleId?: number;
    serverId?: number;
    score?: number;
    isNew?: number;
  }) {
    let extendData: any = {
      level: params.level || 0
    };
    if (params.cpAction === 'enterGame') {
      extendData = {
        ...extendData,
        vipLevel: params.vip || 0,
        score: params.score || 0,
        isNew: params.isNew || 0,
        shareRole: params.roleId || 0
      };
    }
    const { userInfo } = this.$data;
    const { game_key } = this.datas;
    hGameSDK.gameReport(
      params.cpAction || 'enterGame',
      {
        game_key,
        open_id: userInfo.channelUserId,
        role: params.roleId || 0,
        nickname: userInfo.channelUserName,
        area: 'HOODINN',
        group: params.serverId || '1'
      },
      extendData,
      (res: any) => {
        console.log(res);
      }
    );
  }
  private async created() {
    try {
      window.addEventListener('message', this.dispatchMessage);
      await loadJS('//d.hgame.com/loadsdk');
      const { sdkOptions } = this.$data;
      const { hy_gid, hy_channel_id, aid, start_origin, game_key } = this.datas;
      this.$data.sdkOptions = {
        ...sdkOptions,
        app_id: hy_gid,
        app: hy_gid,
        channel_id: hy_channel_id,
        channel: hy_channel_id,
        aid: aid || '0',
        start_origin
      };
      hGameSDK = new window.hGame({
        game_key
      });
      this.getInitData();
    } catch (err) {
      this.updateToast((err && err.message) || '渠道SDK加载失败');
      setTimeout(() => {
        window.top.location.reload();
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
