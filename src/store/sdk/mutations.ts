import { userStorageName, gamerStorageName, expireDays } from '@/config';
import Cookies from 'js-cookie';
import {
  UPDATEUSERINFO,
  DELUSERINFO,
  UPDATECERTIFY,
  UPDATEGAMEINFO,
  UPDATEAD,
  UPDATEPAY,
  EMPTYPAY
} from '@/store/types';

const mutations = {
  [UPDATEUSERINFO](state: any, data: any = {}) {
    state.user = {
      ...state.user,
      ...data
    };
    const storageItem = `${userStorageName}${state.game.id}-${state.game.start_origin}`;
    if (state.user.userId && JSON.stringify(state.user) !== Cookies.get(storageItem)) {
      const tempUser = JSON.parse(JSON.stringify(state.user));
      delete tempUser.step;
      Cookies.set(storageItem, JSON.stringify(tempUser), {
        expires: expireDays
      });
    }
  },
  // 更新游戏数据
  [UPDATEGAMEINFO](state: any, data: any = {}) {
    state.game = {
      ...state.game,
      ...data
    };
  },
  // 更新广告数据
  [UPDATEAD](state: any, data: any = {}) {
    state.ad = {
      ...state.ad,
      ...data
    };
  },
  // 更新实名认证信息
  [UPDATECERTIFY](state: any, data: any = {}) {
    state.certify = {
      ...state.certify,
      ...data
    };
  },
  // 更新支付信息
  [UPDATEPAY](state: any, data: any = {}) {
    state.pay = {
      ...state.pay,
      ...data
    };
  },
  [EMPTYPAY](state: any) {
    state.pay = {};
  },
  // 删除保存的用户信息: 先删除与其相关的游戏玩家信息，再删除用户信息
  [DELUSERINFO](state: any, data: any = {}) {
    const { user, game } = state;
    state.user = { step: 'logOut' };
    Cookies.set(`${userStorageName}${game.id}-${game.start_origin}`, JSON.stringify({
      username: user.username,
      password: user.password
    }), { expires: expireDays });
  }
};

export default mutations;
