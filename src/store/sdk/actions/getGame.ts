import { post } from '@/utils/ts/fetch';
import { UPDATELOAD, UPDATEMSG } from '@/store/types';

export default async (state: any, params: {
  gid: string | number;
  channel: string | number;
  aid: string | number
}) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '正在加载...' }, { root: true });
    const result = await post(`${'//aliyun.gaoruifa.cn' || window.location.origin}/game/detail`, {
      datas: {
        ...params
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    if (result.status === 0) {
      return result.data;
    }
    return null;
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
    return null;
  }
};
