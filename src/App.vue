<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" ref="bg">
    <loading :show="loading" />
    <toast :show.sync="toast" :msg="toastMsg" />
    <wx-to-browser :show.sync="wxToBrowser" :msg="wxToBrowserMsg" />
    <control msg="1" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <btn @click="toggleLoading" text="显示/隐藏loading"></btn>
    <btn @click="toggleToast" text="显示/隐藏toast"></btn>
    <btn @click="showWxMsg" text="显示微信提示"></btn>
    <Login :show.sync="login" />
    <mobile-login :show.sync="mobileLogin" />
    <btn @click="showLogin" text="显示登录弹窗"></btn>
    <btn @click="showMobileLogin" text="显示手机号登录弹窗"></btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import WxToBrowser from '@/components/WxToBrowserTip.vue';
import Control from '@/components/Control.vue';
import Btn from '@/components/Btn.vue';
import Login from '@/components/scenes/Login.vue';
import MobileLogin from '@/components/scenes/MobileLogin.vue';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    Loading,
    Toast,
    WxToBrowser,
    Control,
    Btn,
    Login,
    MobileLogin,
    HelloWorld
  }
})
export default class App extends Vue {
  private data() {
    return {
      loading: false,
      toast: false,
      toastMsg: '',
      wxToBrowser: false,
      wxToBrowserMsg: '',
      password: 'password',
      login: false,
      mobileLogin: false,
    };
  }
  // methods
  private toggleLoading() {
    this.$data.loading = !this.$data.loading;
  }
  private toggleToast() {
    console.log(this.$data.toast);
    this.$data.toast = true;
    this.$data.toastMsg = 'toast提示信息';
  }
  private showWxMsg() {
    this.$data.wxToBrowser = true;
    this.$data.wxToBrowserMsg = '啊哈哈';
  }
  private showLogin() {
    this.$data.login = true;
  }
  private showMobileLogin() {
    console.log('dd');
    this.$data.mobileLogin = true;
  }
}
</script>
<style lang="scss">
@import '@/utils/sass/_reset.scss';
#app {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 750px;
  background: #fff;
  overflow: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
