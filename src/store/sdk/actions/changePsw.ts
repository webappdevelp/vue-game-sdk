import {
  UPDATELOAD,
  UPDATEMSG,
  UPDATEUSERINFO,
  UPDATECERTIFY
} from '@/store/types';
import { resetPassword, updatePassword } from '@/api/api';
import { ApiResetPswOptions } from '@/api/api.d';

export default async (
  state: any,
  params: ApiResetPswOptions
) => {
  
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const { user } = state.rootState.sdk;
    const api = params.mobile ? resetPassword : updatePassword;
    const result = await api({
      ...params,
      token: user.token,
      guid: user.guid
    });
    const { token, guid, username, age, mobile, open_real_name_auth, online_time_limit } = result.data;
    const userId = await state.dispatch('loginU9', {
      ...params,
      app_id: params.app,
      channel_id: params.channel,
      guid,
      token,
      username
    });
    state.commit(UPDATEUSERINFO, {
      token,
      guid,
      userId,
      username,
      age,
      mobile,
      step: 'updated'
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
