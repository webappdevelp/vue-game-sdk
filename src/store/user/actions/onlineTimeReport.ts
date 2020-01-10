import { UPDATECERTIFY, UPDATEUSERINFO } from '@/store/types';
import { reportOnlineTime } from '@/api/bu';

export default async ({ commit, dispatch, rootState }: { commit: any; dispatch: any; rootState: any }, params: any) => {
  const { userInfo, gamerInfo, userCertify } = rootState.user;
  let verifyInfo = null;
  try {
    const result = await reportOnlineTime({
      ...params,
      time_start: userCertify.time_start || '',
      uid: userInfo.uid,
      app_id: gamerInfo.appId,
      channel_id: gamerInfo.channelId
    });
    if (result.status === 0) {
      verifyInfo = result.data;
    }
  } catch (err) {
    console.log(err && err.message);
  }
  if (verifyInfo) {
    commit(
      {
        type: `user/${UPDATECERTIFY}`,
        data: verifyInfo
      },
      { root: true }
    );
    // 更新缓存的用户数据
    if (verifyInfo.age !== userInfo.age) {
      commit(
        {
          type: `user/${UPDATEUSERINFO}`,
          data: {
            age: verifyInfo.age
          },
          action: 'updated'
        },
        { root: true }
      );
    }
  }
};
