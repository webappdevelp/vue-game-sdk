import csReport from '@/api/cs';
import { CSReportOptions } from '@/api/api.d';

export default async (state: any, params: CSReportOptions) => {
  try {
    await csReport({
      ...params
    });
  } catch (err) {
    console.info('cs report error ', err && err.message);
  }
};
