import { getOrder } from '@/api/gamesPay';
import { ApiGetOrderOptions } from '@/api/api.d';
import { UPDATELOAD, UPDATEMSG } from '@/store/types';

// 获取支付地址
export default async (state: any, params: ApiGetOrderOptions) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const { guid, token, userId, openid } = state.rootState.sdk.user;
    const result = await getOrder({
      ...params,
      guid,
      token,
      openid,
      u9uid: [155, '155'].indexOf(params.channel) > -1 ? '999' : userId,
      http_source: 'WEB',
      is_native_payment: 1
    });
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    if (result.status === 0) {
      return result.data;
    }
    throw { message: result.message };
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
  }
};
