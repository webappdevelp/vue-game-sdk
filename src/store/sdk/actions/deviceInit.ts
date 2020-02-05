import { UPDATELOAD } from '@/store/types';
import { deviceInit as api_deviceInit } from '@/api/api';
import { deviceInit as u9_deviceInit } from '@/api/u9api';
import { DeviceInitOptions } from '@/api/api.d';

export default async (state: any, params: DeviceInitOptions) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const init = params.http_origin === 'u9' ? u9_deviceInit : api_deviceInit;
    // delete params.http_origin;
    const result = await init({
      ...params
    });
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    if (result.status === 0) {
      return result.data;
    }
    throw result.message;
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    return false;
  }
};
