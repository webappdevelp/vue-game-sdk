import { ApiPayIndexOptions, ApiGetOrderOptions, U9CreateOrderOptions, ApiCheckPayOPtions, ApiPPPCheckOptions } from '@/api/api.d';
import { post } from '@/utils/ts/fetch';
import switchApi from './switchApi';

function sendPost(url: string, params: any = {}) {
  return post(url, {
    datas: {
      ...params
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 生成虚拟订单号
function getVtOrderId() {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getTime()}${date.getSeconds()}`;
}

// 支付
export function apiPay(params: ApiPayIndexOptions) {
  params = {
    ...params,
    order_id: params.order_id ? params.order_id : getVtOrderId(),
    isSwitchPayChannel: 1
  };
  const { api } = switchApi(params.start_origin);
  // delete params.start_origin;

  const query = Object.keys(params).reduce((prev: string, next: string) => {
    if (next) {
      return `${next}=${(params as any)[next]}${!!prev ? `&${prev}` : ''}`;
    }
    return prev;
  }, '');
  window.location.href = `${api}/pay/index?${query}`;
}

// 微信支付
export function wxPay(params: ApiGetOrderOptions) {
  const { api } = switchApi(params.start_origin);
  // delete params.start_origin;

  return sendPost(`${api}/pay/getOrder`, {
    ...params,
    order_id: params.order_id ? params.order_id : getVtOrderId(),
    http_source: 'JSAPI',
    pay_channel: 'WXPAY'
  });
}

export function u9CreateOrder(params: U9CreateOrderOptions) {
  const { u9Api } = switchApi(params.start_origin);
  // delete params.start_origin;

  return sendPost(`${u9Api}/payRequest/payRequest`, {
    ...params,
    isSwitchPayChannel: 1
  });
}

// 获取订单信息
export function getOrder(params: ApiGetOrderOptions) {
  const { api } = switchApi(params.start_origin);

  return sendPost(`${api}/pay/getOrder`, {
    ...params
  });
}

// ios api 下单
export function pppCheck(params: ApiPPPCheckOptions) {
  const { api } = switchApi(params.start_origin);

  return sendPost(`${api}/ppp/check`, {
    ...params
  });
}

// 支付校验
// total_fee： 商品金额（分）
export function checkPay(params: ApiCheckPayOPtions) {
  const { api } = switchApi(params.start_origin);
  return sendPost(`${api}/hy/checkpay`, {
    ...params
  });
}

// 检查订单状态
export function getNotifyStatus(params: any = {}) {
  const { api } = switchApi(params.start_origin);
  return sendPost(`${api}/pay/getNotifyStatus`, {
    ...params
  });
}
