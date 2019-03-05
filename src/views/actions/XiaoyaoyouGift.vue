<template>
  <div class="xxy-gift" ref="xxy" :style="style">
    <img :src="require('../../assets/actions/xiaoyaoyou/bg.jpg')">
    <div class="card">{{ card }}</div>
    <clip-board class="get" :text="card" />
    <input type="hidden" :value="action">
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ClipBoard from '@/components/ClipBoard.vue';
import { mapState } from 'vuex';
import { UPDATETOAST, UPDATELOAD } from '@/stores/types';
import md5 from 'md5';
import { post } from '@/utils/ts/fetch';
import { cqApi, gamerStorageName } from '@/config';
import { deviceInit } from '@/api/u9api';
import { getStorage, setStorage } from '@/utils/ts/storage';
import isWx from '@/utils/ts/device/isWx';
import clipboard from '@/utils/ts/clipboard';
let lock: boolean = false;

@Component({
  components: {
    ClipBoard
  },
  computed: {
    ...mapState('user', {
      action(state: any) {
        if (state.userAction === 'logined' && state.gamerAction !== 'logined') {
          // 当平台登录的操作手柄存在时，自动登录游戏
          this.$store.dispatch('user/loginGame', {
            ...this.$data.sdkOptions
          });
        } else if (state.userAction === 'logined' && state.gamerAction === 'logined') {
          this.getCard();
        }
      }
    })
  }
})
export default class XiaoyaoyouGift extends Vue {
  private data() {
    return {
      style: {
        fontSize: '100px'
      },
      sdkOptions: {
        app: '',
        app_id: '',
        device: '',
        openid: ''
      },
      card: ''
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
  private importClipBoardJS() {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = '//cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js';
      script.type = 'text/javascript';
      script.onload = resolve;
      (document.querySelector('head') as HTMLElement).appendChild(script);
    });
  }
  // 初始化设备
  private init() {
    const { openid } = this.$data.sdkOptions;
    const deviceImei = getStorage('device');
    const storageImei = (deviceImei && deviceImei.imei) || '0';
    deviceInit({
      ...this.$data.sdkOptions,
      brand_desc: openid === '' || openid === '0' ? '' : '公众号',
      imei: openid !== '' && openid !== '0' ? openid : storageImei
    })
      .then((res: { data: { device: number; imei: string } }) => {
        const { imei, device } = res.data;
        if (device) {
          this.$data.sdkOptions = {
            ...this.$data.sdkOptions,
            device
          };
          if (!(deviceImei && deviceImei.imei)) {
            setStorage('device', { imei });
          }
        }
        this.goLogin();
      })
      .catch((err: { message: string }) => {
        this.showToast(err.message);
      });
  }
  // 登录
  private goLogin() {
    const userInfo = this.$store.getters['user/userInfo'];
    const storeGamerInfo = getStorage(`${gamerStorageName}-${userInfo.uid}-${userInfo.app}`);
    if (!!userInfo.uid && !!userInfo.token  && !!storeGamerInfo.userId) {
      this.getCard(storeGamerInfo.userId);
    } else {
      this.$store.dispatch('user/login', {
        action: 'fast',
        params: {
          ...this.$data.sdkOptions,
          password: md5(`hy${new Date().getTime()}LongQi`)
        }
      });
    }
  }
  // 获取礼包
  private getCard(uid?: string) {
    if (!isWx) {
      return this.showToast('请使在微信内打开哦');
    }
    const storageCard = getStorage('card');
    if (storageCard) {
      return this.$data.card = storageCard;
    }
    if (lock) {
      return;
    }
    lock = true;
    const gamerInfo = this.$store.getters['user/gamerInfo'];
    this.updateLoading(true);
    post(`${cqApi}/lqhy/getCode`, {
      datas: {
        uid: uid ? uid : gamerInfo.userId || ''
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((res: { data: { card: string } }) => {
        lock = false;
        this.updateLoading(false);
        const { card } = res.data;
        this.$data.card = card || '';
        setStorage('card', card);
      })
      .catch((err: { message: string }) => {
        lock = false;
        this.updateLoading(false);
        this.showToast(err.message);
      });
  }
  private resetFontSize() {
    if (this.$refs.xxy) {
      let screenWidth = (this.$refs.xxy as HTMLElement).clientWidth;
      screenWidth = screenWidth > 414 ? 414 : screenWidth;
      const fontSize = (screenWidth / 375) * 100;
      this.$data.style = {
        fontSize: `${fontSize}px`
      };
    }
  }
  // lifecycle
  private created() {
    const { openId, gid } = this.$route.query;
    const { sdkOptions, style } = this.$data;
    this.$data.sdkOptions = {
      ...sdkOptions,
      app: gid,
      app_id: gid,
      openid: openId
    };
    if (!isWx) {
      this.showToast('请使在微信内打开哦');
    } else {
      this.init();
    }
  }
  private mounted() {
    this.resetFontSize();
    window.addEventListener('resize', this.resetFontSize, false);
    clipboard();
  }
}
</script>
<style lang="scss" scoped>
.xxy-gift {
  position: relative;
  margin: 0 auto;
  height: auto;
  width: 100%;
  max-width: 414px;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .card,
  .get,
  .tips {
    position: absolute;
    z-index: 2;
    top: 3.66em;
  }
  .card {
    left: 50%;
    top: 20.33em;
    width: 10.67em;
    height: 2.5em;
    line-height: 2.5em;
    font-family: 'Microsoft Yahei';
    font-size: 0.18em;
    color: #fff;
    text-align: center;
    user-select: auto;
    transform: translate3d(-50%, 0, 0);
  }
  .get {
    left: 50%;
    top: 4.26em;
    width: 0.94em;
    height: 0.31em;
    text-indent: -9999px;
    user-select: auto;
    cursor: pointer;
    overflow: hidden;
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
