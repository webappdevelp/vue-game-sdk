<template>
  <section class="scenes">
    <div style="display: none;">
      <img :src="gameDatas.kefu && gameDatas.kefu.wxqrcode" alt="微信二维码" />
    </div>
    <hy-drag
      :drag-style="controlDragStyle"
      @click="showCenterPannel"
      @drag-start="controlDragStart"
      @drag-move="controlDragMove"
      @drag-end="controlDragEnd"
      @resize="controlDragResize"
    >
      <div class="hy-control">
        <badge
          v-if="controlRedDot !== ''"
          :msg="controlRedDot"
          :custom-style="controlBadgeStyle"
        >
        </badge>
      </div>
    </hy-drag>
    <hy-center
      :show.sync="showCenter"
      :userDatas="scenesDatas.user"
      :gameDatas="gameDatas"
      @action="centerAction"
    />
    <account-manger
      :show.sync="showAccount"
      :datas="scenesDatas"
      @action="accountAction"
    />
    <hy-article :show.sync="showArticle" :datas="article" />
    <login
      :show.sync="showLogin"
      :fast-btn-text="fastBtnText"
      @btn-action="switchLogin"
      @submit="login"
    />
    <mobile-login
      :show="showMobile"
      :code-btn="codeBtn"
      @back="showLoginPannel"
      @get-code="getCode"
      @submit="login"
    />
    <protect-sys
			:show.sync="showCertify"
			@hide="hideVerifyName"
			@submit="verifyName"
		/>
    <fast-result :show="fastRest" :datas="scenesDatas.user" @click="playGame" />
    <bind-mobile
      title="绑定手机号"
      btn-text="确认绑定"
      action="bind_mobile"
      :show="showBindMobile"
      :code-btn="codeBtn"
      @back="showAccountPannel"
      @get-code="getCode"
      @submit="mobileBind"
    />
    <password
      :show="psw"
      :mobile="!!scenesDatas.user.mobile"
      :code-btn="codeBtn"
      @back="showAccountPannel"
      @get-code="getCode"
      @submit="changePassword"
    />
    <hy-alert
      :show.sync="showCard"
      :need-close="true"
      z-index="40"
      title="领取提示"
    >
      <template slot="content">
        <div class="gift-card">
          <div class="gift-card-nums">
            <span>兑换码：</span>
            <p>{{ card }}</p>
          </div>
          <div class="gift-card-tips">
            复制兑换码，20级在主城-福利大厅领取奖励
          </div>
        </div>
      </template>
      <template slot="footer">
        <clipboard-btn :text="card" @click="toggleCard" />
      </template>
    </hy-alert>
    <hy-alert
			:show.sync="showLimitTip"
			title="温馨提示"
			btnText="知道了"
			@action="hideLimitTip"
		>
			<div slot="content">{{ limitTipText }}</div>
		</hy-alert>
    <wx-to-browser :show.sync="wxTip.show" :msg="wxTip.msg" />
    <input type="hidden" name="userAction" :value="action" />
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
  </section>
</template>
<script lang="ts">
let hyPSMSource: any = null;
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Login from '@/components/form/Login.vue';
import MobileLogin from '@/components/form/Mobile.vue';
import Password from '@/components/form/Password.vue';
import FastResult from '@/components/FastRegResult.vue';
import HyDrag from '@/components/Drag.vue';
import Badge from '@/components/Badge.vue';
import HyAlert from '@/components/Alert.vue';
import ClipboardBtn from '@/components/ClipBoard.vue';
import WxToBrowser from '@/components/WxToBrowserTip.vue';
import ProtectSys from '@/components/form/Protect.vue';
import HyCenter from '../components/Center.vue';
import HyArticle from '../components/Article.vue';
import AccountManger from '../components/AccountManger.vue';
import PageCommonMix from '../mixins/pageCommon';
import { UPDATEUSERACTION, UPDATEGAMERACTION } from '@/store/types';
import { apiPay, u9CreateOrder, wxPay, checkPay } from '@/api/gamesPay';
import { wxJSSDKPay } from '@/utils/ts/wx';
import setShareInfo from '@/utils/ts/share';
import isWx from '@/utils/ts/device/isWx';
import isMiniProgam from '@/utils/ts/device/isMiniProgram';
import isMobile from '@/utils/ts/device/isMobile';
import fixFormBug from '@/utils/ts/fixFormBug';
import infos from './infos';
import getKefu from './kefu';
let postInterval: any = null;
const rang = Math.floor(Math.random() * 3);
const shareDesc = [
  '人人都玩，无处不在，不花一分钱还免费送VIP，家里没矿也能玩的手游',
  '不肝不氪，上线送ssr大圣，凑齐师徒四人，探寻最本真的西游取经乐趣',
  'OMG！这游戏是疯了吧？这简直就是神级的回合手游，太好玩'
];

