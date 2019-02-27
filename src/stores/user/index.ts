import mutations from './mutations';
import actions from './actions';

const state = {
  userInfo: {
    token: '',
    uid: 0,
    guid: '',
    username: '',
    mobile: '',
    openid: '',
    appid: ''
  },
  userAction: '',
  gamerInfo: {
    appId: '',
    userId: ''
  },
  gamerAction: '',
  userAppInfo: {}
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
    return userInfo;
  },
  // 获取游戏玩家登录信息
  gamerInfo: ({ gamerInfo }: { gamerInfo: any }) => {
    return gamerInfo;
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
    };
    gamerInfo: { userId: string };
  }) => {
    if (gamerInfo.userId === undefined || !gamerInfo.userId) {
      return null;
    }
    return {
      hyUid: userInfo.uid,
      channelUserId: userInfo.guid,
      channelUserName: userInfo.username,
      userId: gamerInfo.userId,
      token: userInfo.token,
      openid: userInfo.openid
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
