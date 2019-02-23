<template>
  <div class="scenes">
    <p>{{ action }}</p>
    <control :show="control" @click="showCenter"/>
    <hy-center :show.sync="center"/>
    <account-manger/>
    <login :show.sync="login" @btn-action="loginBtnAction" @submit="goLogin"/>
    <mobile-login :show="mobile" @back="showLogin" @submit="goLogin"/>
    <password/>
    <fast-result
      :show="btnAction === 'fast' && action === 'gameLogined'"
      :data="userInfo"
      @click="playGame"
    />
    <loading :show="loading"/>
    <toast :show.sync="toast.show" :msg="toast.msg"/>
    <iframe
      v-if="gameUrl !== ''"
      @load="gameInit"
      ref="game"
      :src="gameUrl"
      height="100%"
      width="100%"
      scrolling="no"
      frameborder="0"
      style="border: 0 none;"
    ></iframe>
  </div>
</template>
<script lang="ts">
let hyPSMSource: any = null;
let hyPSMOrigin: string = '';
import { Vue, Component } from 'vue-property-decorator';
import Control from '@/components/scenes/Control.vue';
import HyCenter from '@/components/scenes/Center.vue';
import AccountManger from '@/components/scenes/AccountManger.vue';
import Login from '@/components/scenes/Login.vue';
import MobileLogin from '@/components/scenes/Mobile.vue';
import Password from '@/components/scenes/Password.vue';
import FastResult from '@/components/scenes/FastResult.vue';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import md5 from 'md5';
import { UPDATETOAST, UPDATELOAD, UPDATEUSERACTION } from '@/stores/types';
import { mapState } from 'vuex';
import { cqApi } from '@/config';
import { get } from '@/utils/ts/fetch';
import { deviceInit } from '@/api/u9api';
import { getStorage, setStorage } from '@/utils/ts/storage';
import getQuery from '@/utils/ts/getQuery';
const gameId: string = getQuery('gid') || '0';
const openid: string = getQuery('openid') || '0';

@Component({
  components: {
    Control,
    HyCenter,
    AccountManger,
    Login,
    MobileLogin,
    Password,
    FastResult,
    Loading,
    Toast
  },
  computed: {
    ...mapState(['toast', 'loading']),
    ...mapState('userInfo', {
      userInfo(state: any) {
        return state.infos;
      },
      action(state: any) {
        if (state.action === 'fast') {
          this.$data.login = false;
        }
        if (!!state.action && state.action !== 'gameLogined') {
          // 当平台登录的操作手柄存在时，自动登录游戏
          this.$store.dispatch('userInfo/loginGame', {
            ...this.$data.sdkOptions
          });
        }
        // 执行登录成功操作 playGame
        if (/login|mobile/.test(this.$data.btnAction) && state.action === 'gameLogined') {
          this.playGame();
        }
        return state.action;
      }
    })
  }
})
export default class Scenes extends Vue {
  private data() {
    return {
      sdkOptions: {
        app: gameId,
        app_id: gameId
      },
      control: false,
      center: false,
      login: false,
      mobile: false,
      gameUrl: '',
      btnAction: ''
    };
  }

  // methods
  private showToast(msg: string) {
    this.$store.commit({
      type: UPDATETOAST,
      data: msg
    });
  }
  private updateLoading(show: boolean) {
    this.$store.commit({
      type: UPDATELOAD,
      data: show
    });
  }
  private postMessage(params: { action: string; datas?: any }) {
    if (hyPSMSource && hyPSMOrigin) {
      hyPSMSource.postMessage(JSON.stringify(params), hyPSMOrigin);
    } else {
      this.$store.commit({
        type: UPDATETOAST,
        data: '通信连接失败'
      });
    }
  }
  // 截取message，并分发事件
  private dispatchMessage(e: MessageEvent) {
    const { origin, data } = e;
    if (origin === hyPSMOrigin) {
      let datas = JSON.parse(data);
      datas = datas || {};
      const { action } = datas;
      switch (action) {
        case 'initSuccess':
          // 判断是否登录平台
          if (!this.$store.getters['userInfo/isLogin']) {
            return (this.$data.login = true);
          }
          // 判断是否登录游戏
          if (!this.$store.getters['userInfo/isGameLogin']) {
            return;
          }
      }
      console.log(action, 'hySDK -> hyCpSDK successed');
    }
  }
  // 获取页面初始化信息
  private getInitData() {
    get(`${cqApi}/game/detail`, {
      datas: {
        gid: gameId
      }
    })
      .then((res: { data: { cp_origin: string; cp_url: string; title: string } }) => {
        this.updateLoading(false);
        let { data } = res;
        data = data || {};
        const { title, cp_origin, cp_url } = data;
        if (!!title) {
          document.title = title;
        }
        this.$data.gameUrl = 'http://m.xy.com/src/psmSDK/cp.html';
        hyPSMOrigin = 'http://m.xy.com';
      })
      .catch((err: { message: string }) => {
        this.updateLoading(false);
        this.showToast(err.message);
      });
  }
  // 开始和cp sdk通信
  private gameInit() {
    hyPSMSource = (this.$refs.game as HTMLIFrameElement).contentWindow;
    // 游戏加载成功后即开始设备初始化操作
    const deviceImei = getStorage('device');
    deviceInit({
      ...this.$data.sdkOptions,
      brand_desc: openid === '0' ? '' : '公众号',
      imei: openid !== '0' ? openid : deviceImei || '0'
    })
      .then((res: { data: { device: number; imei: string } }) => {
        const { imei, device } = res.data;
        if (device) {
          this.$data.sdkOptions = {
            ...this.$data.sdkOptions,
            device
          };
          setStorage('device', imei);
        }
      })
      .catch((err: { message: string }) => {
        this.showToast(err.message);
      });
    // sdk 开始初始化通讯操作
    this.postMessage({
      action: 'init',
      datas: this.$store.getters['userInfo/getSDKUserInfo']
    });
  }
  // 登录面板按钮交互
  private loginBtnAction(action: string) {
    switch (action) {
      case 'mobile':
        this.$data.login = false;
        this.$data.mobile = true;
        break;
      case 'fast':
        this.$data.btnAction = 'fast';
        this.$store.dispatch('userInfo/login', {
          action: 'fast',
          params: {
            password: md5(`hy${new Date().getTime()}LongQi`)
          }
        });
        break;
    }
  }
  // 平台登录
  private goLogin({ action, params }: { action: string; params: any }) {
    this.$data.btnAction = action;
    this.$store.dispatch('userInfo/login', {
      action,
      params: {
        ...this.$data.sdkOptions,
        ...params
      }
    });
  }
  private showLogin() {
    this.$data.mobile = false;
    this.$data.login = true;
  }
  private showCenter() {
    this.$data.center = true;
  }
  // 登录游戏成功
  private playGame() {
    this.$data.login = false;
    this.$data.mobile = false;
    this.$data.btnAction = '';
    this.postMessage({
      action: 'loginSuccess',
      datas: this.$store.getters['userInfo/getSDKUserInfo']
    });
  }

  // lifecycles
  private beforeCreate() {
    this.$store.commit({
      type: UPDATELOAD,
      data: true
    });
  }
  private created() {
    this.getInitData();
  }
  private mounted() {
    window.addEventListener('message', this.dispatchMessage);
  }
}
</script>
<style lang="scss" scoped>
.scenes {
  height: 100%;
  width: 100%;
}
</style>
