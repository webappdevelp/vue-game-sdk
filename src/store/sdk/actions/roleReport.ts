import { roleReport } from '@/api/u9api';
import { U9RoleReportOptions } from '@/api/api.d';

export default async (state: any, params: U9RoleReportOptions) => {
  try {
    await roleReport({
      ...params
    });
  } catch (err) {
    console.info('role report error ', err && err.message);
  }
};
