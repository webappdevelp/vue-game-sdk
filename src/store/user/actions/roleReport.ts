import { UPDATETOAST } from '@/store/types';
import { roleReport } from '@/api/u9api';
import { U9RoleReportOptions } from '@/api/api.d';

export default ({ commit }: { commit: any }, params: U9RoleReportOptions) => {
  roleReport({
    ...params
  }).catch((err: { message: string }) => {
    commit(
      {
        type: UPDATETOAST,
        data: err.message
      },
      { root: true }
    );
  });
};
