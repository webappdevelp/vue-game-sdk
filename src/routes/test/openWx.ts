const openWx = () =>
  import(/* webpackChunkName: "openWx" */ '../../views/test/openWx.vue');
export default {
  name: 'openWx',
  path: '/test/open-wx',
  meta: { title: '进入游戏' },
  component: openWx
};
