import notFound from './notFound';
import home from './home';
import scenes from './scenes';
import xxyGift from './xyyGift';
import test from './test';
export default [
  notFound,
  {
    ...home,
    children: []
  },
  scenes,
  xxyGift,
  test
];
