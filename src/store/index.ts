import Vue from 'vue';
import Vuex from 'vuex';
import {
  UPDATETOAST,
  UPDATELOAD
} from './types';
import global from './global';
import sdk from './sdk';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toast: {
      show: false,
      msg: '',
      time: 2000
    },
    loading: false
  },
  mutations: {
    // 更新toast提示
    [UPDATETOAST](state, { data, time }: { data: string, time: number}) {
      if (data) {
        state.toast = {
          ...state.toast,
          show: true,
          msg: data,
          time
        };
      }
    },
    // 更新loading动画显示
    [UPDATELOAD](state, { data }: { data: boolean }) {
      state.loading = data || false;
    }
  },
  actions: {
  },
  modules: {
    global,
    sdk
  },
});
