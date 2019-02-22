const scenes = () =>
  import(/* webpackChunkName: "scenes" */ '../views/Scenes.vue');
export default {
  name: 'scenes',
  path: '/scenes',
  meta: { title: '进入游戏' },
  component: scenes
};
