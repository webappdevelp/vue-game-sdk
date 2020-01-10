import { UPDATEMSG, UPDATELOAD } from '@/store/types';
const mutations = {
  [UPDATEMSG](state: any, datas: any = {}) {
    state.msg = {
      ...state.msg,
      ...datas
    };
  },
  [UPDATELOAD](state: any, datas: any ={}) {
    state.loading = {
      ...state.loading,
      ...datas
    }
  }
};

export default mutations;
