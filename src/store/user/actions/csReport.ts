import { UPDATETOAST } from '@/store/types';
import csReport from '@/api/cs';
import { CSReportOptions } from '@/api/api.d';

export default ({ commit }: { commit: any }, params: CSReportOptions) => {
  csReport({
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
