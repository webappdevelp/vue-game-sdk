import { UPDATELOAD, UPDATEMSG } from '@/store/types';
import { getVerifyCode } from '@/api/api';
import { ApiGetMobileCodeOptions } from '@/api/api.d';

export default async (
  state: any,
  params: ApiGetMobileCodeOptions
) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const result = await getVerifyCode({
      ...params
    });
    if (result.status === 0) {
      state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
      state.commit(`global/${UPDATEMSG}`, { show: true, content: '短信验证码发送成功' }, { root: true });
      return true;
    }
    throw { message: result.message };
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
    return false;
  }
};
