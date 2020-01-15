import { Component, Vue } from 'vue-property-decorator';
import { Cookies, getStorage, setStorage } from '@/utils/ts/storage';
import MD5 from 'md5';
import { userStorageName, gamerStorageName } from '@/config';
import { UPDATEUSERINFO, UPDATEGAMEINFO, UPDATEAD } from '@/store/types';
import isWx from '@/utils/ts/device/isWx';
import fixFormBug from '@/utils/ts/fixFormBug';

@Component
export default class SdkCommon extends Vue {
  // 微信授权
  public async wxAuth() {
    /* const openid = await new Promise((resolve: any, reject: any) => {
      setTimeout(() => resolve(Cookies.get('openid')), 500)
    }); */
    const { query } = this.$route;
    const { gid, channel } = query;
    const openid = Cookies.get('openid');
    if (isWx && !openid) {
      return (window.location.href = `${window.location.origin}/user/wxAuth?callback_url=${encodeURIComponent(
        window.location.href
      )}&app_id=${gid}&channel_id=${channel}`);
    }
    openid && (Cookies.remove('openid'));
    return true;
  }

  // 定义sdk参数
  public initSdkOptions(params: { startOrigin: string } = { startOrigin: 'grf' }) {
    const { query } = this.$route;
    const { startOrigin } = params;
    const { gid, channel, channel_id, aid } = query;
    const { sdkOptions } = this.$data;
    const options: any = {
      ...sdkOptions,
      ...query,
      start_origin: startOrigin,
      sdk_version: '2',
      app: gid || 0,
      app_id: gid || 0,
      channel: channel || '',
      channel_id: channel || ''
    };
    /* if ([155, '155'].indexOf(channel as string) > -1) {
      options.u9uid = '999';
    } */
    this.$data.sdkOptions = options;
    // 配置游戏相关信息
    this.$store.commit(`sdk/${UPDATEGAMEINFO}`, {
      id: gid,
      channel: channel || channel_id || '',
      start_origin: startOrigin
    });
    // 配置广告参数
    this.$store.commit(`sdk/${UPDATEAD}`, {
      id: aid || 0
    });
  }

  // 配置悬浮球
  public initDragStyle() {
    const { sdkOptions } = this.$data;
    const { ctype } = sdkOptions;
    if (/hy/gi.test(ctype)) {
      this.$data.dragStyle.backgroundImage = `url(${require('@/assets/sdk/hy_control.png')})`;
    }
  }

  // 获取缓存的用户数据
  public async getStorageUserInfo() {
    const { sdkOptions } = this.$data;
    const { app, start_origin, channel } = sdkOptions;
    const userInfo = getStorage(`${userStorageName}${app}-${start_origin}`) || {};
    const gameInfo = getStorage(`${gamerStorageName}-${userInfo.uid}-${app}-${start_origin}`) || {};
    let defaultUser: {
      token?: string;
      uid?: number;
      guid?: string;
      userId?: string;
      username?: string;
      password?: string;
      mobile?: string;
      openid?: string;
      age?: number;
    } = {
      uid: 0,
      token: '',
      guid: '',
      userId: '',
      username: '',
      age: -1
    };
    if (userInfo && userInfo.token) {
      defaultUser = {
        ...defaultUser,
        uid: userInfo.uid || 0,
        token: userInfo.token || '',
        guid: userInfo.guid || '',
        userId: userInfo.userId || gameInfo.userId || '',
        username: userInfo.username || '',
        password: userInfo.password || '',
        age: typeof userInfo.age === 'undefined' ? -1 : userInfo.age
      };
      const dispatchUrl = [155, '155'].indexOf(channel) > -1 ? 'sdk/checkApiToken' : 'sdk/checkU9Token';
      const checkResult = await this.$store.dispatch(dispatchUrl, {
        ...sdkOptions,
        uid: userInfo.uid,
        guid: userInfo.guid,
        token: userInfo.token,
        userId: userInfo.userId || gameInfo.userId
      });
      if (checkResult) {
        // 更新用户数据
        this.$store.commit(`sdk/${UPDATEUSERINFO}`, {
          ...defaultUser,
          step: 'logined'
        });
      } else {
        setStorage(`${userStorageName}${app}-${start_origin}`, {
          username: userInfo.username,
          password: userInfo.password
        });
      }
    } else if (isWx && !userInfo.username) {
      // 如果是微信内，直接注册
      this.$store.dispatch(`sdk/fastReg`, {
        ...sdkOptions,
        password: MD5(`uu${new Date().getTime()}game`)
      });
    }
  }

  // 调整游戏窗口iframe的样式 - 窗口上有拖拽行为时使用
  public changeGameIframeStyle(params: any = {}) {
    const { gameIframeStyle } = this.$data;
    this.$data.gameIframeStyle = {
      ...gameIframeStyle,
      ...params
    };
  }

  public created() {
    fixFormBug();
  }
}
