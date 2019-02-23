import { userStorageName, gamerStorageName } from '@/config';
import getQuery from '@/utils/ts/getQuery';
import { getStorage } from '@/utils/ts/storage';
import mutations from './mutations';
import actions from './actions';
import deepCopy from '@/utils/ts/deepCopy';

const gid = getQuery('gid') || '0';
const gameUserInfo = getStorage(`${gamerStorageName}${gid}`) || null;

const info: {
  token?: string;
  uid?: number;
  guid?: string;
  username?: string;
  mobile?: string;
  userId?: string;
} = getStorage(userStorageName) || { userId: gameUserInfo && gameUserInfo.userId || '' };

const state = {
  infos: deepCopy(info),
  action: ''
};

const getters = {
  // 判断是否登录平台
  isLogin: ({ infos }: { infos: { uid: number, token: string}}) => {
    const { uid, token } = infos;
    if (!uid && !token) {
      return false;
    }
    return true;
  },
  // 判断是否登录游戏
  isGameLogin: ({ infos }: { infos: { userId: string }}) => {
    const { userId } = infos;
    if (!!userId) {
      return true;
    }
    return false;
  },
  // 获取操作手柄
  getAction: ({ action }: { action: string}) => {
    return action;
  },
  // 获取提供给 CP 的用户登录信息
  getSDKUserInfo: ({ infos }: { infos: any}) => {
    if (infos.userId === '') {
      return null;
    }
    return {
      hyUid: infos.uid,
      channelUserId: infos.guid,
      channelUserName: infos.username,
      userId: infos.userId,
      token: infos.token
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
