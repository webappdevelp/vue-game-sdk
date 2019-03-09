const drag = () =>
  import(/* webpackChunkName: "drag" */ '../../views/test/drag.vue');
export default {
  name: 'drag',
  path: '/test/drag',
  meta: { title: '进入游戏' },
  component: drag
};
