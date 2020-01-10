import { UPDATETOAST } from '@/store/types';
import { logReport } from '@/api/api';
import { ApiLogReportOptions } from '@/api/api.d';

export default ({ commit }: { commit: any }, params: ApiLogReportOptions) => {
  logReport({
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
