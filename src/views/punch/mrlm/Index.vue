<template>
  <section class="mrlm" :style="wrapperStyle">
    <section class="part part1">
      <img :src="require('@/assets/games/1019/bg_1.jpg')" alt="生化围城" />
      <img :src="require('@/assets/games/1019/bg2.jpg')" alt="生化围城" />
      <img :src="require('@/assets/games/1019/bg3.jpg')" alt="生化围城" />
    </section>
    <section class="part part2">
      <!-- <img :src="require('@/assets/games/1019/bg4.jpg')" alt="生化围城" /> -->
      <div v-if="signed" class="btn disabled"></div>
      <div v-else class="btn" @click="goSign"></div>
      <div class="change" @click="switchChange"></div>
      <p>当前绑定的区服：{{ zone_id }}，角色：{{ role_name }}</p>
    </section>
    <section class="part part3">
      <img :src="require('@/assets/games/1019/bg5.jpg')" alt="生化围城" />
      <img :src="require('@/assets/games/1019/bg6.jpg')" alt="生化围城" />
      <img :src="require('@/assets/games/1019/bg7.jpg')" alt="生化围城" />
      <img :src="require('@/assets/games/1019/bg8.jpg')" alt="生化围城" />
      <template v-for="(item, index) in days">
        <monster :key="item" :day="item" :class="getActiveClass(index + 1)" />
      </template>
    </section>
    <section class="part part4">
      <img :src="require('@/assets/games/1019/bg_9.jpg')" alt="活动规则" />
    </section>
    <select-dialog
      :show="showSelectDialog"
      :datas="{ zones, roles, zone_id, role_id }"
      @zone-change="zoneChange"
      @role-change="roleChange"
      @btn-action="selectDialogAction"
    />
    <login :show.sync="showLogin" @btn-action="switchLogin" @submit="login" />
    <mobile-login
      btn-text="立即登录"
      :show="showMobile"
      :code-btn="codeBtn"
      @back="switchLogin()"
      @get-code="getCode"
      @submit="login"
    />
    <hy-alert
      btn-text="知道了"
      title="温馨提示"
      z-index="30"
      :show="showAlert"
      :need-close="false"
      @action="hideAlert"
    >
      <template slot="content">
        <div class="alert">{{ alertText }}</div>
      </template>
    </hy-alert>
    <input type="hidden" name="" :value="action" />
  </section>
</template>
<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Login from '@/components/form/Login.vue';
import MobileLogin from '@/components/form/Mobile.vue';
import HyAlert from '@/components/Alert.vue';
import Monster from './Monster.vue';
import SelectDialog from './Select.vue';
import ResetBaseFontSizeMix from '@/mixins/resetWrapperFontSize';
import CommonMix from '@/mixins/common';
import AccountMix from '@/mixins/account';
import isIOS from '@/utils/ts/device/isIOS';
import { get } from '@/utils/ts/fetch';
import { UPDATEGAMERINFO } from '@/store/types';
import { getCookie, setCookie } from '@/utils/ts/cookies';
import isWx from '@/utils/ts/device/isWx';
const defaultDays: number[] = [];
for (let i = 1; i <= 30; i++) {
  defaultDays.push(i);
}
let charaList: any[] = [];

