const index = () =>
  import(/* webpackChunkName: "test-index" */ '../../views/test/Index.vue');
import drag from './drag';
import scenes from './scenesStore';
import openWx from './openWx';
import scenestest from './scenes';

export default {
  path: '/test',
  component: index,
  children: [drag, scenes, openWx, scenestest]
};
