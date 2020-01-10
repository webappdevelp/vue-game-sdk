import {
  UPDATELOAD,
  UPDATETOAST,
  UPDATEUSERINFO
} from '@/store/types';
import { resetPassword } from '@/api/api';
import { ApiResetPswOptions } from '@/api/api.d';

export default async (
  {
    commit,
    dispatch,
    rootState
  }: { commit: any; dispatch: any; rootState: any },
  params: ApiResetPswOptions
) => {
  commit(
    {
      type: UPDATELOAD,
      data: true
    },
    { root: true }
  );
  const { userInfo } = rootState.user;
  let status = null;
  let message = null;
  try {
    const result = await resetPassword({
      ...params,
      token: userInfo.token,
      guid: userInfo.guid
    });
    status = result.status;
    message = '密码修改成功';
    commit(
      {
        type: `user/${UPDATEUSERINFO}`,
        data: {
          ...result.data
        },
        action: 'updated'
      },
      { root: true }
    );
    const res = await dispatch('user/loginGame', { ...params }, { root: true });
    status = res;
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