@Component({
  components: {
    Login,
    MobileLogin,
    Monster,
    SelectDialog,
    HyAlert
  },
  computed: {
    ...mapState('user', {
      username(state: any) {
        return state.userInfo.username;
      },
      action(state: any) {
        if (state.gamerAction !== 'logined' && state.userAction === 'logined') {
          if (!isIOS) {
            this.$store.dispatch('user/loginGame', {
              ...this.$data.sdkOptions
            });
          } else {
            this.$store.commit({
              type: `user/${UPDATEGAMERINFO}`,
              data: {
                userId: '999'
              },
              action: 'logined'
            });
          }
        }
        if (state.gamerAction === 'logined' && state.userAction === 'logined') {
          this.$data.showLogin = false;
          this.$data.showMobile = false;
          this.getMyGames();
        }
        return state.userAction;
      }
    })
  }
})
export default class Mrlm extends Mixins(
  CommonMix,
  AccountMix,
  ResetBaseFontSizeMix
) {
  public data() {
    return {
      channel_id: '',
      app_id: '',
      sdkOptions: {
        app_id: '',
        channel: '',
        channel_id: '',
        openid: '',
        device: '',
        sdk_version: '2',
        start_origin: ''
      },
      gameDatas: {
        id: '',
        name: '',
        origin: '',
        link: '',
        infos: [],
        kefu: {}
      },
      loginType: '',
      codeBtn: {
        color: 'green',
        text: '获取验证码'
      },
      wrapperStyle: {
        fontSize: '100px'
      },
      showAlert: false,
      alertText: '',
      showLogin: false,
      showMobile: false,
      showSelectDialog: false,
      zones: [],
      roles: [],
      user_id: '',
      openid: '',
      zone_id: '',
      role_id: '',
      role_name: '',
      days: defaultDays,
      totalDays: 0,
      signed: false
    };
  }

  // methods
  private getActiveClass(index: number) {
    const { totalDays, days } = this.$data;
    let className = '';
    if (index <= totalDays) {
      className += 'active';
    }
    if (index === days.length) {
      className += ' last';
    }
    return className;
  }
  // 获取当月天数
  private getDays() {
    get('//bu.hygame.cc/wechat/howManyDaysThisMonth')
      .then((res: { data: { days: number } }) => {
        let { days } = res.data;
        days = days || 30;
        const tempDays: number[] = [];
        for (let i = 1; i <= days; i++) {
          tempDays.push(i);
        }
        this.$data.days = tempDays;
      })
      .catch((err: { message: string }) => {
        this.updateToast(err.message);
      });
  }
  // 根据openid获取之前的登录信息
  private async getSignedInfo() {
    const { openid } = this.$data;
    try {
      const result = await get(
        '//bu.hygame.cc/wechat/lastSignInRoleInfo',
        {
          datas: {
            open_id: openid
          }
        }
      );
      const { last_sign_in_info } = result.data;
      const {
        role_id,
        role_name,
        zone_id,
        user_id,
        channel_id,
        app_id
      } = last_sign_in_info;
      this.$data.zone_id = zone_id;
      this.$data.user_id = user_id;
      this.$data.role_id = role_id;
      this.$data.role_name = await this.getRoleName();
      this.$data.app_id = app_id;
      this.$data.channel_id = channel_id;
      const signed = await this.isSigned();
      this.$data.signed = !!signed;
      this.getSignInDays();
    } catch (err) {
      this.checkLogin(this.getMyGames);
    }
  }
  // 判断是否登录
  private async checkLogin(cb: () => void) {
    if (!this.$store.getters['user/isLogin']) {
      this.$data.showLogin = true;
    } else if (!this.$store.getters['user/isGameLogin']) {
      if (!isIOS) {
        this.$store.dispatch('user/loginGame', {
          ...this.$data.sdkOptions
        });
      } else {
        this.$store.commit({
          type: `user/${UPDATEGAMERINFO}`,
          data: {
            userId: '999'
          },
          action: 'logined'
        });
      }
    } else if (isIOS) {
      this.checkApiToken(cb);
    } else {
      this.checkU9Token(cb);
    }
  }
  // 判断是否可以签到
  private async isSigned() {
    const { user_id, zone_id, role_id, role_name, openid } = this.$data;
    try {
      const result = await get('//bu.hygame.cc/wechat/canISignInToday', {
        datas: {
          user_id,
          open_id: openid,
          zone_id,
          role_id,
          role_name
        }
      });
      return result.status;
    } catch (err) {
      // this.updateToast(err && err.message);
      return !0;
    }
  }
  // 获取更新的角色名称
  private async getRoleName() {
    const { user_id, zone_id, role_id } = this.$data;
    let role_name = '';
    try {
      const result = await get(
        'http://gateway.hy.warz.mumgames.com/gameservice/charalist.php',
        {
          datas: {
            pf: 'cn_hy',
            pfId: user_id
          }
        }
      );
      if (result.charaList && result.charaList.length) {
        result.charaList.forEach(
          (item: { server: string; gameUid: string; name: string }) => {
            if (item.server === zone_id && item.gameUid === role_id) {
              role_name = item.name;
            }
          }
        );
      }
      return role_name;
    } catch (err) {
      return '';
    }
  }
  // 获取签到数据
  private getSignInDays() {
    const { user_id, zone_id, role_id, role_name, openid } = this.$data;
    get('//bu.hygame.cc/wechat/getUserSignInTimes', {
      datas: {
        user_id,
        zone_id: zone_id,
        role_id: role_id,
        role_name,
        open_id: openid
      }
    })
      .then((res: { data: any }) => {
        const { times } = res.data;
        this.$data.totalDays = times;
      })
      .catch((err: { code: number; message: string }) => {
        this.updateToast(err.message);
      });
  }
  // 拉取uid下的所有对应的游戏列表
  private getMyGames() {
    const userInfo = this.$store.getters['user/userInfo'];
    const gamerInfo = this.$store.getters['user/gamerInfo'];
    const userid = isIOS ? userInfo.uid : gamerInfo.userId;
    this.$data.user_id = userid;
    this.$data.uid = userInfo.uid;
    get('//bu.hygame.cc/wechat/getUIdAllGameName', {
      datas: {
        uid: userInfo.uid
      }
    })
      .then((result: { data: { app_list: any[] } }) => {
        const { app_list } = result.data;
        const tempApps: any[] = [];
        app_list.reduce(
          (
            prev: { user_id: string | number },
            next: { user_id: string | number }
          ) => {
            if (!prev.user_id || (prev.user_id !== next.user_id)) {
              tempApps.push(next);
            }
            return next;
          },
          {}
        );
        this.$data.apps = tempApps;
        this.getCPDatas(tempApps.length - 1);
      })
      .catch((err: { message: string }) => {
        this.updateToast(err.message);
      });
  }
  // 远端拉取角色和区服信息
  private getCPDatas(num: number) {
    const { apps } = this.$data;
    let i = 0;
    const _self = this;
    getRoles();
    async function getRoles() {
      const url = 'http://gateway.hy.warz.mumgames.com/gameservice/charalist.php';
      //正式服地址 http://g.t2.hy.warz.mumgames.com/gameservice/charalist.php
      try {
        const result = await get(url, {
          datas: {
            pf: 'cn_hy',
            pfId: apps[i].user_id
          }
        });
        let tempCharaList: any[] = [];
        if (result.charaList && result.charaList.length) {
          tempCharaList = result.charaList.filter((item: any) => {
            item.channel_id = apps[i].channel_id;
            item.app_id = apps[i].id;
            item.user_id = apps[i].user_id;
            if (item.pf === 'cn_hy') {
              return item;
            }
          });
        }
        charaList = charaList.concat(tempCharaList || []);
        ++i;
        if (i > num) {
          if (charaList.length) {
            _self.formatZones();
            _self.$data.showSelectDialog = true;
          } else {
            _self.alertMsg('您暂时无法参与该活动');
          }
        } else {
          getRoles();
        }
      } catch (err) {
        _self.alertMsg('您暂时无法参与该活动');
        console.log(err);
      }
    }
  }
  // 格式化区服数据
  private formatZones() {
    const { zone_id } = this.$data;
    const zones: any[] = [];
    const tempZones: any = {};
    const roles: any[] = [];
    charaList.forEach((item: { pf: string; server: string }) => {
      // if (item.pf === 'cn_hy') {
      if (!tempZones[item.server]) {
        zones.push(item.server);
        tempZones[item.server] = true;
      }
      // }
    });
    const defaultZone = zone_id ? zone_id : zones[0];
    charaList.forEach(
      (item: { server: string; name: string; gameUid: string }) => {
        if (item.server === defaultZone) {
          roles.push({
            name: item.name,
            id: item.gameUid
          });
        }
      }
    );
    this.$data.zone_id = defaultZone;
    this.$data.zones = zones;
    this.$data.roles = roles;
  }
  // 切换区服后，重新生成对应区服下的角色数据
  private zoneChange(id: string) {
    const { zone_id } = this.$data;
    if (id === zone_id) {
      return;
    }
    const roles: any[] = [];
    charaList.forEach(
      (item: { name: string; server: string; pf: string; gameUid: string }) => {
        if (item.server === id) {
          roles.push({
            name: item.name,
            id: item.gameUid
          });
        }
      }
    );
    this.$data.role_id = '';
    this.$data.role_name = '';
    this.$data.zone_id = id;
    this.$data.roles = roles;
  }
  // 切换角色
  private roleChange(id: string) {
    const { roles } = this.$data;
    this.$data.role_id = id;
    roles.forEach((item: { id: string; name: string }) => {
      if (item.id === id) {
        this.$data.role_name = item.name;
        return;
      }
    });
  }
  // 登录面板交互
  private switchLogin(action: string = '') {
    switch (action) {
      case 'mobile':
        this.$data.showLogin = false;
        this.$data.showMobile = true;
        break;
      default:
        this.$data.showMobile = false;
        this.$data.showLogin = true;
        break;
    }
  }
  // 获取短信验证码
  private getCode(params: { mobile: string; action: string }) {
    this.getVerifyCode({
      cutdown: true,
      ...params
    });
  }

  // 选择弹窗交互
  private selectDialogAction(action: string = '') {
    const { zone_id, role_id, sdkOptions } = this.$data;
    let { user_id } = this.$data;
    switch (action) {
      case 'close':
        this.$data.showSelectDialog = false;
        this.$data.role_id = '';
        this.$data.role_name = '';
        break;
      default:
        if (!zone_id) {
          return this.updateToast('请选择区服');
        } else if (!role_id) {
          return this.updateToast('请选择角色');
        }
        let channel_id = sdkOptions.channel_id;
        let app_id = sdkOptions.app_id;
        charaList.forEach(
          (item: {
            server: string;
            gameUid: string;
            channel_id: number;
            app_id: number;
            user_id: string | number;
          }) => {
            if (item.server === zone_id && item.gameUid === role_id) {
              channel_id = item.channel_id;
              app_id = item.app_id;
              user_id = item.user_id;
            }
          }
        );
        this.$data.user_id = user_id;
        this.$data.channel_id = channel_id;
        this.$data.app_id = app_id;
        this.$data.showSelectDialog = false;
        // this.goSign();
        break;
    }
  }
  // 更换绑定
  private switchChange() {
    /* if (!isWx) {
      return this.updateToast('请在微信内操作');
    } */
    this.logOut();
    charaList = [];
    this.$data.user_id = '';
    this.$data.zone_id = '';
    this.$data.role_id = '';
    this.$data.role_name = '';
    this.$data.channel_id = '';
    this.$data.app_id = '';
    this.$data.totalDays = 0;
    this.$data.signed = false;
    this.$data.showLogin = true;
  }
  // 签到
  private goSign() {
    const {
      signed,
      openid,
      user_id,
      role_id,
      zone_id,
      channel_id,
      app_id
    } = this.$data;
    /* if (!isWx) {
      return this.updateToast('请在微信内操作');
    } else  */
    if (signed) {
      return this.updateToast('您已经签到了哦');
    } else if (!user_id) {
      this.$data.showLogin = true;
      return this.updateToast('请先登录哦');
    } else if (!zone_id) {
      if (charaList.length) {
        this.$data.showSelectDialog = true;
        return this.updateToast('请选择区服');
      } else {
        return this.alertMsg('您暂时无法参与该活动');
      }
    } else if (!role_id) {
      if (charaList.length) {
        this.$data.showSelectDialog = true;
        return this.updateToast('请选择角色');
      } else {
        return this.alertMsg('您暂时无法参与该活动');
      }
    }

    get('//bu.hygame.cc/wechat/gzhSignIn', {
      datas: {
        user_id,
        zone_id,
        role_id,
        open_id: openid,
        channel_id,
        app_id
      }
    })
      .then((res: { status?: number; message?: string }) => {
        if (res.status === 0) {
          this.updateToast('签到成功, 请在游戏内查看奖励', 3000);
          this.$data.signed = true;
          this.getSignInDays();
        } else {
          this.updateToast(res.message || '签到失败');
        }
      })
      .catch((err: { code: number; message: string }) => {
        this.updateToast(err.message);
      });
  }
  // 显示弹窗
  private alertMsg(msg: string) {
    this.$data.alertText = msg;
    this.$data.showAlert = true;
  }
  // 隐藏提示弹窗
  private hideAlert() {
    this.$data.showAlert = false;
  }

  // lifecycles
  private beforeCreate() {
    document.title = '每日签到';
  }
  private created() {
    this.getDays();
    let { openid } = this.$route.query;
    openid = openid || getCookie('openid') || '';
    if (!openid) {
      return (window.location.href =
        '//aliyun.gaoruifa.cn/minigame/getWxSignInOpenId');
    } else {
      setCookie('openid', openid as string);
      this.$data.openid = openid;
      window.history.replaceState(null, '每日签到', window.location.href.split('?')[0]);
    }
    const app = isIOS ? '1099' : '1047';
    const channel = isIOS ? '155' : '154';
    /** cctag使用说明
     * 高瑞发: grf, 广州：gf, 深圳：sz
     */
    this.getStorageUserInfo({
      gid: app,
      startOrigin: 'sz'
    });
    this.getStorageGamerInfo({
      gid: app,
      channelId: channel,
      startOrigin: 'sz'
    });
    this.initSdkOptions({ aid: '0', gid: app, channel, startOrigin: 'sz' });
    this.getSignedInfo();
  }
  private mounted() {
    this.resetFontSize();
    window.addEventListener('resize', this.resetFontSize, false);
  }
}
</script>
<style>
html,
body,
#app {
  background: #97acbf;
}
</style>

