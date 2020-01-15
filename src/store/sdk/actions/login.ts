import { UPDATELOAD, UPDATEMSG, UPDATEUSERINFO, UPDATECERTIFY } from '@/store/types';
import { login } from '@/api/api';
import { ApiSignInOptions } from '@/api/api.d';

// 登录
export default async (state: any, params: ApiSignInOptions) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const result = await login({ ...params });
    const { uid, token, guid, username, password, age, open_real_name_auth, online_time_limit } = result.data;
    const userInfo = await state.dispatch('getServiceInfo', {
      ...params,
      uid,
      guid,
      token
    });
    const userId = [155, '155'].indexOf(params.channel) > -1 ? uid : await state.dispatch('loginU9', {
      ...params,
      guid,
      token,
      username
    });
    const { mobile } = userInfo;
    state.commit(UPDATEUSERINFO, {
      uid,
      token,
      guid,
      userId,
      username,
      password,
      age,
      mobile,
      step: 'logined'
    });
    state.commit(UPDATECERTIFY, {
      open_real_name_auth,
      online_time_limit
    });
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
  }
};
