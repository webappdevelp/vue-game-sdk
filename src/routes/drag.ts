const drag = () =>
  import(/* webpackChunkName: "drag" */ '../views/Drag.vue');
export default {
  name: 'drag',
  path: '/drag',
  meta: { title: '进入游戏' },
  component: drag
};
