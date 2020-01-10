import { checkToken } from '@/api/api';
import { ApiCheckTokenOptions } from '@/api/api.d';
import { UPDATETOAST } from '@/store/types';

export default async (
  { commit, rootState }: { commit: any; rootState: any },
  params: ApiCheckTokenOptions
) => {
  const { userInfo } = rootState.user;
  const { token, guid } = userInfo;
  let status = null;
  let message = null;
  try {
    const result = await checkToken({
      ...params,
      token,
      guid
    });
    status = result.status;
  } catch (err) {
    status = !0;
    message = '登录信息已过期, 请重新登录';
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
