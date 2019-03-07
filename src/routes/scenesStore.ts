const scenestore = () =>
  import(/* webpackChunkName: "scenestore" */ '../views/ScenesStore.vue');
export default {
  name: 'scenestore',
  path: '/scenestore',
  meta: { title: '进入游戏' },
  component: scenestore
};