@Component({
  components: {
    Login,
    MobileLogin,
    BindMobile: MobileLogin,
    Password,
    FastResult,
    HyDrag,
    Badge,
    HyCenter,
    AccountManger,
    HyArticle,
    HyAlert,
    ClipboardBtn,
    WxToBrowser,
    ProtectSys,
  },
  computed: {
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
          this.$data.showLogin = false;
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
          this.$data.sdkOptions = {
            ...this.$data.sdkOptions,
            zoneid: 0,
            roleid: 0,
            rolelevel: 0,
            vip: 0
          };
          this.$data.gameDatas.gifts = null;
          this.postMessage({
            action: 'logOut'
          });
          if (!this.$data.showLimitTip) {
            return (this.$data.showLogin = true);
          };
        }
        return state.userAction;
      }
    })
  }
})
export default class Index extends Mixins(PageCommonMix) {
  public data() {
    return {
      sdkOptions: {
        app_id: '',
        channel: '',
        channel_id: '',
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
      iframeStyle: {
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'none',
        background: 'transparent',
        pointerEvents: 'auto'
      },
      showControlDrag: true,
      showLogin: false,
      showMobile: false,
      loginType: '',
      loginFrom: '',
      codeBtn: {
        color: 'green',
        text: '获取验证码'
      },
      fastRest: false,
      showCenter: false,
      showArticle: false,
      article: {},
      controlDragStyle: {
        zIndex: '10',
        top: '18%',
        right: '-10px'
      },
      controlBadgeStyle: {},
      card: '',
      showCard: false,
      wxTip: {
        show: false,
        msg: ''
      },
      showAccount: false,
      showBindMobile: false,
      psw: false,
      accountActionType: '',
      device_type: '',
      showCertify: false,
			showLimitTip: false,
			limitTipText: '',
			showPayPannel: false,
			payPannelDatas: {},
			payPannelExt: {},
			pay_limit: 0
    };
  }
  get fastBtnText() {
    if (isWx) {
      return '微信登录';
    }
    return '游客模式';
  }
  // methods
  // message
  private windowEventListener() {
    window.addEventListener('message', this.dispatchMessage);
    fixFormBug();
  }
  // 获取页面初始化信息
  private async getInitData() {
    const { sdkOptions, gameDatas } = this.$data;
    let { device_type } = this.$data;
    device_type = device_type || '';
    try {
      const result = await this.getPageDatas();
      if (result) {
        const { gid } = result;
        let cp_url =
          'https://mxxy.gaoruifa.cn/mxxylqhyzf/client/web/outcenter/lqhyzfh5cp2.html';
        document.title = '梦幻逍遥游'; //title;
        this.$data.gameDatas = {
          ...gameDatas,
          id: gid,
          name: '梦幻逍遥游',
          link:
            cp_url.indexOf('?') >= 0
              ? `${cp_url}&device_type=${device_type}`
              : `${cp_url}?device_type=${device_type}`,
          infos,
          kefu: getKefu(sdkOptions.app_id)
        };
        // 处理微信分享
        setShareInfo({
          channel_id: sdkOptions.channel,
          app_id: sdkOptions.app_id,
          start_origin: sdkOptions.start_origin,
          title: '梦幻逍遥游',
          desc: shareDesc[rang],
          link: window.location.href,
          imgUrl: `${window.location.origin}${require(`@/assets/games/${
            sdkOptions.app_id
          }/share.png`)}`,
          callback: () => {
            this.postMessage({
              action: 'shareComplete'
            });
          }
        });
      }
    } catch (err) {
      this.updateToast(err && err.message);
    }
  }
  // 游戏载入后初始化通信
  private async gameInit() {
    hyPSMSource = (this.$refs.gameWindow as HTMLIFrameElement).contentWindow;
    try {
      // 设备初始化激活
      await this.deviceInit('api');
      // sdk 之间初始化通信
      const _self = this;
      postInterval = setInterval(() => {
        _self.postMessage({
          action: 'init'
        });
      }, 800);
    } catch (err) {
      this.updateToast(err && err.message);
    }
  }
  // sdk通信连接
  private postMessage(params: { action: string; datas?: any }) {
    if (hyPSMSource) {
      hyPSMSource.postMessage(JSON.stringify(params), '*');
    } else {
      console.log('初始时，通信连接失败，正尝试重新连接');
    }
  }
  // 接收cpsdk消息，并根据消息行为进行其他操作
  private dispatchMessage(e: MessageEvent) {
    const { origin, data } = e;
    if (origin === window.location.origin) {
      return;
    }
    let cpDatas = JSON.parse(data);
    cpDatas = cpDatas || {};
    const { action, datas } = cpDatas;

    if (action) {
      const { sdkOptions, showLogin, showMobile, loginFrom } = this.$data;
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
        case 'initSuccess':
          clearInterval(postInterval);
          postInterval = null;
          break;
        case 'login':
          // 假如在微信内，登录的控制只能由 sdk 自身来操作,或者存在弹窗的登录面板时，不继续操作
          if (showLogin || showMobile) {
            return;
          }
          // 判断是否登录平台
          if (!this.$store.getters['user/isLogin']) {
            // 假如是在微信内，又有openid时，则直接使用openid进行账号登录
            if (isWx && !loginFrom) {
              return this.switchLogin('fast');
            }
            return (this.$data.showLogin = true);
          }
          this.$data.loginType = 'auto';
          // 判断是否登录游戏
          if (!this.$store.getters['user/isGameLogin']) {
            return this.$store.commit({
              type: `user/${UPDATEUSERACTION}`,
              data: 'logined'
            });
          }
          this.checkU9Token(this.playGame);
          break;
        case 'logOut':
          this.logOut();
          break;
        case 'roleReport':
          this.$store.dispatch('user/roleReport', {
            ...sdkOptions,
            roleId: datas.roleId || 0,
            roleLevel: datas.roleLevel || 0,
            roleName: datas.roleName || '',
            zoneid: datas.zoneId,
            zoneName: datas.zoneName,
            balance: datas.balance || 0,
            partyName: datas.partyName || '',
            vip: datas.vip || 0
          });
          break;
        case 'logReport':
          this.$store.dispatch('user/logReport', {
            ...sdkOptions,
            brand: datas.brand || '',
            brand_desc: datas.brand_desc || '',
            time: datas.time || 0,
            step: datas.step || 0,
            step_desc: datas.step_desc || ''
          });
          break;
        case 'pay':
          this.payCheck({
            cpOrderId: datas.cpOrderId || '',
            amount: datas.amount || 0,
            body: datas.productDetail || '',
            subject: datas.productName || '',
            callback_url: datas.callBackUrl || '',
            app_ext: datas.appExt || ''
          });
          break;
        case 'csReport':
          this.$store.dispatch('user/csReport', {
            ...sdkOptions,
            ...datas
          });
          break;
        case 'update':
          this.updateGamerInfo(datas);
          break;
        case 'bindMobile':
          this.bindMobile({
            datas,
            success: () => {
              this.postMessage({
                action: 'bindMobileSuccess'
              });
            },
            fail: () => {
              this.postMessage({
                action: 'bindMobileFail'
              });
            }
          });
          break;
        case 'getSMSCode':
          this.getVerifyCode({
            ...datas,
            cutdown: false,
            success: () => {
              this.postMessage({
                action: 'getSMSCodeSuccess'
              });
            },
            fail: () => {
              this.postMessage({
                action: 'getSMSCodeFail'
              });
            }
          });
          break;
      }
    }
  }
  // 登录游戏成功
  private playGame() {
    this.$data.showLogin = false;
    this.$data.showMobile = false;
    this.$data.fastRest = false;
    this.$data.loginType = '';
    // 实名认证检查
		this.checkCertify();
    this.postMessage({
      action: 'loginSuccess',
      datas: this.$store.getters['user/sdkUserInfo']
    });
    // 登录游戏后，获取控制中心小浮标状态
    this.getServiceInfo();
    this.resetAction();
    this.getGiftsList();
  }
  // 关闭实名认证提示文案弹窗
	public hideLimitTip() {
		this.$data.limitTipText = '';
		this.$data.showLimitTip = false;
		if (this.$data.pay_limit) {
			this.postMessage({
				action: 'payFail'
			});
		}
  }
  // 通知CP支付成功
	private noticePaySuccess() {
		this.postMessage({
			action: 'paySuccess'
		});
  }
  //检查支付
	private payCheck(params: {
		cpOrderId: string;
		amount: number;
		body: string;
		subject: string;
		callback_url: string;
		app_ext?: string;
	}) {
		const userInfo = this.$store.getters['user/userInfo'];
		const { guid } = userInfo;
		checkPay({
			...this.$data.sdkOptions,
			guid,
			total_fee: params.amount || 0
		})
			.then((res: any) => {
				const { pay_limit, available_balance } = res.data;
				if (pay_limit === 1) {
					// 支付限制
					this.$data.pay_limit = pay_limit;
					this.$data.limitTipText = available_balance;
					this.$data.showLimitTip = true;
					return;
				}
				this.goPay(params);
			})
			.catch((err: any) => {
				this.updateToast(err && err.message);
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
    const { uid, guid, token, openid } = userInfo;
    const { userId } = gamerInfo;
    const { amount, cpOrderId, body, subject, callback_url, app_ext } = params;
    const { sdkOptions } = this.$data;
    this.updateLoading(true);
    u9CreateOrder({
      ...sdkOptions,
      guid,
      productId: sdkOptions.app_id,
      channelId: sdkOptions.channel_id,
      userId,
      productOrderId: cpOrderId,
      amount,
      callbackUrl: callback_url,
      appExt: app_ext,
      ext: '',
      deviceId: sdkOptions.device
    })
      .then((res: { OrderId: string | undefined }) => {
        const { OrderId } = res;
        if (!isWx) {
          return apiPay({
            ...sdkOptions,
            guid,
            token,
            u9uid: userId,
            app_order_id: OrderId || '',
            amount,
            subject,
            body,
            callback_url,
            app_ext,
            ext: ''
          });
        }
        if (!isMobile) {
          this.updateLoading(false);
          this.updateToast(
            '暂不支持PC版微信支付, 您可使用手机登录游戏进行支付'
          );
          return this.postMessage({
            action: 'payFail'
          });
        }
        // 小程序跳转
        if (isMiniProgam) {
          this.updateLoading(false);
          return window.wx.miniProgram.navigateTo({
            url: `/pages/jumppay/index?app_id=${sdkOptions.app_id}&channel_id=${
              sdkOptions.channel_id
            }&app_order_id=${OrderId}&amount=${amount}&subject=${subject}&body=${body}&callback_url=${callback_url}&app_ext=${app_ext}&ext=''&guid=${guid}&aid=${
              sdkOptions.aid
            }&device=${sdkOptions.device}`
          });
        }
        wxPay({
          ...sdkOptions,
          guid,
          token,
          u9uid: userId,
          openid,
          device_id: sdkOptions.device,
          app_order_id: OrderId || '',
          amount,
          subject,
          body,
          app_ext,
          ext: '',
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
            this.updateToast(err.message);
            this.postMessage({
              action: 'payFail'
            });
          });
      })
      .catch((err: { message: string }) => {
        this.updateLoading(false);
        this.updateToast(err.message);
      });
  }
  // 中心面板操作
  private centerAction({ action, params }: { action: string; params: any }) {
    const { loginFrom, gameDatas } = this.$data;
    switch (action) {
      case 'wxTip':
        if (params) {
          if (!isWx) {
            return window.location.href = gameDatas.kefu.link;
          }
          this.$data.wxTip = {
            show: true,
            msg: params
          };
        }
        break;
      case 'account':
        this.$data.showCenter = false;
        this.$data.showAccount = true;
        break;
      case 'verifyName':
        this.$data.showCenter = false;
        this.$data.showCertify = true;
        break;
      case 'logOut':
        this.$data.showCenter = false;
        if (isWx && !loginFrom) {
          this.$data.loginFrom = 'username';
        }
        this.logOut();
        break;
      case 'article':
        // const { infos } = this.$data.gameDatas;
        this.$data.article = infos[params];
        this.$data.showArticle = true;
        break;
      case 'gift':
        this.getGift(params);
        break;
    }
  }
  // 绑定手机号
  public mobileBind({ datas }: { datas: { mobile: string; code: string } }) {
    this.$data.accountActionType = 'bindMobile';
    this.bindMobile({
      datas,
      success: () => {
        this.showAccountPannel();
        this.postMessage({
          action: 'update',
          datas: this.$store.getters['user/sdkUserInfo']
        });
      }
    });
  }
  // 更新密码
  private changePassword({ action, datas }: { action: string; datas: any }) {
    this.$data.accountActionType = action;
    if (action === 'mobile') {
      return this.resetPsw({
        datas,
        success: () => {
          this.showAccountPannel();
          this.postMessage({
            action: 'update',
            datas: this.$store.getters['user/sdkUserInfo']
          });
        }
      });
    }
    return this.updatePsw({
      datas,
      success: () => {
        this.showAccountPannel();
        this.postMessage({
          action: 'update',
          datas: this.$store.getters['user/sdkUserInfo']
        });
      }
    });
  }
  // lifecycles
  private created() {
    this.windowEventListener();
    this.getStorageUserInfo({ gid: '10201', startOrigin: 'grf' });
    this.getStorageGamerInfo({
      gid: '10201',
      channelId: '154',
      startOrigin: 'grf'
    });
    const userInfo = this.$store.getters['user/userInfo'];
    if (isWx && !userInfo.openid) {
      return (window.location.href = `/user/wxAuth?callback_url=${encodeURIComponent(
        window.location.href
      )}&app_id=10201&channel_id=154`);
    }
    let { aid } = this.$route.query;
    aid = (aid as string) || '0';
    this.getDeviceType();
    this.initSdkOptions({ aid, gid: '10201', channel: '154', startOrigin: 'grf' });
    this.getInitData();
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
  background: url('../../../assets/games/10092/control.png') center no-repeat;
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
  font-size: 14px;
  text-align: center;
  color: #018ffd;
  &:active {
    background-color: #f5f5f5;
  }
}
</style>
