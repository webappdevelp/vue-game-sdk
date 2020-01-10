import {
  DeviceInitOptions,
  U9SignInOptions,
  U9CheckTokenOptions,
  U9RoleReportOptions
} from '@/api/api.d';
import { post } from '@/utils/ts/fetch';
import switchApi from './switchApi';

function sendPost(url: string, params: any = {}) {
  const { start_origin } = params;
  const { u9Api } = switchApi(start_origin);
  // delete params.start_origin;

  return post(`${u9Api}${url}`, {
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
  return sendPost('/u9/init', {
    ...params
  });
}

// 登录
export function login(params: U9SignInOptions) {
  return sendPost('/login/loginRequest', {
    ...params
  });
}

// 校验登录
export function checkToken(params: U9CheckTokenOptions) {
  return sendPost('/validateLogin/index', {
    ...params
  });
}

// 日志上报
export function roleReport(params: U9RoleReportOptions) {
  return sendPost('/user/roleReport', {
    ...params
  });
}
