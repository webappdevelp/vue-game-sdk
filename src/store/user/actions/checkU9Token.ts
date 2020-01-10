import { checkToken } from '@/api/u9api';
import { U9CheckTokenOptions } from '@/api/api.d';
import { UPDATETOAST } from '@/store/types';

export default async (
  { commit, rootState }: { commit: any, rootState: any },
  params: U9CheckTokenOptions
) => {
  const { userInfo, gamerInfo } = rootState.user;
  const { token } = userInfo;
  const { userId } = gamerInfo;
  let status = null;
  let message = null;
  try {
    const result = await checkToken({
      ...params,
      token,
      userId
    });
    status = result.Code;
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
