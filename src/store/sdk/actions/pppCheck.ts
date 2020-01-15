import { pppCheck } from '@/api/gamesPay';
import { ApiPPPCheckOptions } from '@/api/api.d';

// 创建u9订单
export default async (state: any, params: ApiPPPCheckOptions) => {
  const result = await pppCheck({
    ...params
  });
  if (result.status === 0) {
    const { url } = result.data;
    return url.split('=')[1];
  }
  throw result.message;
};
