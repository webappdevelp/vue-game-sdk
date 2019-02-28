const xxyGift = () =>
  import(/* webpackChunkName: "xyy-gift" */ '../views/actions/XiaoyaoyouGift.vue');
export default {
  name: 'xyy',
  path: '/actions/xyy-gift',
  meta: { title: '领取礼包码' },
  component: xxyGift
};
