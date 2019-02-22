import Vue from 'vue';
import Vuex from 'vuex';
import {
  UPDATETOAST,
  UPDATELOAD
} from './stores/types';
import modules from './stores';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toast: {
      show: false,
      msg: ''
    },
    loading: false
  },
  mutations: {
    // 更新toast提示
    [UPDATETOAST](state, { data }: { data: string}) {
      if (data) {
        state.toast = {
          ...state.toast,
          show: true,
          msg: data
        };
      }
    },
    // 更新loading动画显示
    [UPDATELOAD](state, { data }: { data: boolean }) {
      state.loading = data || false;
    }
  },
  actions: {},
  modules
});
