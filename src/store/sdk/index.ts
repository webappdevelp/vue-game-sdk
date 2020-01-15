import { Cookies } from '@/utils/ts/storage';
import mutations from './mutations';
import actions from './actions';

const state = {
  // 用户数据
  user: {
    uid: 0,
    token: '',
    guid: '',
    userId: '',
    username: '',
    password: '',
    mobile: '',
    openid: Cookies.get('openid') || '',
    age: -1,
    step: ''
  },
  // 游戏数据
  game: {
    id: 0,
    name: '',
    url: '',
    gifts: [],
    infos: [],
    kefu: {},
    channel: '',
    start_origin: '',
  },
  // 投放广告数据
  ad: {
    id: 0
  },
  // 实名认证要求
  certify: {
    open_real_name_auth: 0,
    online_time_limit: 0,
    pay_limit: 0,
    tips: '',
    step: ''
  },
  // 订单支付信息
  pay: {}
};

const getters = {
  // 判断是否登录平台
  logined: (state: any) => {
    const { step } = state.user;
    if (!step || step === 'logOut') {
      return false;
    }
    return true;
  },
  game: (state: any) => {
    return state.game;
  },
  certify: (state: any) => {
    return state.certify;
  },
  // 获取提供给 CP 的用户登录信息
  sdkUserInfo: (state: any) => {
    const { user } = state;
    return {
      hyUid: user.uid,
      channelUserId: user.guid,
      channelUserName: user.username,
      userId: user.userId,
      token: user.token,
      openid: user.openid,
      mobile: user.mobile,
      age: user.age
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
