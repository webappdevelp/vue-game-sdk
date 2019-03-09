const index = () =>
  import(/* webpackChunkName: "test-index" */ '../../views/test/Index.vue');
import drag from './drag';
import scenes from './scenesStore';

export default {
  path: '/test',
  component: index,
  children: [drag, scenes]
};
