<template>
  <div class="scenes">
    <div style="display: none;">
      <img :src="gameDatas.kefu && gameDatas.kefu.wxqrcode" alt="微信二维码">
    </div>
    <hy-drag
      v-if="!showControlDrag"
      :drag-style="controlDragStyle"
      @click="showCenter"
      @drag-start="controlDragStart"
      @drag-move="controlDragMove"
      @drag-end="controlDragEnd"
      @resize="controlDragResize"
    >
      <div class="hy-control">
        <badge v-if="controlRedDot !== ''" :msg="controlRedDot" :custom-style="controlBadgeStyle"></badge>
      </div>
    </hy-drag>
    <hy-center
      :show.sync="center"
      :userDatas="scenesDatas.user"
      :gameDatas="gameDatas"
      @action="centerAction"
    />
    <account-manger :show.sync="account" :datas="scenesDatas" @action="accountAction"/>
    <login
      :show.sync="login"
      :fast-btn-text="fastBtnText"
      @btn-action="loginBtnAction"
      @submit="goLogin"
    />
    <mobile-login :show="mobile" @back="showLogin" @submit="goLogin"/>
    <fast-result :show="fastRest" :datas="scenesDatas.user" @click="playGame"/>
    <bind-mobile
      :show="bindMobile"
      title="绑定手机号"
      btn-text="确认绑定"
      action="bind_mobile"
      @back="showAccount"
      @submit="mobileBind"
    />
    <password
      :show="psw"
      :mobile="!!scenesDatas.user.mobile"
      @back="showAccount"
      @submit="changePassword"
    />
    <hy-article :show.sync="showArticle" :datas="article"/>
    <hy-alert :show.sync="showCard" :need-close="true" z-index="40" title="领取提示">
      <template slot="content">
        <div class="gift-card">
          <div class="gift-card-nums">
            <span>兑换码：</span>
            <p>{{ card }}</p>
          </div>
          <div class="gift-card-tips">复制兑换码，20级在主城-福利大厅领取奖励</div>
        </div>
      </template>
      <template slot="footer">
        <clipboard-btn :text="card" @click="toggleCard"/>
      </template>
    </hy-alert>
    <wx-to-browser :show.sync="wxTip.show" :msg="wxTip.msg"/>
    <download-ads v-if="showDwlAds" @action="centerAction"/>
    <input type="hidden" name="userAction" :value="action">
    <iframe
      v-if="gameDatas.link !== ''"
      @load="gameInit"
      ref="gameWindow"
      :src="gameDatas.link"
      id="gameWindow"
      height="100%"
      width="100%"
      scrolling="auto"
      allowtransparency="true"
      allowfullscreen
      frameborder="0"
      :style="iframeStyle"
    ></iframe>
  </div>
</template>
<script lang="ts">
let hyPSMSource: any = null;
let hyPSMOrigin: string = '';
const dwladsApps: string[] = ['10147'];
import { Vue, Component } from 'vue-property-decorator';
import HyCenter from '@/components/scenes/Center.vue';
import AccountManger from '@/components/scenes/AccountManger.vue';
import DownloadAds from '@/components/scenes/DownloadAds.vue';
import HyArticle from '@/components/scenes/Article.vue';
import Login from '@/components/form/Login.vue';
import Mobile from '@/components/form/Mobile.vue';
import Password from '@/components/form/Password.vue';
import FastResult from '@/components/FastRegResult.vue';
import WxToBrowser from '@/components/WxToBrowserTip.vue';
import HyDrag from '@/components/Drag.vue';
import Badge from '@/components/Badge.vue';
import HyAlert from '@/components/Alert.vue';
import ClipboardBtn from '@/components/ClipBoard.vue';
import md5 from 'md5';
import {
  UPDATETOAST,
  UPDATELOAD,
  UPDATEUSERACTION,
  UPDATEGAMERINFO,
  UPDATEGAMERACTION
} from '@/stores/types';
import { mapState } from 'vuex';
import { cqApi, gamerStorageName, channelId } from '@/config';
import { get } from '@/utils/ts/fetch';
import { deviceInit } from '@/api/api';
import { apiPay, u9Pay, wxPay } from '@/api/gamesPay';
import { getCookie, setCookie } from '@/utils/ts/cookies';
import isWx from '@/utils/ts/device/isWx';
import { initWXJSSDK, wxJSSDKPay } from '@/utils/ts/wx';
import fixFormBug from '@/utils/ts/fixFormBug';
import clipboard from '@/utils/ts/clipboard';
import defaultInfos from '@/articles';
const rang = Math.floor(Math.random() * 3);
const shareDesc = [
  '人人都玩，无处不在，不花一分钱还免费送VIP，家里没矿也能玩的手游',
  '不肝不氪，上线送ssr大圣，凑齐师徒四人，探寻最本真的西游取经乐趣',
  'OMG！这游戏是疯了吧？这简直就是神级的回合手游，太好玩'
];
const defaultKeFu: any = {
  numbers: `QQ群：805453802
          <br>QQ客服：2814384213
          <br>客服电话：
          <a href="tel:020-86805149">020-86805149</a>`,
  wxqrcode: ''
};

