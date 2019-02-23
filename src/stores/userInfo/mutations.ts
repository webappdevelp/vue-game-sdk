import { UPDATEUSERINFO, UPDATEUSERACTION } from '@/stores/types';

const mutations = {
  [UPDATEUSERINFO](state: any, { data }: { data: {} }) {
    state.infos = {
      ...state.infos,
      ...data
    };
  },
  // 更新操作手柄
  [UPDATEUSERACTION](state: any, { data }: { data: string }) {
    state.action = data;
  }
};

export default mutations;
