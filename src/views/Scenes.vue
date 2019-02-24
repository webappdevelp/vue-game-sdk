<template>
  <div class="scenes">
    <p>{{ action }}</p>
    <control @click="showCenter" :msg="controlRedDot"/>
    <hy-center
      :show.sync="center"
      :userDatas="scenesDatas.user"
      :gameDatas="gameDatas"
      @action="centerAction"
    />
    <account-manger :show.sync="account" :datas="scenesDatas" @action="accountAction"/>
    <login :show.sync="login" @btn-action="loginBtnAction" @submit="goLogin"/>
    <mobile-login :show="mobile" @back="showLogin" @submit="goLogin"/>
    <fast-result :show="fastRest" :datas="scenesDatas.user" @click="playGame"/>
    <bind-mobile
      :show="bindMobile"
      title="绑定手机号"
      btn-text="确认绑定"
      action="bindMobile"
      @back="showAccount"
      @submit="mobileBind"
    />
    <password
      :show="psw"
      :mobile="!!scenesDatas.user.mobile"
      @back="showAccount"
      @submit="changePassword"
    />
    <wx-to-browser :show.sync="wxTip.show" :msg="wxTip.msg"/>
    <loading :show="loading"/>
    <toast :show.sync="toast.show" :msg="toast.msg"/>
    <iframe
      v-if="gameDatas.link !== ''"
      @load="gameInit"
      ref="game"
      :src="gameDatas.link"
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
import Mobile from '@/components/scenes/Mobile.vue';
import Password from '@/components/scenes/Password.vue';
import FastResult from '@/components/scenes/FastResult.vue';
import WxToBrowser from '@/components/WxToBrowserTip.vue';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import md5 from 'md5';
import { UPDATETOAST, UPDATELOAD, UPDATEUSERACTION } from '@/stores/types';
import { mapState } from 'vuex';
import { cqApi } from '@/config';
import { get } from '@/utils/ts/fetch';
import { deviceInit } from '@/api/u9api';
import { getStorage, setStorage } from '@/utils/ts/storage';
import isWx from '@/utils/ts/device/isWx';

