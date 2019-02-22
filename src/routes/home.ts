const home = () => import(/* webpackChunkName: "home" */ '../views/Home.vue');
export default {
  name: 'home',
  path: '/',
  meta: { title: '首页' },
  component: home
};
