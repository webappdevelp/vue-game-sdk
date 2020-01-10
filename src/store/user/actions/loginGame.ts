import { UPDATELOAD, UPDATETOAST, UPDATEGAMERINFO } from '@/store/types';
import { login } from '@/api/u9api';
import { U9SignInOptions } from '@/api/api.d';

export default async (
  { commit, rootState }: { commit: any; rootState: any },
  params: U9SignInOptions
) => {
  // 显示 loading
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
    const result = await login({
      ...params,
      productId: params.app_id,
      token: userInfo.token,
      channelId: params.channel_id,
      channelUserId: userInfo.guid,
      channelUserName: userInfo.username
    });
    const { Code, UserId } = result;
    status = Code;
    if (UserId) {
      commit(
        {
          type: `user/${UPDATEGAMERINFO}`,
          data: {
            userId: UserId
          },
          action: 'logined'
        },
        { root: true }
      );
    }
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