<style lang="scss" scoped>
.mrlm {
  margin: 0 auto;
  width: 100%;
  max-width: 414px;
}
.part {
  position: relative;
  img {
    display: block;
    width: 100%;
    height: auto;
    margin: -1px auto 0;
  }
}
.part1 {
  padding-top: 1px;
}
.part2 {
  padding-top: 38.23%;
  background: url('../../../assets/games/1019/bg4.jpg') top center no-repeat;
  background-size: 100% auto;
  .btn {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 50%;
    width: 1.23em;
    height: 0.38em;
    background: url('../../../assets/games/1019/btn.jpg') center center
      no-repeat;
    background-size: contain;
    transform: translate(-50%, 0);
    &.disabled {
      background-image: url('../../../assets/games/1019/btn-disabled.jpg');
    }
  }
  .change {
    position: absolute;
    z-index: 2;
    top: 0.78em;
    left: 50%;
    width: 1.07em;
    height: 0.35em;
    background: url('../../../assets/games/1019/btn-change.jpg') center center
      no-repeat;
    background-size: contain;
    transform: translate(-50%, 0);
  }
  p {
    position: absolute;
    z-index: 2;
    bottom: 0.4em;
    left: 0;
    right: 0;
    font-size: 0.12em;
    color: #c0d0e8;
    text-align: center;
  }
}
.alert {
  text-align: center;
}
</style>
