import { UPDATELOAD, UPDATEMSG, UPDATECERTIFY, UPDATEUSERINFO } from '@/store/types';
import { verifyRealName } from '@/api/bu';

export default async (
  state: any,
  params: any
) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const { user, game } = state.rootState.sdk;
    const result = await verifyRealName({
      ...params,
      app_id: game.id,
      uid: user.uid
    });
    if (result.status === 0) {
      state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
      state.commit(UPDATECERTIFY, { step: '' });
      state.commit(UPDATEUSERINFO, { age: 1, step: 'updated' });
      return;
    }
    throw { message: result.message };
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
  }
};
