import {
  DeviceInitOptions,
  ApiUserInfoOptions,
  ApiCheckTokenOptions,
  ApiSignInOptions,
  ApiMobileLoginOptions,
  ApiQuickRegisterOptions,
  ApiGetMobileCodeOptions,
  ApiBindMobileOptions,
  ApiResetPswOptions,
  ApiUpdatePswOptions,
  ApiGetSysInfoOptions,
  ApiLogReportOptions,
  ApiLogOutOptions
} from '@/api/api.d';
import { post } from '@/utils/ts/fetch';
import switchApi from './switchApi';

function sendPost(url: string, params: any = {}) {
  const { start_origin } = params;
  const { api } = switchApi(start_origin);
  // delete params.start_origin;

  return post(`${api}${url}`, {
    datas: {
      ...params
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 设备初始化
export function deviceInit(params: DeviceInitOptions) {
  return sendPost('/hy/init', {
    ...params
  });
}

// 日志上报
export function logReport(params: ApiLogReportOptions) {
  return sendPost('/hy/logReport', {
    ...params
  });
}

// 获取用户信息，用于检查用户是否存在
export function checkUser(params: ApiUserInfoOptions) {
  return sendPost('/user/getinfo', {
    ...params
  });
}

// 检验登录态是否过期，仅在IOS流程中使用
export function checkToken(params: ApiCheckTokenOptions) {
  return sendPost('/user/checkToken', {
    ...params
  });
}

// 登录
export function login(params: ApiSignInOptions) {
  return sendPost('/user/login', {
    ...params
  });
}

// 手机号快登
export function mobileLogin(params: ApiMobileLoginOptions) {
  return sendPost('/user/mobileRegister', {
    ...params
  });
}

// 一键注册
export function fastReg(params: ApiQuickRegisterOptions) {
  return sendPost('/user/onekeyRegister', {
    ...params
  });
}

// 获取短信验证码
export function getVerifyCode(params: ApiGetMobileCodeOptions) {
  return sendPost('/public/getVerifyCode', {
    ...params
  });
}

// 获取服务信息
export function getServiceInfo(params: ApiGetSysInfoOptions) {
  return sendPost('/hy/getServiceInfo', {
    ...params
  });
}

// 绑定手机号
export function bindMobile(params: ApiBindMobileOptions) {
  return sendPost('/user/bindMobile', {
    ...params
  });
}

// 手机号修改密码
export function resetPassword(params: ApiResetPswOptions) {
  return sendPost('/user/resetPassword', {
    ...params
  });
}

// 更新密码
export function updatePassword(params: ApiUpdatePswOptions) {
  return sendPost('/user/updatePassword', {
    ...params
  });
}

// 退出登录
export function logOut(params: ApiLogOutOptions) {
  return sendPost('/user/logout', {
    ...params
  });
}
