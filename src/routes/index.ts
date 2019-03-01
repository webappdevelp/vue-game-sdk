import notFound from './notFound';
import home from './home';
import scenes from './scenes';
import xxyGift from './xyyGift';
export default [
  notFound,
  {
    ...home,
    children: []
  },
  scenes,
  xxyGift
];
