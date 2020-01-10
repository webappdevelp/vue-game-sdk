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
// 叶子戏H5
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
    uid: string;
    token: string;
    skip: string;
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
        case 'setShare':
          this.setShare({
            ...datas
          });
          break;
        case 'share':
          this.share({
            ...datas
          });
          break;
        case 'pay':
          const { userInfo } = this.$data;
          const result = await this.payRequest({
            productOrderId: datas.productOrderId,
            amount: datas.amount,
            productDesc: datas.productDesc,
            productName: datas.productName,
            callbackUrl: datas.callbackUrl,
            appExt: datas.appExt,
            serverId: datas.serverId,
            serverName: datas.serverName || datas.serverId,
            roleId: datas.roleId,
            roleName: datas.roleName || datas.roleId,
            level: datas.level || 0,
            vip: datas.vip || 0,
            goodsId: datas.goodsId,
            ext: JSON.stringify({ productName: datas.productName, userId: userInfo.channelUserId })
          });
          const { status, data } = result;
          if (status === 0) {
            const { order_id, ext } = data;
            this.sdkPay({
              order_id,
              amount: datas.amount,
              productName: datas.productName,
              serverId: datas.serverId,
              serverName: datas.serverName || datas.serverId,
              roleId: datas.roleId,
              roleName: datas.roleName || datas.roleId,
              level: datas.level,
              sign: ext[0].sign
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
  // sdk report
  private sdkReport(params: {
    cpAction: string | number;
    serverId: number;
    serverName: string;
    roleId: number;
    roleName: string;
    level: number;
    vip: number;
    rolePower: number;
    roleCreateTime: number;
    roleUpgradeTime: number;
  }) {
    window.TopSuper.save({
      datatype: params.cpAction || 3,
      serverid: params.serverId + '',
      servername: params.serverName || params.serverId + '',
      roleid: params.roleId + '',
      rolename: params.roleName || params.roleId + '',
      rolelevel: params.level + '',
      fightvalue: params.rolePower + '',
      rolecreatetime: params.roleCreateTime + '',
      rolelevelmtime: params.roleUpgradeTime + '',
      vip: params.vip + ''
    });
  }
  // setshare
  private setShare(params: { title: string; desc: string; imgUrl: string }) {
    window.TopSuper.isSupport('setShareInfo', (res: { status: number }) => {
      if (res.status === 200) {
        window.TopSuper.setShareInfo(
          {
            title: params.title,
            content: params.desc,
            imgurl: params.imgUrl
          },
          (result: { status: number }) => {
            if (result.status === 200) {
              this.postMessage({
                action: 'shareComplete',
                datas: 'set:success'
              });
            } else {
              this.postMessage({
                action: 'shareComplete',
                datas: 'set:fail'
              });
            }
          }
        );
      }
    });
  }
  // share
  private share(params: { title: string; desc: string; imgUrl: string }) {
    window.TopSuper.isSupport('share', (res: { status: number }) => {
      if (res.status === 200) {
        window.TopSuper.share(
          {
            title: params.title,
            content: params.desc,
            imgurl: params.imgUrl
          },
          (result: { status: number }) => {
            if (result.status === 200) {
              this.postMessage({
                action: 'shareComplete',
                datas: 'success'
              });
            } else {
              this.postMessage({
                action: 'shareComplete',
                datas: 'fail'
              });
            }
          }
        );
      }
    });
  }
  // sdk login
  private async sdkLogin() {
    if (!window.TopSuper) {
      return this.updateToast('当前环境无法登录');
    }
    window.TopSuper.login(async (res: any) => {
      const { status, data, statusText } = res;
      const { userInfo, sdkOptions } = this.$data;
      if (status === 200) {
        const { openid, sign, ts } = data;
        this.$data.userInfo = {
          ...userInfo,
          hyUid: openid,
          channelUserId: openid,
          channelUserName: openid,
          token: sign
        };
        this.$data.sdkOptions = {
          ...sdkOptions,
          imei: `yezixi_${openid}`
        };
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
      } else {
        this.updateToast('渠道SDK登录失败');
      }
    });
  }
  // sdk pay
  private sdkPay(params: any) {
    try {
      window.TopSuper.pay(
        {
          warename: params.productName,
          count: 1,
          paybill: params.amount,
          serverid: params.serverId,
          servername: params.serverName,
          roleid: params.roleId,
          rolename: params.roleName,
          rolelevel: params.level,
          extstr: params.order_id,
          signature: params.sign
        },
        (res: { status: number }) => {
          if (res.status === 200) {
            this.postMessage({
              action: 'paySuccess'
            });
          } else {
            this.postMessage({
              action: 'payFail'
            });
          }
        }
      );
    } catch (err) {
      this.postMessage({
        action: 'payFail'
      });
    }
  }
  private async created() {
    try {
      await loadJS(
        '//static.yezixigame.com/resources/toph5super/103/toph5super.min.js'
      );
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
