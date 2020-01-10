import { logReport } from '@/api/api';
import { ApiLogReportOptions } from '@/api/api.d';

// 日志上报
export default async (state: any, params: ApiLogReportOptions) => {
  try {
    await logReport({
      ...params
    });
  } catch (err) {
    console.log('log report error ', err && err.message);
  }
};
