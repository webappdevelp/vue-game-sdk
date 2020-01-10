import { Component, Mixins } from 'vue-property-decorator';
import md5 from 'md5';
import {
  UPDATEUSERACTION,
  UPDATEGAMERACTION,
  UPDATETOAST
} from '@/store/types';
import { post } from '@/utils/ts/fetch'
let onlineTimeReportInterval: any = null;

@Component
export default class Account extends Mixins() {
  /* public data() {
    return {
      showLogin: false,
      showMobile: false,
      loginType: '',
      codeBtn: {
        color: 'green',
        text: '获取验证码'
      }
    };
  } */
  // 显示登录面板
  public showLoginPannel() {
    this.$data.showMobile = false;
    this.$data.showLogin = true;
  }
  // login
  public login({ action, datas }: { action: string; datas?: any }) {
    this.$data.loginType = action || '';
    const { sdkOptions } = this.$data;
    const params = {
      ...sdkOptions,
      ...datas
    };
    if (action === 'fast') {
      params.password = md5(`hy${new Date().getTime()}game`);
    }
    this.$store.dispatch('user/login', {
      action,
      params
    });
  }
  // checkToken
  public async checkApiToken(cb: () => void) {
    try {
      const result = await this.$store.dispatch('user/checkApiToken', {
        ...this.$data.sdkOptions
      });
      if (result === 0 && cb && cb instanceof Function) {
        cb();
      } else {
        this.logOut();
      }
    } catch (err) {
      this.$store.commit({
        type: UPDATETOAST,
        data: err && err.message
      });
    }
  }
  public async checkU9Token(cb: () => void) {
    try {
      const result = await this.$store.dispatch('user/checkU9Token', {
        ...this.$data.sdkOptions
      });
      if (result === 0 && cb && cb instanceof Function) {
        cb();
      } else {
        this.logOut();
      }
    } catch (err) {
      this.$store.commit({
        type: UPDATETOAST,
        data: err && err.message
      });
    }
  }
  // 退出
  public logOut() {
    this.$store.dispatch('user/logOut', {
      ...this.$data.sdkOptions
    });
    clearInterval(onlineTimeReportInterval);
  }
  // 重置用户和游戏玩家操作手柄
  public resetAction() {
    this.$store.commit({
      type: `user/${UPDATEUSERACTION}`,
      data: ''
    });
    this.$store.commit({
      type: `user/${UPDATEGAMERACTION}`,
      data: ''
    });
  }
  // 绑定手机号
  public async bindMobile({
    datas,
    success,
    fail
  }: {
    datas: { mobile: string; code: string };
    success?: () => void;
    fail?: () => void;
  }) {
    try {
      const result = await this.$store.dispatch('user/bindMobile', {
        ...this.$data.sdkOptions,
        ...datas
      });
      if (result === 0 && success && success instanceof Function) {
        success();
      } else if (fail && fail instanceof Function) {
        fail();
      }
    } catch (err) {
      this.$store.commit({
        type: UPDATETOAST,
        data: err && err.message
      });
      if (fail && fail instanceof Function) {
        fail();
      }
    }
  }
  // 通过手机号重置密码
  public async resetPsw({
    datas,
    success
  }: {
    datas: { mobile: string; code: string; password: string };
    success?: () => void;
  }) {
    try {
      const result = await this.$store.dispatch('user/resetPassword', {
        ...this.$data.sdkOptions,
        mobile: datas.mobile,
        code: datas.code,
        password: md5(datas.password)
      });
      if (result === 0 && success && success instanceof Function) {
        success();
      }
    } catch (err) {
      this.$store.commit({
        type: UPDATETOAST,
        data: err && err.message
      });
    }
  }
  // 通过密码更新密码
  public async updatePsw({
    datas,
    success
  }: {
    datas: { old_password: string; password: string; re_password: string };
    success?: () => void;
  }) {
    try {
      const result = await this.$store.dispatch('user/updatePassword', {
        ...this.$data.sdkOptions,
        old_password: md5(datas.old_password),
        password: md5(datas.password),
        re_password: md5(datas.re_password)
      });
      if (result === 0 && success && success instanceof Function) {
        success();
      }
    } catch (err) {
      this.$store.commit({
        type: UPDATETOAST,
        data: err && err.message
      });
    }
  }
  // 实名认证
  public async verifyName(datas: { realname: string; id_card: string }) {
    const result = await this.$store.dispatch('user/verifyName', { ...datas, ...this.$data.sdkOptions });
    result && (this.$data.showCertify = false);
  }
  // 关闭实名认证弹窗
  public hideVerifyName() {
    const userCertify = this.$store.getters['user/userCertify'];
    const { limit_type } = userCertify;
    if (limit_type === 5) {
      this.logOut();
    }
    this.$data.showCertify = false;
  }
  // 重置定时上报
  public resetOnlineTimeReportInterval() {
    clearInterval(onlineTimeReportInterval);
    onlineTimeReportInterval = null;
  }
  // 实名制在线时长上报
  public async reportOnlineTime() {
    let userCertify = this.$store.getters['user/userCertify'];
    await this.$store.dispatch('user/reportOnlineTime', {
      ...this.$data.sdkOptions,
      time_end: userCertify.time_start ? userCertify.time_start + 5 * 60 : ''
    });
    userCertify = this.$store.getters['user/userCertify'];
    const userInfo = this.$store.getters['user/userInfo'];
    // const { age } = userInfo;
    const { limit_type, tips, online_time, time_limit, open_real_name_auth } = userCertify;
    // 1：未实名，但要弹窗实名，2、3、4未成年，时间被限制，5、未实名，需弹窗，否则退出游戏
      switch (limit_type) {
        case -1:
          this.resetOnlineTimeReportInterval();
          // 若不开启时长上报只开启实名认证，则继续弹实名认证弹窗
          /* if (age === -1 && open_real_name_auth === 1) {
            this.$data.showCertify = true;
          } */
          break;
        case 1:
          this.$data.showCertify = true;
          break;
        case 5:
          this.resetOnlineTimeReportInterval();
          if (online_time >= time_limit) {
            this.$data.showCertify = false;
            this.$data.limitTipText = tips;
            this.$data.showLimitTip = true;
            this.logOut();
          } else {
            this.$data.showCertify = true;
          }
          break;
        case 2:
        case 3:
        case 4:
          this.$data.limitTipText = tips;
          this.$data.showLimitTip = true;
          this.resetOnlineTimeReportInterval();
          this.logOut();
          break;
      }
  }
  // 校验是否需要实名认证以及是否完成实名认证
	public checkCertify() {
    if (onlineTimeReportInterval) {
      return;
    }
    this.reportOnlineTime();
    onlineTimeReportInterval = setInterval(this.reportOnlineTime, 5 * 60 * 1000);
	}
}
