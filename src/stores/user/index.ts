import { userStorageName, gamerStorageName } from '@/config';
import getQuery from '@/utils/ts/getQuery';
import { getStorage } from '@/utils/ts/storage';
import mutations from './mutations';
import actions from './actions';
import deepCopy from '@/utils/ts/deepCopy';

const gid = getQuery('gid') || '0';

const defaultUserInfo: {
  token?: string;
  uid?: number;
  guid?: string;
  username?: string;
  mobile?: string;
} = getStorage(userStorageName) || {};

const defaultGamerInfo = getStorage(
  `${gamerStorageName}-${defaultUserInfo.uid}-${gid}`
) || {
  appId: gid
};

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
