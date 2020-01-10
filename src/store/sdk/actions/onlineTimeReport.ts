import { UPDATECERTIFY, UPDATEUSERINFO } from '@/store/types';
import { reportOnlineTime } from '@/api/bu';

let reportInterval: any = null;
function clearReportInterval() {
  clearInterval(reportInterval);
  reportInterval = null;
}

const reportTime = async (state: any, params: any = {}) => {
  const { user, game, certify } = state.rootState.sdk;
  const result = await reportOnlineTime({
    ...params,
    time_start: certify.time_start || '',
    time_end: certify.time_start ? certify.time_start + 5 * 60 : '',
    uid: params.uid || user.uid,
    app_id: game.id,
    channel_id: game.channel
  });
  if (result.status === 0) {
    const { limit_type, age, online_time, time_limit } = result.data;
    let step = '';
      if ([1, 5].indexOf(limit_type) > -1) {
        /* if (online_time && online_time >= time_limit) {
          step = 'loginLimit';
        } else { */
          step = 'auth'
        // }
      } else if ([2, 3, 4].indexOf(limit_type) > -1) {
        step = 'loginLimit';
      } else if (certify.pay_limit === 1) {
        step = 'payLimit';
      }
    state.commit(UPDATECERTIFY, {
      ...result.data,
      step
    });
    state.commit(UPDATEUSERINFO, { age, step: 'updated' });
    // 1：未实名，但要弹窗实名，2、3、4未成年，时间被限制，5、未实名，需弹窗，否则退出游戏
    switch (limit_type) {
      case -1:
      case 2:
      case 3:
      case 4:
      case 5:
        clearReportInterval();
        break;
    }
  }
};

export default async (state: any, params: any) => {
  try {
    const { game, certify, user } = state.rootState.sdk;
    const result = await reportOnlineTime({
      ...params,
      time_start: certify.time_start || '',
      time_end: certify.time_start ? certify.time_start + 5 * 60 : '',
      uid: params.uid || user.uid,
      app_id: game.id,
      channel_id: game.channel
    });
    if (result.status === 0) {
      const { limit_type, online_time, time_limit } = result.data;
      let step = '';
      if ([1, 5].indexOf(limit_type) > -1) {
        /* if (online_time && online_time >= time_limit) {
          step = 'loginLimit';
        } else { */
          step = 'auth'
        // }
      } else if ([2, 3, 4].indexOf(limit_type) > -1) {
        step = 'loginLimit';
      } else if (certify.pay_limit === 1) {
        step = 'payLimit';
      }
      state.commit(UPDATECERTIFY, {
        ...result.data,
        step
      });
      state.commit(UPDATEUSERINFO, { age: result.data.age, step: 'updated' });
      if (!reportInterval) {
        reportInterval = setInterval(() => {
          reportTime(state, params);
        }, 5 * 60 * 1000);
      }
    }
  } catch (err) {
    console.log(err && err.message);
  }
};
