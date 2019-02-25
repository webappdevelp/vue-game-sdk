import { api, u9Api, channelId } from '../config';
import { post } from '../utils/ts/fetch';

function sendPost(url: string, params: any = {}) {
  return post(url, {
    datas: {
      channelId,
      channel: channelId,
      channel_id: channelId,
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
  return `${date.getFullYear()}${date.getMonth() +
    1}${date.getDate()}${date.getTime()}${date.getSeconds()}`;
}

// 支付
export function apiPay(params: {
  u9uid: string;
  guid: string;
  ry_device_id: string;
  app_order_id: string;
  amount: number;
  subject: string;
  body: string;
  callback_url: string;
  http_source?: string;
  pay_channel?: string;
  ext: string;
  app_ext: string;
  order_id?: string;
  openid?: string;
  IsSwitchPayChannel?: number;
}) {
  params = {
    ...params,
    order_id: getVtOrderId(),
    IsSwitchPayChannel: 1
  };
  const query = Object.keys(params).reduce((prev: string, next: string) => {
    if (next) {
      return `${next}=${(params as any)[next]}${!!prev ? `&${prev}` : ''}`;
    }
    return prev;
  }, '');
  window.location.href = `${api}/pay/index?${query}`;
}

// 微信支付
export function wxPay(params: {
  guid: string;
  ry_device_id: string;
  app_order_id: string;
  amount: number;
  subject: string;
  body: string;
  openid: string;
  callback_url?: string;
  ext?: string;
  app_ext?: string;
}) {
  return sendPost(`${api}/pay/getOrder`, {
    ...params,
    channel: channelId,
    channel_id: channelId,
    http_source: 'JSAPI',
    pay_channel: 'WXPAY'
  });
}

export function u9Pay(params: {
  uid: number;
  guid: string;
  device: number;
  UserId: string;
  ProductId: string;
  ProductOrderId: string;
  amount: number;
  CallbackUrl: string;
  Ext: string;
  AppExt: string;
}) {
  return sendPost(`${u9Api}/payRequest/payRequest`, {
    IsSwitchPayChannel: 1,
    ...params
  });
}
