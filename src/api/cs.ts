import { CSReportOptions } from './api.d';
import switchApi from './switchApi';
import { post } from '@/utils/ts/fetch';

function sendPost(url: string, params: any = {}) {
  const { start_origin } = params;
  const { cqApi } = switchApi(start_origin);
  return post(`${cqApi}${url}`, {
    datas: {
      ...params
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// CS打点上报
export default function csReport(params: CSReportOptions) {
  return sendPost('/cs/report', {
    ...params
  });
}
