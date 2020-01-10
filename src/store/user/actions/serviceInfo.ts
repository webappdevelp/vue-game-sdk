import { UPDATEUSERINFO, UPDATEUSERAPPINFO } from '@/store/types';
import { getServiceInfo } from '@/api/api';
import { ApiGetSysInfoOptions } from '@/api/api.d';

export default async (
  { commit, rootState }: { commit: any; rootState: any },
  params: ApiGetSysInfoOptions
) => {
  const { userInfo } = rootState.user;
  let status = null;
  let message = null;
  try {
    const result = await getServiceInfo({
      ...params,
      token: userInfo.token,
      guid: userInfo.guid
    });
    status = result.status;
    const { app } = result.data;
    commit(
      {
        type: `user/${UPDATEUSERAPPINFO}`,
        data: app
      },
      { root: true }
    );
  } catch (err) {
    status = !0;
    message = err && err.message;
  }
  return { status, message };
};
