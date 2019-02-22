import { userStorageName, gamerStorageName } from '@/config';
import getQuery from '@/utils/ts/getQuery';
import { getStorage } from '@/utils/ts/storage';
import mutations from './mutations';
import actions from './actions';
import deepCopy from '@/utils/ts/deepCopy';


const gid = getQuery('gid') || '0';
const userId = getStorage(`${gamerStorageName}${gid}`) || '';

const info: {
  token?: string;
  uid?: number;
  guid?: string;
  username?: string;
  mobile?: string;
  userId?: string;
} = getStorage(userStorageName) || { userId };

const state = {
  info: deepCopy(info)
};

const getters = {
  getUserInfo() {}
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
