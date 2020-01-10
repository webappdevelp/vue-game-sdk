<template>
  <div class="xxy-gift" ref="xxy" :style="style">
    <img :src="require('@/assets/games/10092/attention-bg.jpg')" />
    <div class="card">{{ card }}</div>
    <clip-board class="get" :text="card" />
    <input type="hidden" :value="action" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { mapState } from 'vuex';
import CommonMix from '@/mixins/common';
import DeviceInitMix from '@/mixins/deviceInit';
import StorageUserGamerMix from '@/mixins/getStorageUserGamerInfo';
import AccountMix from '@/mixins/account';
import ClipBoard from '@/components/ClipBoard.vue';
import { post } from '@/utils/ts/fetch';
import { gaoruifa } from '@/config';
import { getCookie, setCookie } from '@/utils/ts/cookies';
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
        } else if (
          state.userAction === 'logined' &&
          state.gamerAction === 'logined'
        ) {
          this.getCard();
        }
      }
    })
  }
})
export default class XiaoyaoyouGift extends Mixins(
  CommonMix,
  DeviceInitMix,
  StorageUserGamerMix,
  AccountMix
) {
  public data() {
    return {
      style: {
        fontSize: '100px'
      },
      sdkOptions: {
        app_id: '',
        device: '',
        channel: '',
        channel_id: '',
        channelId: '',
        sdk_version: '2'
      },
      gameDatas: {},
      card: ''
    };
  }

  // methods
  // 初始化设备
  private async init() {
    // 设备初始化激活
    const result = await this.deviceInit('api');
    this.goLogin();
  }
  // 登录
  private goLogin() {
    if (
      this.$store.getters['user/isLogin'] &&
      this.$store.getters['user/isGameLogin']
    ) {
      this.getCard();
    } else {
      this.login({ action: 'fast' });
    }
  }
  // 获取礼包
  private getCard() {
    if (!isWx) {
      return this.updateToast('请使在微信内打开哦');
    }
    const storageCard = getCookie('card');
    if (storageCard) {
      return (this.$data.card = storageCard);
    }
    if (lock) {
      return;
    }
    lock = true;
    const gamerInfo = this.$store.getters['user/gamerInfo'];
    this.updateLoading(true);
    post(`//${window.location.hostname}/lqhy/getCode`, {
      datas: {
        uid: gamerInfo.userId || ''
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
        setCookie('card', card);
      })
      .catch((err: { message: string }) => {
        lock = false;
        this.updateLoading(false);
        this.updateToast(err.message);
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
  private beforeCreate() {
    document.title = '梦幻逍遥游';
    clipboard();
  }
  private created() {
    if (!isWx) {
      return this.updateToast('请使在微信内打开哦');
    }
    let { aid } = this.$route.query;
    aid = (aid as string) || '0';
    this.getStorageUserInfo({ gid: '10092', startOrigin: 'grf' });
    this.getStorageGamerInfo({
      gid: '10092',
      channelId: '154',
      startOrigin: 'grf'
    });
    this.initSdkOptions({ aid, gid: '10092', channel: '154', startOrigin: 'grf' });
    const userInfo = this.$store.getters['user/userInfo'];
    if (!userInfo.openid) {
      return (window.location.href = `/user/wxAuth?callback_url=${encodeURIComponent(
        window.location.href
      )}&app_id=10092&channel_id=154`);
    }
    this.init();
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
