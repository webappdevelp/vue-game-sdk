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
// 联运-疯狂游乐场
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
import { post } from '@/utils/ts/fetch';
let hyPSMSource: any = null;
let postInterval: any = null;
let SDK: any = null;
const rang = Math.floor(Math.random() * 3);
const shareDesc = [
  '人人都玩，无处不在，不花一分钱还免费送VIP，家里没矿也能玩的手游',
  '不肝不氪，上线送ssr大圣，凑齐师徒四人，探寻最本真的西游取经乐趣',
  'OMG！这游戏是疯了吧？这简直就是神级的回合手游，太好玩'
];

@Component
export default class Poly extends Mixins(pageCommonMix) {
  @Prop({
    type: Object,
    default: () => {}
  })
  private datas!: any;

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
        const { title, cp_url, json_param } = result;
        document.title = title;
        this.$data.gameDatas = {
          ...gameDatas,
          id: (json_param && json_param.app_id) || sdkOptions.app_id,
          name: title,
          link:
            cp_url.indexOf('?') >= 0
              ? `${cp_url}&device_type=${device_type}`
              : `${cp_url}?device_type=${device_type}`
        };
        if (SDK) {
          // 渠道sdk初始化
          const shareParams: any = {
            title,
            desc: shareDesc[rang],
            imgUrl: `${window.location.origin}${require(`@/assets/games/${
              sdkOptions.app_id
            }/share.png`)}`,
            success: () => {
              this.postMessage({
                action: 'shareComplete'
              });
            },
            cancel: () => {
              this.postMessage({
                action: 'shareComplete'
              });
            }
          };
          SDK.init();
          SDK.config({
            gameId: json_param && json_param.app_id,
            share: {
              friend: {
                ...shareParams
              },
              timeline: {
                ...shareParams
              }
            }
          });
          // 判断是否绑定手机号
          SDK.isBindTelNumber((res: { status: number; msg: string }) => {
            if (res.status === 200) {
              this.$data.userInfo = {
                ...this.$data.userInfo,
                mobile: res.msg
              };
            }
          });
        }
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
      const { sdkOptions } = this.$data;
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
          const userInfo = await this.loginRequest();
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
            callbackUrl: datas.callBackUrl,
            appExt: datas.appExt,
            serverId: datas.serverId,
            roleId: datas.roleId,
            level: datas.level,
            goodsId: datas.goodsId
          });
          const { status, data } = result;
          if (status === 0) {
            this.sdkPay(result);
          } else {
            this.postMessage({
              action: 'payFail'
            });
          }
          break;
        case 'openCPBindMobile':
          this.openBindMobile();
          break;
      }
    }
  }
  // 弹出渠道绑定手机号界面
  private openBindMobile() {
    SDK.openBindTelModal((res: { type: string; msg: string }) => {
      if (res.type === 'success') {
        this.postMessage({
          action: 'update',
          datas: {
            ...this.$data.userInfo,
            mobile: true
          }
        });
      }
    });
  }
  // sdk支付
  private sdkPay(params: any) {
    console.log(params);
    SDK.pay({
      ...params
    });
  }

  private async created() {
    try {
      await loadJS('//cdn.hortor.net/sdk/sdk_agent.min.js');
      SDK = window.HORTOR_AGENT;
      window.addEventListener('message', this.dispatchMessage);
      const { sdkOptions, userInfo } = this.$data;
      const {
        userName,
        userId2,
        userId,
        sign,
        aid,
        gid,
        channel_id,
        start_origin
      } = this.datas;
      this.$data.userInfo = {
        ...userInfo,
        hyUid: userId2,
        channelUserId: userId,
        channelUserName: userName,
        token: sign
      };
      this.$data.sdkOptions = {
        ...sdkOptions,
        app_id: gid as string,
        app: gid as string,
        channel_id: channel_id as string,
        channel: channel_id as string,
        aid: (aid as string) || '0',
        imei: `fkylc_${userId as string}` || '',
        start_origin
      };
      this.getInitData();
    } catch (err) {
      this.updateToast('渠道SDK加载失败');
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
</style>
