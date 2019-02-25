import { api, channelId } from '../config';
import { post } from '../utils/ts/fetch';

function sendPost(url: string, params: any = {}) {
  return post(`${api}${url}`, {
    datas: {
      channel: channelId,
      channel_id: channelId,
      ...params
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
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
export function fastReg(params: { password: string; device: string }) {
  return sendPost('/user/onekeyRegister', {
    ...params
  });
}

// 获取短信验证码
export function getCode(params: { mobile: string; action: string }) {
  return sendPost('/public/getVerifyCode', {
    ...params
  });
}

// 获取服务信息
export function getServiceInfo(params: { token: string; guid: string }) {
  return sendPost('/hy/getServiceInfo', {
    ...params
  });
}

// 绑定手机号
export function bindMobile(params: {
  token: string;
  guid: string;
  mobile: string;
  code: string;
}) {
  return sendPost('/user/bindMobile', {
    ...params
  });
}

// 手机号修改密码
export function resetPassword(params: {
  token: string;
  guid: string;
  mobile: string;
  code: string;
  password: string;
}) {
  return sendPost('/user/resetPassword', {
    ...params
  });
}

// 更新密码
export function updatePassword(params: {
  token: string;
  guid: string;
  old_password: string;
  password: string;
  re_password: string;
}) {
  return sendPost('/user/updatePassword', {
    ...params
  });
}

// 退出登录
export function logOut() {
  return sendPost('/user/logout');
}
