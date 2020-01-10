import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'spin.js/spin.css';
import 'whatwg-fetch';
import './icons'; // icon

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
