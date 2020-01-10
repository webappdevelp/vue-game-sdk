import actions from './actions';
import mutations from './mutations';
const state = {
  msg: {
    show: false,
    content: '',
    type: 'info'
  },
  loading: {
    show: false,
    content: '正在加载...'
  }
}

const getters = {
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {}
};