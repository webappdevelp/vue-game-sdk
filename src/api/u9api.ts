import { u9Api, channelId } from '../config';
import { post } from '../utils/ts/fetch';

function sendPost(url: string, params: any = {}) {
  return post(`${u9Api}${url}`, {
    datas: {
      channelId,
      ChannelId: channelId,
      channel_id: channelId,
      ...params
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 设备初始化
export function deviceInit(params: {
  app: string;
  app_id: string;
  brand_desc?: string;
  imei: string;
}) {
  return sendPost('/u9/init', params);
}

// 登录
export function login(params: {
  device: number;
  uid: number;
  ProductId: string;
  Token: string;
  ChannelUserId: string;
  ChannelUserName: string;
}) {
  return sendPost('/login/loginRequest', {
    ...params
  });
}

// 日志上报
export function report(params: {
  device: number;
  role_id?: number;
  role_level?: number;
  role_name?: string;
  zone_id?: number;
  zone_name?: string;
  balance?: number;
  party_name?: string;
  vip?: number;
}) {
  return sendPost('/user/roleReport', params);
}

// 支付
export function pay(params: {
  device: number;
  UserId: string;
  ProductId: string;
  ProductOrderId: string;
  amount: number;
  CallbackUrl: string;
  Ext: string;
  AppExt: string;
  DeviceId: string;
  openid?: string;
}) {
  return sendPost('/payRequest/payRequest', {
    IsSwitchPayChannel: 1,
    ...params
  });
}
