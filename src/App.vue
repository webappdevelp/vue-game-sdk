<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" ref="bg">
    <loading :show="loading" />
    <toast :show.sync="toast" :msg="toastMsg" />
    <wx-to-browser :show.sync="wxToBrowser" :msg="wxToBrowserMsg" />
    <control msg="1" @click="showCenter" />
    <Login :show.sync="login" />
    <manger :show.sync="manger" />
    <fast-result :show.sync="fastReg" @click="hideFastReg"/>
    <hy-center :show.sync="center" />
    <hy-auto :show.sync="auto" @click="hideAuto" />
    <h3 class="title">功能展示</h3>
    <ul class="all">
      <li><a @click="toggleLoading">显示/隐藏loading</a></li>
      <li><a @click="toggleToast">显示/隐藏toast</a></li>
      <li><a @click="showWxMsg">显示微信提示</a></li>
      <li><a @click="showLogin">显示登录弹窗</a></li>
      <li><a @click="showManger">显示账号管理弹窗</a></li>
      <li><a @click="showFastReg">显示快速注册成功弹窗</a></li>
      <li><a @click="showAuto">显示自动登录弹窗</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import WxToBrowser from '@/components/WxToBrowserTip.vue';
import Control from '@/components/scenes/Control.vue';
import Btn from '@/components/Btn.vue';
import Login from '@/components/scenes/Login.vue';
import Manger from '@/components/scenes/AccountManger.vue';
import FastResult from '@/components/scenes/FastResult.vue';
import HyCenter from '@/components/scenes/Center.vue';
import HyAuto from '@/components/scenes/AutoLogin.vue';

@Component({
  components: {
    Loading,
    Toast,
    WxToBrowser,
    Control,
    Btn,
    Login,
    Manger,
    FastResult,
    HyCenter,
    HyAuto
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
      login: false,
      manger: false,
      fastReg: false,
      center: false,
      auto: false,
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
  private showManger() {
    this.$data.manger = true;
  }
  private showFastReg() {
    this.$data.fastReg = true;
  }
  private hideFastReg() {
    this.$data.fastReg = false;
  }
  private showCenter() {
    this.$data.center = true;
  }
  private showAuto() {
    this.$data.auto = true;
  }
  private hideAuto() {
    this.$data.auto = false;
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
  color: #2c3e50;
}
.title {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
.all li {
  display: inline-block;
  margin: 0 10px;
}
.all a {
  color: #42b983;
}
</style>