@Component({
  components: {
    Control,
    HyCenter,
    AccountManger,
    Login,
    MobileLogin: Mobile,
    BindMobile: Mobile,
    Password,
    FastResult,
    WxToBrowser,
    Loading,
    Toast
  },
  computed: {
    ...mapState(['toast', 'loading']),
    ...mapState('user', {
      scenesDatas(state: any) {
        return {
          user: {
            ...state.userInfo
          },
          gamer: {
            ...state.gamerInfo
          },
          app: {
            ...state.userAppInfo
          }
        };
      },
      controlRedDot(state: any) {
        if (!state.userInfo.mobile) {
          return '1';
        }
        return '';
      },
      action(state: any) {
        if (this.$data.loginType === 'fast') {
          this.$data.login = false;
          if (/gameLogined|updated/i.test(state.action)) {
            this.$data.fastRest = true;
          }
        }
        if (/login|mobile|fast|auto/i.test(this.$data.loginType) && state.action === 'logined') {
          // 登录平台后，获取控制中心小浮标状态
          this.$store.dispatch('user/getControlInfo');
          // 当平台登录的操作手柄存在时，自动登录游戏
          this.$store.dispatch('user/loginGame', {
            ...this.$data.sdkOptions
          });
        }
        // 执行登录成功操作 playGame
        if (this.$data.loginType !== 'fast' && state.action === 'gameLogined') {
          this.playGame();
        }
        // 退出登录
        if (state.action === 'logOut') {
          window.setTimeout(() => {
            window.location.reload();
          }, 2500);
        }
        // 账号管理变更
        if (!!this.$data.accountActionType) {
          this.showAccount();
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
        app: '',
        app_id: '',
        openid: ''
      },
      gameDatas: {
        id: '',
        name: '',
        origin: '',
        link: ''
      },
      center: false,
      login: false,
      mobile: false,
      fastRest: false,
      loginType: '',
      account: false,
      bindMobile: false,
      psw: false,
      accountActionType: '',
      wxTip: {
        show: false,
        msg: ''
      }
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
  // 获取页面初始化信息
  private getInitData() {
    const { sdkOptions } = this.$data;
    get(`${cqApi}/game/detail`, {
      datas: {
        gid: sdkOptions.app
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
        this.$data.gameDatas = {
          id: sdkOptions.app,
          name: title,
          origin: 'http://m.xy.com', //cp_origin,
          link: 'http://m.xy.com/src/psmSDK/cp.html' //cp_url
        };
        hyPSMOrigin = 'http://m.xy.com';
      })
      .catch((err: { message: string }) => {
        this.updateLoading(false);
        this.showToast(err.message);
      });
  }
  // 发送消息
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
      const { action, params } = datas;
      console.log(`${action}：hySDK -> hyCpSDK successed`);
      switch (action) {
        case 'roleReport':
          this.$store.dispatch('user/logReport', {
            ...params,
            ...this.$data.sdkOptions
          });
          break;
        case 'logOut':
          this.$store.dispatch('user/logOut');
          break;
        case 'initSuccess':
        case 'login':
          // 判断是否登录平台
          if (!this.$store.getters['user/isLogin']) {
            return (this.$data.login = true);
          }
          this.$data.loginType = 'auto';
          // 登录平台后，获取控制中心小浮标状态
          this.$store.dispatch('user/getControlInfo');
          // 判断是否登录游戏
          if (!this.$store.getters['user/isGameLogin']) {
            return this.$store.commit({
              type: `user/${UPDATEUSERACTION}`,
              data: 'logined'
            });
          }
          this.playGame();
          break;
      }
    }
  }
  // 开始和cp sdk通信
  private gameInit() {
    hyPSMSource = (this.$refs.game as HTMLIFrameElement).contentWindow;
    // 游戏加载成功后即开始设备初始化操作
    const { openid } = this.$data.sdkOptions;
    const deviceImei = getStorage('device');
    deviceInit({
      ...this.$data.sdkOptions,
      brand_desc: !Number(openid) ? '' : '公众号',
      imei: !Number(openid) ? openid : deviceImei || '0'
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
      action: 'init'
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
        this.$data.loginType = 'fast';
        this.$store.dispatch('user/login', {
          action: 'fast',
          params: {
            password: md5(`hy${new Date().getTime()}LongQi`)
          }
        });
        break;
    }
  }
  // 切换登录弹窗
  private showLogin() {
    this.$data.mobile = false;
    this.$data.login = true;
  }
  // 平台登录
  private goLogin({ action, params }: { action: string; params: any }) {
    this.$data.loginType = action;
    this.$store.dispatch('user/login', {
      action,
      params: {
        ...this.$data.sdkOptions,
        ...params
      }
    });
  }
  // 登录游戏成功
  private playGame() {
    if (this.$data.loginType !== 'fast') {
      this.showToast('登录成功');
    }
    this.$data.login = false;
    this.$data.mobile = false;
    this.$data.fastRest = false;
    this.$data.loginType = '';
    this.postMessage({
      action: 'loginSuccess',
      datas: this.$store.getters['user/getSDKUserInfo']
    });
  }

  // 用户中心控制面板
  private showCenter() {
    // 判断是否登录平台
    if (!this.$store.getters['user/isLogin']) {
      return (this.$data.login = true);
    }
    // 判断是否登录游戏
    if (!this.$store.getters['user/isGameLogin']) {
      return this.$store.commit({
        type: `user/${UPDATEUSERACTION}`,
        data: 'logined'
      });
    }
    this.$data.center = true;
  }
  private centerAction({ action, params }: { action: string; params: any }) {
    console.log(action, params);
    if (action === 'wxTip' && params) {
      if (!isWx) {
        const userInfo = this.$store.state.user.userInfo;
        return (window.location.href = `http://cs.huiyaohuyu.cc/test.html?device=h5&guid=${
          userInfo.guid
        }&account=${userInfo.username}&level=${userInfo.cs_vip_level}`);
      }
      this.$data.wxTip = {
        show: true,
        msg: params
      };
    } else if (action === 'account') {
      this.$data.center = false;
      this.$data.account = true;
    }
  }
  // 账号管理
  private showAccount() {
    this.$data.bindMobile = false;
    this.$data.psw = false;
    this.$data.account = true;
    this.$data.accountActionType = '';
  }
  private accountAction(action: string) {
    this.$data.account = false;
    if (action === 'mobile') {
      this.$data.bindMobile = true;
    } else {
      this.$data.psw = true;
    }
    console.log(action);
  }
  // 绑定手机号
  private mobileBind({ params }: { params: { mobile: string; code: string } }) {
    this.$data.accountActionType = 'bindMobile';
    this.$store.dispatch('user/mobileBind', {
      ...params
    });
  }
  // 更新密码
  private changePassword({ action, params }: { action: string; params: any }) {
    console.log(action, params);
    this.$data.accountActionType = action;
    if (action === 'mobile') {
      return this.$store.dispatch('user/passwordReset', {
        mobile: params.mobile,
        code: params.code,
        password: md5(params.password)
      });
    }
    return this.$store.dispatch('user/passwordUpdate', {
      old_password: md5(params.old_password),
      password: md5(params.password),
      re_password: md5(params.re_password)
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
    const { gid, openid } = this.$route.query;
    this.$data.sdkOptions = {
      app: gid || '',
      app_id: gid || '',
      openid: openid || ''
    };
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
