import { api, channelId } from '../config';
import { post } from '../utils/ts/fetch';

function sendPost(url: string, params: any = {}) {
  return post(`${api}${url}`, {
    datas: {
      channelId,
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

// 检查用户是否存在
export function checkUser(username: string) {
  return sendPost('/user/getinfo', {
    username
  });
}

// 登录
export function login(params: { username: string; password: string }) {
  return sendPost('/user/login', {
    ...params
  });
}

// 手机号快登
export function mobileLogin(params: {
  mobile: string;
  code: string;
  app_id: string;
}) {
  return sendPost('/user/mobileRegister', {
    ...params
  });
}

// 一键注册
export function fastReg(password: string) {
  return sendPost('/user/onekeyRegister', {
    password
  });
}

// 获取短信验证码
export function getCode(params: { mobile: string; action: string }) {
  return sendPost('/public/getVerifyCode', {
    ...params
  });
}

// 获取服务信息
export function getServiceInfo(params: { app_id: string }) {
  return sendPost('/hy/getServiceInfo', {
    ...params
  });
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
  return sendPost('/pay/getOrder', {
    ...params,
    http_source: 'JSAPI',
    pay_channel: 'WXPAY'
  });
}

// 退出登录
export function logOut(params: { app_id: string }) {
  return sendPost('/user/logout', params);
}
