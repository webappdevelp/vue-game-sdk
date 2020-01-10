import { u9CreateOrder } from '@/api/gamesPay';
import { U9CreateOrderOptions } from '@/api/api.d';

// 创建u9订单
export default async (state: any, params: U9CreateOrderOptions) => {
  const result = await u9CreateOrder({
    ...params
  });
  if (result.Code === 0) {
    const { OrderId } = result;
    return OrderId;
  }
  throw result.message;
};
