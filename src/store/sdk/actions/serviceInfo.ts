import { getServiceInfo } from '@/api/api';
import { ApiGetSysInfoOptions } from '@/api/api.d';

// 获取服务信息及处理在线时长上报
export default async (state: any, params: ApiGetSysInfoOptions) => {
  const result = await getServiceInfo({
    ...params
  });
  if (!params.from_action) {
    await state.dispatch('reportOnlineTime', params);
  }
  if (result.status === 0) {
    const { user, app, service } = result.data;
    return user;
  }
  throw result.message;
};
