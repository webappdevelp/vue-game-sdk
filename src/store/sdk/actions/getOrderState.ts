import { getNotifyStatus } from '@/api/gamesPay';

// 获取订单支付状态
export default async (state: any, params: any) => {
  try {
    const { pay } = state.rootState.sdk;
    const result = await getNotifyStatus({
      ...pay,
      ...params
    });
    if (result.status === 0) {
      return true;
    }
    throw result.message;
  } catch (err) {
    return false;
  }
};
