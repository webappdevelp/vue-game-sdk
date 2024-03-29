import mutations from './mutations';
import actions from './actions';

const state = {
  userInfo: {
    token: '',
    uid: 0,
    guid: '',
    username: '',
    password: '',
    mobile: '',
    openid: '',
    appid: '',
    startOrigin: '',
    // 实名认证新增
    age: -1,
    open_real_name_auth: 0,
    online_time_limit: 0
  },
  userAction: '',
  gamerInfo: {
    appId: '',
    channelId: '',
    userId: '',
    startOrigin: ''
  },
  gamerAction: '',
  userAppInfo: {},
  userCertify: {
    age: -1,
    open_real_name_auth: 0,
    online_time_limit: 0
  }
};

const getters = {
  // 判断是否登录平台
  isLogin: ({ userInfo }: { userInfo: { uid: number; token: string } }) => {
    const { uid, token } = userInfo;
    if (!uid || !token) {
      return false;
    }
    return true;
  },
  // 判断是否登录游戏
  isGameLogin: ({ gamerInfo }: { gamerInfo: { userId: string } }) => {
    const { userId } = gamerInfo;
    if (userId !== undefined && !!gamerInfo.userId) {
      return true;
    }
    return false;
  },
  // 获取平台用户操作手柄
  userAction: ({ userAction }: { userAction: string }) => {
    return userAction;
  },
  // 获取平台用户登录信息
  userInfo: ({ userInfo }: { userInfo: any }) => {
    return {
      ...userInfo
    };
  },
  // 获取游戏玩家登录信息
  gamerInfo: ({ gamerInfo }: { gamerInfo: any }) => {
    return gamerInfo;
  },
  // 实名认证信息
  userCertify: ({ userCertify }: { userCertify: any }) => {
    return userCertify;
  },
  // 获取提供给 CP 的用户登录信息
  sdkUserInfo: ({
    userInfo,
    gamerInfo
  }: {
    userInfo: {
      uid: number;
      guid: string;
      token: string;
      username: string;
      openid: string;
      mobile: string;
      age: number;
    };
    gamerInfo: { userId: string };
  }) => {
    return {
      hyUid: userInfo.uid,
      channelUserId: userInfo.guid,
      channelUserName: userInfo.username,
      userId: gamerInfo.userId,
      token: userInfo.token,
      openid: userInfo.openid,
      mobile: userInfo.mobile,
      age: userInfo.age
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {}
};
