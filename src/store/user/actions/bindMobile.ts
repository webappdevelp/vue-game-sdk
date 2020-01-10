import {
  UPDATELOAD,
  UPDATETOAST,
  UPDATEUSERINFO,
  UPDATEGAMERINFO
} from '@/store/types';
import { bindMobile } from '@/api/api';
import { ApiBindMobileOptions } from '@/api/api.d';

export default async (
  {
    commit,
    dispatch,
    rootState
  }: { commit: any; dispatch: any; rootState: any },
  params: ApiBindMobileOptions
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
    const result = await bindMobile({
      ...params,
      token: userInfo.token,
      guid: userInfo.guid
    });
    commit(
      {
        type: `user/${UPDATEUSERINFO}`,
        data: {
          mobile: params.mobile
        },
        action: 'updated'
      },
      { root: true }
    );
    commit(
      {
        type: `user/${UPDATEGAMERINFO}`,
        data: {},
        action: 'updated'
      },
      { root: true }
    );
    const controlResult = await dispatch(
      'user/getServiceInfo',
      { ...params },
      { root: true }
    );
    status = controlResult.status;
    message = '绑定成功';
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
