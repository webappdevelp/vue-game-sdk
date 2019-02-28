const notFound = () =>
  import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue');
export default {
  name: '404',
  path: '*',
  meta: { title: '404' },
  component: notFound
};
