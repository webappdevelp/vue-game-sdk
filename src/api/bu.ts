import { post } from '@/utils/ts/fetch';
import switchApi from './switchApi';

function sendPost(url: string, params: any = {}) {
  const { start_origin } = params;
  const { bu } = switchApi(start_origin);
  // delete params.start_origin;

  return post(`${bu}${url}`, {
    datas: {
      ...params
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 实名认证登记
export function verifyRealName(params: any) {
  return sendPost('/user/realNameVerify', {
    ...params
  });
}

// 在线时长上报
export function reportOnlineTime(params: any) {
  return sendPost('/user/onlineTimeUpload', {
    ...params
  });
}
