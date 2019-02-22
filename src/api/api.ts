import { api, channel_id } from '../config';
import { post } from '../utils/ts/fetch';

// 检查用户是否存在
export function checkUser(username: string) {
  return post(`${api}/user/getinfo`, {
    datas: {
      channel_id,
      username
    }
  });
}

// 登录
export function login(params: { username: string; password: string }) {
  return post(`${api}/user/login`, {
    datas: {
      channel_id,
      ...params
    }
  });
}

// 手机号快登
export function mobileLogin(params: { mobile: string; code: string }) {
  return post(`${api}/user/mobileRegister`, {
    datas: {
      channel_id,
      ...params
    }
  });
}

// 一键注册
export function fastReg(password: string) {
  return post(`${api}/user/onekeyRegister`, {
    datas: {
      channel_id,
      password
    }
  });
}

// 获取服务信息
export function getServiceInfo() {
  return post(`${api}/hy/getServiceInfo`);
}

// 支付
export function pay(params: {
  u9uid: string;
  guid: string;
  ry_device_id: string;
  app_order_id: string;
  amount: number;
  subject: string;
  body: string;
  http_source: string;
  pay_channel: string;
  callback_url: string;
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
  u9uid: string;
  guid: string;
  ry_device_id: string;
  app_order_id: string;
  order_id: string;
  amount: number;
  subject: string;
  body: string;
  http_source: string;
  pay_channel: string;
  callback_url: string;
  ext: string;
  app_ext: string;
  openid?: string;
  IsSwitchPayChannel: number;
}) {
  return post(`${api}/pay/getOrder`, {
    datas: {
      ...params,
      http_source: 'JSAPI',
      pay_channel: 'WXPAY'
    }
  });
}

// 退出登录
export function logOut() {
  return post(`${api}/user/logout`);
}

// 生成虚拟订单号
function getVtOrderId() {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth() +
    1}${date.getDate()}${date.getTime()}${date.getSeconds()}`;
}
