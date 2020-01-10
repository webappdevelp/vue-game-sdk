import { UPDATELOAD, UPDATEMSG, UPDATEUSERINFO } from '@/store/types';
import { bindMobile } from '@/api/api';
import { ApiBindMobileOptions } from '@/api/api.d';

export default async (state: any, params: ApiBindMobileOptions) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const { token, guid } = state.rootState.sdk.user;
    await bindMobile({
      ...params,
      token,
      guid
    });
    state.commit(UPDATEUSERINFO, {
      mobile: params.mobile,
      step: 'updated'
    });
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
  }
};
