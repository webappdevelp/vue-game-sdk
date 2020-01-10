import { UPDATELOAD, UPDATETOAST } from '@/store/types';
import { getVerifyCode } from '@/api/api';
import { ApiGetMobileCodeOptions } from '@/api/api.d';

export default async (
  { commit }: { commit: any },
  params: ApiGetMobileCodeOptions
) => {
  commit(
    {
      type: UPDATELOAD,
      data: true
    },
    { root: true }
  );
  let status = null;
  let message = null;
  try {
    const result = await getVerifyCode({
      ...params
    });
    status = result.status;
    message = '验证码发送成功';
  } catch (err) {
    status = !0;
    message = err && err.message;
  }
  if (status !== null) {
    commit(
      {
        type: UPDATELOAD,
        data: false
      },
      { root: true }
    );
  }
  if (message) {
    commit(
      {
        type: UPDATETOAST,
        data: message
      },
      { root: true }
    );
  }
  return status;
};
