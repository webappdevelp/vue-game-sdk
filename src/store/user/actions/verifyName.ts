import { UPDATELOAD, UPDATETOAST, UPDATECERTIFY, UPDATEUSERINFO } from '@/store/types';
import { verifyRealName } from '@/api/bu';

export default async (
  { commit, dispatch, rootState }: { commit: any; dispatch: any; rootState: any },
  params: any
) => {
  commit(
    {
      type: UPDATELOAD,
      data: true
    },
    { root: true }
  );
  const { userInfo } = rootState.user;
  let result = null;
  let message = null;
  try {
    result = await verifyRealName({
      ...params,
      app_id: userInfo.appid,
      uid: userInfo.uid
    });
  } catch (err) {
    message = err && err.message;
  }
  commit(
    {
      type: UPDATELOAD,
      data: false
    },
    { root: true }
  );
  if (result) {
    commit({
      type: `user/${UPDATECERTIFY}`,
      data: {
        age: 0
      }
    }, { root: true });
    commit({
      type: `user/${UPDATEUSERINFO}`,
      data: {
        age: 0
      },
      action: 'updated'
    }, { root: true });
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
  return result;
};
