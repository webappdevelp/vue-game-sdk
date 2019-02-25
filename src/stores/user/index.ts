import { userStorageName, gamerStorageName } from '@/config';
import getQuery from '@/utils/ts/getQuery';
import { getStorage } from '@/utils/ts/storage';
import { getCookie } from '@/utils/ts/cookies';
import mutations from './mutations';
import actions from './actions';
import deepCopy from '@/utils/ts/deepCopy';

const gid = getQuery('gid') || '0';
const cookieUserInfo = JSON.parse(getCookie(`gm${gid}`) || 'null');
const storeUserInfo = getStorage(userStorageName);
let defaultUserInfo: {
  token?: string;
  uid?: number;
  guid?: string;
  username?: string;
  mobile?: string;
} = {
  token: '',
  uid: 0,
  guid: '',
  username: '',
  mobile: ''
};

if (storeUserInfo) {
  defaultUserInfo = {
    ...defaultUserInfo,
    ...storeUserInfo
  };
} else if (cookieUserInfo) {
  defaultUserInfo = {
    ...defaultUserInfo,
    uid: cookieUserInfo.hyUid,
    guid: cookieUserInfo.channelUserId,
    username: cookieUserInfo.channelUserName,
    token: cookieUserInfo.token
  };
}

const storeGamerInfo = getStorage(
  `${gamerStorageName}-${defaultUserInfo.uid}-${gid}`
);
let defaultGamerInfo: { appId: string; userId?: string } = {
  appId: gid
};
if (storeGamerInfo) {
  defaultGamerInfo = {
    ...defaultGamerInfo,
    ...storeGamerInfo
  };
} else if (cookieUserInfo) {
  defaultGamerInfo = {
    ...defaultGamerInfo,
    userId: cookieUserInfo.userId
  };
}

const state = {
  userInfo: deepCopy(defaultUserInfo),
  action: '',
  gamerInfo: deepCopy(defaultGamerInfo),
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
  // 获取操作手柄
  getAction: ({ action }: { action: string }) => {
    return action;
  },
  // 获取平台用户登录信息
  getUserInfo: ({ userInfo }: { userInfo: any }) => {
    return userInfo;
  },
  // 获取游戏玩家登录信息
  getGamerInfo: ({ gamerInfo }: { gamerInfo: any }) => {
    return gamerInfo;
  },
  // 获取提供给 CP 的用户登录信息
  getSDKUserInfo: ({
    userInfo,
    gamerInfo
  }: {
    userInfo: { uid: number; guid: string; token: string; username: string };
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
      token: userInfo.token
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
