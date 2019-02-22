import { u9Api, channel_id } from '../config';
import { post } from '../utils/ts/fetch';

// 设备初始化
export function deviceInit(params: {
  app: number;
  app_id: number;
  brand_desc: string;
  imei: string;
}) {
  return post(`${u9Api}/u9/init`, {
    datas: {
      ...params
    }
  });
}

// 登录
export function login(params: {
  ProductId?: number;
  Token?: string;
  ChannelUserId?: string;
  ChannelUserName?: string;
}) {
  return post(`${u9Api}/user/login`, {
    datas: {
      ChannelId: channel_id,
      ...params
    }
  });
}

// 日志上报
export function report(params: {
  role_id?: number;
  role_level?: number;
  role_name?: string;
  zone_id?: number;
  zone_name?: string;
  balance?: number;
  party_name?: string;
  vip?: number;
}) {
  return post(`${u9Api}/user/roleReport`, {
    datas: {
      ...params
    }
  });
}

// 支付
export function pay(params: {
  UserId: string;
  ProductId: number;
  ProductOrderId: string;
  amount: number;
  CallbackUrl: string;
  Ext: string;
  AppExt: string;
  DeviceId: string;
  openid?: string;
}) {
  return post(`${u9Api}/payRequest/payRequest`, {
    datas: {
      ChannelId: channel_id,
      IsSwitchPayChannel: 1,
      ...params
    }
  })
}