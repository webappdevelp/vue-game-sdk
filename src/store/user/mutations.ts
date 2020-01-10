import { userStorageName, gamerStorageName, expireDays } from '@/config';
import Cookies from 'js-cookie';
import {
  UPDATEUSERINFO,
  UPDATEUSERACTION,
  UPDATEGAMERINFO,
  UPDATEGAMERACTION,
  DELUSERINFO,
  UPDATEUSERAPPINFO,
  UPDATECERTIFY
} from '@/store/types';

const mutations = {
  [UPDATEUSERINFO](
    state: any,
    { data, action }: { data: any; action: string }
  ) {
    state.userInfo = {
      ...state.userInfo,
      ...data
    };
    state.userAction = action || '';
    if (action === 'logined' || action === 'updated') {
      Cookies.set(
        `${userStorageName}${state.userInfo.appid || ''}-${state.userInfo
          .startOrigin || ''}`,
        JSON.stringify(state.userInfo),
        { expires: expireDays }
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
      data,
      action
    }: {
      data: { appId: string; channelId: string; userId: string };
      action?: string;
    }
  ) {
    state.gamerInfo = {
      ...state.gamerInfo,
      ...data
    };
    state.gamerAction = action || '';
    if (action === 'logined' || action === 'updated') {
      Cookies.set(
        `${gamerStorageName}-${state.userInfo.uid}-${
          state.gamerInfo.appId
        }-${state.gamerInfo.startOrigin || ''}`,
        JSON.stringify(state.gamerInfo),
        { expires: expireDays }
      );
    }
  },
  [UPDATEUSERAPPINFO](state: any, { data }: { data: any }) {
    state.userAppInfo = {
      ...state.userAppInfo,
      ...data
    };
  },
  // 更新实名认证信息
  [UPDATECERTIFY](state: any, { data }: { data: any }) {
    state.userCertify = {
      ...state.userCertify,
      ...data
    };
  },
  // 删除保存的用户信息: 先删除与其相关的游戏玩家信息，再删除用户信息
  [DELUSERINFO](state: any) {
    const { userInfo, gamerInfo } = state;
    Cookies.set(
      `${gamerStorageName}-${state.userInfo.uid}-${
        state.gamerInfo.appId
      }-${state.gamerInfo.startOrigin || ''}`,
      JSON.stringify({
        appId: gamerInfo.appId,
        channelId: gamerInfo.channelId,
        startOrigin: gamerInfo.startOrigin
      }),
      { expires: expireDays }
    );
    state.gamerInfo = {
      appId: gamerInfo.appId,
      channelId: gamerInfo.channelId,
      startOrigin: gamerInfo.startOrigin
    };
    state.gamerAction = 'logOut';
    Cookies.set(
      `${userStorageName}${state.userInfo.appid || ''}-${state.userInfo
        .startOrigin || ''}`,
      JSON.stringify({
        username: userInfo.username,
        password: userInfo.password
      }),
      { expires: expireDays }
    );
    state.userInfo = {
      username: userInfo.username,
      password: userInfo.password,
      appid: userInfo.appid,
      openid: userInfo.openid,
      startOrigin: userInfo.startOrigin
    };
    state.userAction = 'logOut';
    state.userAppInfo = {};
  }
};

export default mutations;
