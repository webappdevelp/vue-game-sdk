import { userStorageName, gamerStorageName, expireDays } from '@/config';
import { setCookie, delCookie } from '@/utils/ts/cookies';
import {
  UPDATEUSERINFO,
  UPDATEUSERACTION,
  UPDATEGAMERINFO,
  UPDATEGAMERACTION,
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
      setCookie(
        `${userStorageName}${state.userInfo.appid || ''}`,
        JSON.stringify(state.userInfo),
        expireDays
      );
    }
  },
  // 更新平台用户操作手柄
  [UPDATEUSERACTION](state: any, { data }: { data: string }) {
    state.userAction = data;
  },
  // 更新游戏用户操作手柄
  [UPDATEGAMERACTION](state: any, { data }: { data: string }) {
    state.gamerAction = data;
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
      setCookie(
        `${gamerStorageName}-${state.userInfo.uid}-${data.data.appId}`,
        JSON.stringify(state.gamerInfo),
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
    const { userInfo, gamerInfo } = state;
    delCookie(`${gamerStorageName}-${userInfo.uid}-${gamerInfo.appId}`);
    state.gamerInfo = { appId: gamerInfo.appId };
    state.gamerAction = 'logOut';
    delCookie(`${userStorageName}${userInfo.appid || ''}`);
    state.userInfo = {
      appid: userInfo.appid,
      openid: userInfo.openid
    };
    state.userAction = 'logOut';
    state.userAppInfo = {};
  }
};

export default mutations;
