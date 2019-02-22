<template>
  <div class="scenes">
    <control :show="control" @click="showCenter" />
    <hy-center :show.sync="center" />
    <account-manger />
    <login />
    <mobile-login />
    <password />
    <fast-result />
    <loading :show="loading" />
    <toast :show.sync="toast.show" :msg="toast.msg" />
    <iframe
      v-if="gameUrl !== ''"
      @load="start"
      ref="game"
      :src="gameUrl"
      height="100%"
      width="100%"
      scrolling="no"
      frameborder="0"
      style="border: 0 none;">
    </iframe>
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
import { UPDATETOAST, UPDATELOAD } from '@/stores/types';
import { mapState } from 'vuex';
import { cqApi } from '@/config';
import { get } from '@/utils/ts/fetch';
import getQuery from '@/utils/ts/getQuery';
const gameId: string = getQuery('gid') || '0';

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
    ...mapState(['toast', 'loading'])
  }
})
export default class Scenes extends Vue {
  private data() {
    return {
      control: false,
      center: false,
      login: false,
      mobile: false,
      gameUrl: ''
    };
  }

  // methods
  private postMessage(params: { action: string; data?: any }) {
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
      console.log('sdk-->cpsdk successed');
      const datas = JSON.parse(data);
    }
  }
  // 获取页面初始化信息
  private getInitData() {
    get(`${cqApi}/game/detail`, {
      datas: {
        gid: gameId
      }
    })
      .then(
        (res: {
          data: {
            cp_origin: string;
            cp_url: string;
            title: string;
          };
        }) => {
          this.$store.commit({
            type: UPDATELOAD,
            data: false
          });
          let { data } = res;
          data = data || {};
          const { title, cp_origin, cp_url } = data;
          if (!!title) {
            document.title = title;
          }
          this.$data.gameUrl = cp_url;
          hyPSMOrigin = cp_origin;
        }
      )
      .catch((err: { message: string }) => {
        this.$store.commit({
          type: UPDATELOAD,
          data: false
        });
        this.$store.commit({
          type: UPDATETOAST,
          data: err.message
        });
      });
  }
  // 开始和cp sdk通信
  private start() {
    hyPSMSource = (this.$refs.game as HTMLIFrameElement).contentWindow;
    this.postMessage({
      action: 'init'
    });
  }
  private showCenter() {
    this.$data.center = true;
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
    const { userInfo } = this.$store.state;
    console.log(userInfo);
  }
}
</script>
<style lang="scss" scoped>
.scenes {
  height: 100%;
  width: 100%;
}
</style>
