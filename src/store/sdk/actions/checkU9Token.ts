import { checkToken } from '@/api/u9api';
import { U9CheckTokenOptions } from '@/api/api.d';
import { UPDATEMSG, UPDATELOAD, UPDATEUSERINFO } from '@/store/types';

export default async (
  state: any,
  params: U9CheckTokenOptions
) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    await checkToken({
      ...params
    });
    const userInfo = await state.dispatch('getServiceInfo', {
      ...params
    });
    const { mobile } = userInfo;
    state.commit(UPDATEUSERINFO, {
      mobile,
      step: 'updated'
    });
    return true;
  } catch (err) {
    const message = [5008, 5003].indexOf(err.code) > -1  ? '登录信息已失效, 请重新登录' : err.message;
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: message }, { root: true });
    return false;
  }
};
