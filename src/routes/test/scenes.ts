const scenestest = () =>
  import(/* webpackChunkName: "scenestest" */ '../../views/test/scenesTest.vue');
export default {
  name: 'scenestest',
  path: '/scenestest',
  meta: { title: '进入游戏' },
  component: scenestest
};