@Component({
  components: {
    HyDrag,
    Badge,
    HyCenter,
    AccountManger,
    HyArticle,
    Login,
    MobileLogin: Mobile,
    BindMobile: Mobile,
    Password,
    FastResult,
    WxToBrowser,
    DownloadAds,
    HyAlert,
    ClipboardBtn
  },
  computed: {
    // ...mapState(['toast', 'loading']),
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
        const { gameDatas } = this.$data;
        const { gifts } = gameDatas;
        if (gifts && !!gifts.length) {
          return '礼包';
        } else if (!!state.userInfo.uid && !state.userInfo.mobile) {
          return '1';
        }
        return '';
      },
      action(state: any) {
        if (this.$data.loginType === 'fast') {
          this.$data.login = false;
          if (/logined/i.test(state.gamerAction) && !isWx) {
            this.$data.fastRest = true;
          }
        }
        if (
          state.gamerAction !== 'logined' &&
          state.userAction === 'logined' &&
          /login|mobile|fast|auto/i.test(this.$data.loginType)
        ) {
          // 当平台登录的操作手柄存在时，自动登录游戏
          this.$store.dispatch('user/loginGame', {
            ...this.$data.sdkOptions
          });
        }
        // 执行登录成功操作 playGame
        if (
          (/login|mobile|auto/.test(this.$data.loginType) ||
            (/fast/.test(this.$data.loginType) && isWx)) &&
          state.gamerAction === 'logined'
        ) {
          this.playGame();
        }
        // 退出登录
        if (state.userAction === 'logOut') {
          this.resetAction();
          this.$data.gameDatas = {
            ...this.$data.gameDatas,
            gifts: null
          };
          this.postMessage({
            action: 'logOut'
          });
          return (this.$data.login = true);
        }
        return state.userAction;
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
        openid: '',
        device: '',
        sdk_version: '2'
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
      showArticle: false,
      showCard: false,
      card: '',
      article: {},
      loginType: '',
      loginFrom: '',
      account: false,
      bindMobile: false,
      psw: false,
      accountActionType: '',
      iframeStyle: {
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'none',
        background: 'transparent',
        pointerEvents: 'auto'
      },
      wxTip: {
        show: false,
        msg: ''
      },
      controlDragStyle: {
        zIndex: '10',
        top: '18%',
        right: '-10px'
      },
      controlBadgeStyle: {},
      deviceType: ''
    };
  }

  get showControlDrag() {
    const { sdkOptions } = this.$data;
    const { app } = sdkOptions;
    return !app || app === '0';
  }
  get fastBtnText() {
    if (isWx) {
      return '微信登录';
    }
    return '一键注册';
  }
  get showDwlAds() {
    const { sdkOptions, deviceType } = this.$data;
    return (
      sdkOptions.app !== '' &&
      sdkOptions.app !== '0' &&
      dwladsApps.indexOf(sdkOptions.app) >= 0 &&
      sdkOptions.aid !== '' &&
      sdkOptions.aid !== '0' &&
      (deviceType === '' || deviceType === '0')
    );
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
  // 获取玩家登录信息
  private getStorageGamerInfo(gid: string) {
    const userInfo = this.$store.getters['user/userInfo'];
    const cookieUserInfo = JSON.parse(getCookie(`gm${gid}`) || 'null');
    const storeGamerInfo = JSON.parse(
      getCookie(`${gamerStorageName}-${userInfo.uid}-${gid}`) || '{}'
    );
    let defaultGamerInfo: { appId: string; userId: string } = {
      appId: gid,
      userId: ''
    };
    if (storeGamerInfo) {
      defaultGamerInfo = {
        ...defaultGamerInfo,
        ...storeGamerInfo
      };
      this.$store.commit({
        type: `user/${UPDATEGAMERINFO}`,
        data: {
          data: {
            ...defaultGamerInfo
          }
        }
      });
    } else if (cookieUserInfo) {
      defaultGamerInfo = {
        ...defaultGamerInfo,
        userId: cookieUserInfo.userId
      };
      this.$store.commit({
        type: `user/${UPDATEGAMERINFO}`,
        data: {
          data: {
            ...defaultGamerInfo
          },
          action: 'logined'
        }
      });
    } else {
      this.$store.commit({
        type: `user/${UPDATEGAMERINFO}`,
        data: {
          data: {
            ...defaultGamerInfo
          }
        }
      });
    }
  }
  // 获取页面初始化信息
  private getInitData() {
    const { sdkOptions } = this.$data;
    get(`${cqApi}/game/detail`, {
      datas: {
        aid: sdkOptions.aid,
        gid: sdkOptions.app,
        channel: channelId
      }
    })
      .then((res: { data: { cp_origin: string; cp_url: string; title: string } }) => {
        let { data } = res;
        data = data || {};
        const { title, cp_origin, cp_url } = data;
        /* if (!!title) {
            document.title = title;
          } */
        this.$data.gameDatas = {
          id: sdkOptions.app,
          name: title,
          origin: cp_origin,
          link: cp_url,
          infos: defaultInfos,
          kefu: {
            ...defaultKeFu
          }
        };
        hyPSMOrigin = cp_origin;
        // 处理微信分享
        initWXJSSDK({
          title: '梦幻逍遥游',
          desc: shareDesc[rang],
          link: `${window.location.origin}/user/scenes?${window.location.href.split('?')[1]}`,
          imgUrl: `${window.location.origin}${require('../assets/shareicon/xymy.png')}`
        }).then(() => {
          this.postMessage({
            action: 'shareComplete'
          });
        });
      })
      .catch((err: { message: string }) => {
        this.updateLoading(false);
        this.$data.sdkOptions = {
          ...this.$data.sdkOptions,
          app: '',
          app_id: ''
        };
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
      let cpDatas = JSON.parse(data);
      cpDatas = cpDatas || {};
      const { action, datas } = cpDatas;
      const { sdkOptions, loginFrom } = this.$data;

      console.log(`${action}：hyCpSDK -> hySDK successed`);

      switch (action) {
        case 'blur':
          if (document.scrollingElement) {
            document.scrollingElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
          break;
        case 'pay':
          this.goPay({
            cpOrderId: datas.cpOrderId || '',
            amount: datas.amount || 0,
            body: datas.productDetail || '',
            subject: datas.productName || '',
            callback_url: datas.callBackUrl || '',
            app_ext: datas.appExt || ''
          });
          break;
        case 'roleReport':
          this.$store
            .dispatch('user/logReport', {
              role_id: datas.roleId || 0,
              role_level: datas.roleLevel || 0,
              role_name: datas.roleName || '',
              zone_id: datas.zoneId,
              zone_name: datas.zoneName,
              balance: datas.balance || 0,
              party_name: datas.partyName || '',
              vip: datas.vip || 0,
              ...sdkOptions
            })
            .then(() => {
              this.postMessage({
                action: 'roleReportSuccess'
              });
            })
            .catch(() => {
              this.postMessage({
                action: 'roleReportFail'
              });
            });
          break;
        case 'logOut':
          this.$store.dispatch('user/logOut');
          break;
        case 'initSuccess':
          if (
            !isWx &&
            this.$store.getters['user/isLogin'] &&
            this.$store.getters['user/isGameLogin']
          ) {
            this.validateLogin();
          }
          break;
        case 'login':
          // 假如在微信内，登录的控制只能由 sdk 自身来操作,或者存在弹窗的登录面板时，不继续操作
          if (!!this.$data.login || !!this.$data.mobile) {
            return;
          }
          // 判断是否登录平台
          if (!this.$store.getters['user/isLogin']) {
            // 假如是在微信内，又有openid时，则直接使用openid进行账号登录
            if (isWx && !loginFrom) {
              return this.loginBtnAction('fast');
            }
            return (this.$data.login = true);
          }
          this.$data.loginType = 'auto';
          // 判断是否登录游戏
          if (!this.$store.getters['user/isGameLogin']) {
            return this.$store.commit({
              type: `user/${UPDATEUSERACTION}`,
              data: 'logined'
            });
          }
          this.validateLogin();
          break;
      }
    }
  }
  // 开始和cp sdk通信
  private gameInit() {
    hyPSMSource = (this.$refs.gameWindow as HTMLIFrameElement).contentWindow;
    // 游戏加载成功后即开始设备初始化操作
    const { openid } = this.$data.sdkOptions;
    const deviceImei = JSON.parse(getCookie('device') || '{}');
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
            setCookie('device', JSON.stringify({ imei }));
          }
        }
        // sdk 开始初始化通讯操作
        this.postMessage({
          action: 'init',
          datas: this.$store.getters['user/sdkUserInfo']
        });
      })
      .catch((err: { message: string }) => {
        this.updateLoading(false);
        this.showToast(err.message);
        // sdk 开始初始化通讯操作
        this.postMessage({
          action: 'init'
        });
      });
  }
  // 校验用户登录
  private validateLogin() {
    this.$store
      .dispatch('user/loginValidate')
      .then(() => {
        console.log('login validated');
        this.playGame();
      })
      .catch(() => {
        console.log('login failed');
        this.$store.dispatch('user/logOut');
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
        this.goLogin({
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
    this.$data.login = false;
    this.$data.mobile = false;
    this.$data.fastRest = false;
    this.$data.loginType = '';
    this.postMessage({
      action: 'loginSuccess',
      datas: this.$store.getters['user/sdkUserInfo']
    });
    // 登录平台后，获取控制中心小浮标状态
    this.$store.dispatch('user/getControlInfo', {
      ...this.$data.sdkOptions
    });
    this.resetAction();
    this.getGiftsList();
  }
  // 重置用户和游戏玩家操作手柄
  private resetAction() {
    this.$store.commit({
      type: `user/${UPDATEUSERACTION}`,
      data: ''
    });
    this.$store.commit({
      type: `user/${UPDATEGAMERACTION}`,
      data: ''
    });
  }
  // 游戏内支付
  private goPay(params: {
    cpOrderId: string;
    amount: number;
    body: string;
    subject: string;
    callback_url: string;
    app_ext?: string;
  }) {
    const userInfo = this.$store.getters['user/userInfo'];
    const gamerInfo = this.$store.getters['user/gamerInfo'];
    const { uid, guid } = userInfo;
    const { userId } = gamerInfo;
    const { amount, cpOrderId, body, subject, callback_url, app_ext } = params;

    this.updateLoading(true);
    u9Pay({
      uid: userInfo.uid,
      guid: userInfo.guid,
      UserId: userId,
      amount,
      ProductId: this.$data.sdkOptions.app_id,
      ProductOrderId: cpOrderId,
      CallbackUrl: callback_url,
      AppExt: app_ext,
      Ext: app_ext,
      ...this.$data.sdkOptions
    })
      .then((res: { OrderId: string | undefined }) => {
        const { OrderId } = res;
        if (!isWx) {
          return apiPay({
            u9uid: userId,
            guid: userInfo.guid,
            ry_device_id: this.$data.sdkOptions.device,
            app_order_id: OrderId || '',
            amount,
            body,
            subject,
            ext: app_ext,
            app_ext,
            callback_url,
            ...this.$data.sdkOptions
          });
        }
        wxPay({
          guid: userInfo.guid,
          ry_device_id: this.$data.sdkOptions.device,
          openid: this.$data.sdkOptions.openid,
          app_order_id: OrderId || '',
          amount,
          body,
          subject,
          ext: app_ext,
          app_ext,
          callback_url
        })
          .then((rest: { data: { pay_info: any } }) => {
            const { pay_info } = rest.data;
            wxJSSDKPay(pay_info)
              .then((payres: { errMsg: string }) => {
                const { errMsg } = payres;
                this.updateLoading(false);
                if (/:ok/i.test(errMsg)) {
                  this.postMessage({
                    action: 'paySuccess'
                  });
                } else {
                  this.postMessage({
                    action: 'payFail'
                  });
                }
              })
              .catch(() => {
                this.updateLoading(false);
                this.postMessage({
                  action: 'payFail'
                });
              });
          })
          .catch((err: { message: string }) => {
            this.updateLoading(false);
            this.showToast(err.message);
            this.postMessage({
              action: 'payFail'
            });
          });
      })
      .catch((err: { message: string }) => {
        this.updateLoading(false);
        this.showToast(err.message);
      });
  }
  // 获取礼包列表
  private getGiftsList() {
    const gamerInfo = this.$store.getters['user/gamerInfo'];
    get(`${cqApi}/lqhy/listGift`, {
      datas: {
        uid: gamerInfo.userId
      }
    }).then((res: { data: [{ id: string; name: string; desc: string; status: number }] }) => {
      this.$data.gameDatas = {
        ...this.$data.gameDatas,
        gifts: res.data
      };
      clipboard();
    });
  }
  // 领取礼包
  private getGift(id: string) {
    if (!id) {
      return this.showToast('参数错误');
    }
    this.updateLoading(true);
    const gamerInfo = this.$store.getters['user/gamerInfo'];
    get(`${cqApi}/lqhy/getGift`, {
      datas: {
        uid: gamerInfo.userId,
        id
      }
    })
      .then((res: { data: { card: string } }) => {
        this.updateLoading(false);
        const { card } = res.data;
        const { gameDatas } = this.$data;
        const { gifts } = gameDatas;
        this.$data.card = card;
        this.$data.showCard = true;
        this.$data.gameDatas = {
          ...gameDatas,
          gifts: gifts.map((item: { id: string; status: number }) => {
            if (item.id === id) {
              item.status = 1;
            }
            return item;
          })
        };
      })
      .catch((err: { message: string }) => {
        this.updateLoading(false);
        this.showToast(err.message);
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
    const { loginFrom } = this.$data;
    switch (action) {
      case 'wxTip':
        if (params) {
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
        }
        break;
      case 'account':
        this.$data.center = false;
        this.$data.account = true;
        break;
      case 'logOut':
        this.$data.center = false;
        if (isWx && !loginFrom) {
          this.$data.loginFrom = 'username';
        }
        this.$store.dispatch('user/logOut');
        break;
      case 'article':
        const { infos } = this.$data.gameDatas;
        this.$data.article = infos[params];
        this.$data.showArticle = true;
        break;
      case 'gift':
        this.getGift(params);
        break;
    }
  }
  /** 账户管理 */
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
  }
  // 绑定手机号
  private mobileBind({ params }: { params: { mobile: string; code: string } }) {
    this.$data.accountActionType = 'bindMobile';
    this.$store
      .dispatch('user/mobileBind', {
        ...params
      })
      .then(() => {
        this.showAccount();
      });
  }
  // 更新密码
  private changePassword({ action, params }: { action: string; params: any }) {
    this.$data.accountActionType = action;
    if (action === 'mobile') {
      return this.$store
        .dispatch('user/passwordReset', {
          mobile: params.mobile,
          code: params.code,
          password: md5(params.password)
        })
        .then(() => {
          this.showAccount();
          // 当平台登录的操作手柄存在时，自动登录游戏
          this.$store.dispatch('user/loginGame', {
            ...this.$data.sdkOptions
          });
          this.postMessage({
            action: 'update',
            datas: this.$store.getters['user/sdkUserInfo']
          });
        });
    }
    return this.$store
      .dispatch('user/passwordUpdate', {
        old_password: md5(params.old_password),
        password: md5(params.password),
        re_password: md5(params.re_password)
      })
      .then(() => {
        this.showAccount();
        // 当平台登录的操作手柄存在时，自动登录游戏
        this.$store.dispatch('user/loginGame', {
          ...this.$data.sdkOptions
        });
        this.postMessage({
          action: 'update',
          datas: this.$store.getters['user/sdkUserInfo']
        });
      });
  }
  // 拖拽功能
  private controlDragStart() {
    const { controlDragStyle, iframeStyle } = this.$data;
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      opacity: '1',
      transition: 'unset',
      webkitTransition: 'unset'
    };
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'none'
    };
  }
  private controlDragMove(params: { movedX: number; movedY: number }) {
    const { controlDragStyle, iframeStyle } = this.$data;
    const { movedX, movedY } = params;
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      left: `${movedX}px`,
      top: `${movedY}px`
    };
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'none'
    };
  }
  private controlDragEnd(params: {
    movedX: number;
    movedY: number;
    dragOffsetLeft: number;
    dragOffsetTop: number;
  }) {
    const { controlDragStyle, controlBadgeStyle, iframeStyle } = this.$data;
    const { dragOffsetLeft, dragOffsetTop, movedX, movedY } = params;
    const screenWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const screenHeight = document.body.clientHeight || document.documentElement.clientHeight;
    const difX = screenWidth - dragOffsetLeft;
    const difY = screenHeight - dragOffsetTop;
    const obj: any = {
      left: dragOffsetLeft,
      top: dragOffsetTop,
      right: difX,
      bottom: difY
    };
    const min = Math.min(dragOffsetLeft, dragOffsetTop, difX, difY);
    let left = movedX;
    let top = movedY;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === min) {
        switch (key) {
          case 'left':
            left = -10;
            top = top >= screenHeight - 30 ? screenHeight - 40 : top < 0 ? 0 : top;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
              top: '0',
              right: 'auto',
              left: '30px',
              bottom: 'auto',
              transform: 'unset'
            };
            break;
          case 'top':
            top = -10;
            left = left >= screenWidth - 30 ? screenWidth - 40 : left < 0 ? 0 : left;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
              left: '50%',
              top: 'auto',
              right: 'auto',
              bottom: '0',
              transform: 'translateX(-50%)'
            };
            break;
          case 'bottom':
            top = screenHeight - 30;
            left = left >= screenWidth - 30 ? screenWidth - 40 : left < 0 ? 0 : left;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
              top: '0',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translateX(-50%)'
            };
            break;
          case 'right':
            left = screenWidth - 30;
            top = top >= screenHeight - 30 ? screenHeight - 40 : top < 0 ? 0 : top;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
              top: '0',
              left: 'auto',
              right: '30px',
              bottom: 'auto',
              transform: 'unset'
            };
            break;
        }
      }
    }
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'auto'
    };
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      left: `${left}px`,
      top: `${top}px`,
      right: 'auto',
      bottom: 'auto',
      willChange: 'auto',
      transition: 'all .3s ease',
      webkitTransition: 'all .3s ease'
    };
  }
  private controlDragResize() {
    this.$data.controlDragStyle = {
      zIndex: '10',
      top: '18%',
      right: '-10px'
    };
    this.$data.controlBadgeStyle = {
      top: '0',
      left: 'auto',
      right: '30px',
      bottom: 'auto',
      transform: 'unset'
    };
  }
  // 显示隐藏领取的礼包弹窗
  private toggleCard() {
    this.$data.showCard = !this.$data.showCard;
  }

  // lifecycles
  private created() {
    this.$store.commit({
      type: UPDATELOAD,
      data: true
    });
    const { gid, aid, device_type } = this.$route.query;
    const userInfo = this.$store.getters['user/userInfo'];
    if (isWx && (!userInfo.openid || userInfo.openid === '0')) {
      return (window.location.href = `/user/scenes?gid=${gid}`);
    }
    defaultKeFu.wxqrcode = require(`@/assets/wxqrcode/${gid}/qrcode.jpg`);
    this.$data.sdkOptions = {
      ...this.$data.sdkOptions,
      app: gid || '',
      app_id: gid || '',
      aid: aid || '0',
      Aid: aid || '0',
      openid: userInfo.openid || '0'
    };
    this.$data.deviceType = device_type || '';
    if (!!gid && gid !== '0') {
      this.getStorageGamerInfo(gid as string);
      try {
        this.getInitData();
      } catch (err) {
        alert(err.message);
      }
    } else {
      this.updateLoading(false);
    }
  }
  private mounted() {
    window.addEventListener('message', this.dispatchMessage);
    fixFormBug();
  }
}
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.scenes,
#gameWindow {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.hy-control {
  position: relative;
  width: 40px;
  height: 40px;
  background: url('../assets/scenes/control.png') center no-repeat;
  background-size: contain;
  .hy-badge {
    position: absolute;
    top: 0;
    left: auto;
    right: 30px;
    text-align: center;
    transition: all 0.3s ease;
  }
}
.gift-card {
  user-select: auto;
  color: #999;
  &-nums {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    p {
      flex: 1;
      border-radius: 2px;
      background: #e5e5e5;
      text-align: center;
      user-select: auto;
    }
  }
  &-tips {
    margin-top: 10px;
    font-size: 12px;
    text-align: center;
  }
}
.clipboard {
  flex: 1;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  text-align: center;
  color: #018ffd;
  &:active {
    background-color: #f5f5f5;
  }
}
</style>
