import { UPDATELOAD, UPDATEMSG, UPDATEUSERINFO, UPDATECERTIFY } from '@/store/types';
import { fastReg } from '@/api/api';
import { ApiQuickRegisterOptions } from '@/api/api.d';

// 快速注册
export default async (state: any, params: ApiQuickRegisterOptions) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const result = await fastReg({
      ...params
    });
    const { uid, token, guid, username, password, age, open_real_name_auth, online_time_limit } = result.data;
    const userInfo = await state.dispatch('getServiceInfo', {
      ...params,
      uid,
      guid,
      token,
      from_action: 'fastReg'
    });
    const userId = await state.dispatch('loginU9', {
      ...params,
      app_id: params.app,
      channel_id: params.channel,
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
      step: 'fastReg'
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
