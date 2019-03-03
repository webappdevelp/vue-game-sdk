import { userStorageName, gamerStorageName, expireDays } from '@/config';
import { setStorage, delStorage } from '@/utils/ts/storage';
import {
  UPDATEUSERINFO,
  UPDATEUSERACTION,
  UPDATEGAMERINFO,
  DELUSERINFO,
  UPDATEUSERAPPINFO
} from '@/stores/types';

const mutations = {
  [UPDATEUSERINFO](
    state: any,
    { data }: { data: { data: any; action?: string } }
  ) {
    state.userInfo = {
      ...state.userInfo,
      ...data.data
    };

    state.userAction = data.action || '';
    if (data.action === 'logined') {
      setStorage(
        `${userStorageName}${state.userInfo.appid || ''}`,
        state.userInfo,
        expireDays
      );
    }
  },
  // 更新操作手柄
  [UPDATEUSERACTION](state: any, { data }: { data: string }) {
    state.userAction = data;
  },
  // 更新游戏玩家信息
  [UPDATEGAMERINFO](
    state: any,
    {
      data
    }: { data: { data: { appId: string; userId: string }; action?: string } }
  ) {
    state.gamerInfo = {
      ...state.gamerInfo,
      ...data.data
    };
    state.gamerAction = data.action || '';
    if (data.action === 'logined') {
      setStorage(
        `${gamerStorageName}-${state.userInfo.uid}-${data.data.appId}`,
        state.gamerInfo,
        expireDays
      );
    }
  },
  [UPDATEUSERAPPINFO](state: any, { data }: { data: any }) {
    state.userAppInfo = {
      ...state.userAppInfo,
      ...data
    };
  },
  // 删除保存的用户信息: 先删除与其相关的游戏玩家信息，再删除用户信息
  [DELUSERINFO](state: any) {
    const reg = new RegExp(`${gamerStorageName}-${state.userInfo.uid}`);
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key) && reg.test(key)) {
        delStorage(key);
      }
    }
    state.gamerInfo = {};
    state.gamerAction = 'logOut';
    delStorage(`${userStorageName}${state.userInfo.appid || ''}`);
    state.userInfo = {};
    state.userAction = 'logOut';
    state.userAppInfo = {};
  }
};

export default mutations;
