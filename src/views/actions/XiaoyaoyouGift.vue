<template>
  <div class="xxy-gift" ref="xxy" :style="style">
    <img :src="require('../../assets/actions/xiaoyaoyou/bg.jpg')" />
    <div class="card">{{ card }}</div>
    <div class="get" @click="getCard">点击领取</div>
    <div class="tips">温馨提示：<br /> 1、进入游戏，点击主界面【激活码】输入礼包兑换码； <br />2、一码一兑换，一个角色只能领取一次；</div>
    <input type="hidden" :value="action" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { UPDATETOAST, UPDATELOAD } from '@/stores/types';
import md5 from 'md5';
import { post } from '@/utils/ts/fetch';
import { cqApi } from '@/config';
import { deviceInit } from '@/api/u9api';
import { getStorage, setStorage } from '@/utils/ts/storage';
import isWx from '@/utils/ts/device/isWx';
let lock: boolean = false;

@Component({
  computed: {
    ...mapState('user', {
      action(state: any) {
        if (state.userAction === 'logined' && state.gamerAction !== 'logined') {
          // 当平台登录的操作手柄存在时，自动登录游戏
          this.$store.dispatch('user/loginGame', {
            ...this.$data.sdkOptions
          });
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
        this.updateLoading(false);
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
        this.updateLoading(false);
        this.showToast(err.message);
      });
  }
  // 登录
  private goLogin() {
    this.$store.dispatch('user/login', {
      action: 'fast',
      params: {
        ...this.$data.sdkOptions,
        password: md5(`hy${new Date().getTime()}LongQi`)
      }
    });
  }
  // 获取礼包
  private getCard() {
    if (lock) {
      return;
    }
    lock = true;
    const gamerrInfo = this.$store.getters['user/gamerInfo'];
    this.updateLoading(true);
    post(`${cqApi}/lqhy/getCode`, {
      datas: {
        uid: gamerrInfo.userId || ''
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
      })
      .catch((err: { message: string }) => {
        lock = false;
        this.updateLoading(false);
        this.showToast(err.message);
      });
  }
  private resetFontSize() {
    let screenWidth = (this.$refs.xxy as HTMLElement).clientWidth;
    screenWidth = screenWidth > 414 ? 414 : screenWidth;
    const fontSize = (screenWidth / 375) * 100;
    this.$data.style = {
      fontSize: `${fontSize}px`
    };
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
    width: 10.67;
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
    overflow: hidden;
    transform: translate3d(-50%, 0, 0);
  }
  .tips {
    top: 40.9em;
    left: 1.54em;
    right: 1.54em;
    font-family: 'Microsoft Yahei';
    font-size: 0.13em;
    font-weight: bold;
    line-height: 1.5;
    color: #1d146c;
    text-shadow: 0 0 1.15em rgba(255, 255, 255, 0.75);
  }
}
</style>
