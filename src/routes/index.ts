import notFound from './notFound';
import home from './home';
import scenes from './scenes';
import scenestore from './scenesStore';
import xxyGift from './xyyGift';
import drag from './drag';
export default [
  notFound,
  {
    ...home,
    children: []
  },
  scenes,
  scenestore,
  drag,
  xxyGift
];
