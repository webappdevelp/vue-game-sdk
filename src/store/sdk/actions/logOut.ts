import {
  UPDATELOAD,
  UPDATEMSG,
  DELUSERINFO
} from '@/store/types';
import { logOut } from '@/api/api';
import { ApiLogOutOptions } from '@/api/api.d';

export default async (
  state: any,
  params: ApiLogOutOptions
) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const { guid, token } = state.rootState.sdk.user;
    const result = await logOut({ ...params, guid, token });
    if (result.status === 0) {
      state.commit(DELUSERINFO);
      state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
      return true;
    }
    throw { message: result.message };
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
  }
};
