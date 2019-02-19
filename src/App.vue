<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <loading :show="loading" />
    <toast :show="toast" :msg="toastMsg" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <a href="javascript:;" @click="toggleLoading">显示/隐藏loading</a>
    <a href="javascript:;" @click="toggleToast">显示/隐藏toast</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    Loading,
    Toast,
    HelloWorld
  }
})
export default class App extends Vue {
  private data() {
    return {
      loading: false,
      toast: false,
      toastMsg: ''
    };
  }
  // methods
  private toggleLoading() {
    this.$data.loading = !this.$data.loading;
  }
  private toggleToast() {
    this.$data.toast = !this.$data.toast;
    this.$data.toastMsg = 'toast提示信息';
    if (this.$data.toast) {
      setTimeout(() => {
        this.$data.toast = false;
        this.$data.toastMsg = '';
      }, 2500);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
