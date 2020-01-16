import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: '首页' },
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
  },
  {
    name: 'scenes',
    path: '/scenes',
    meta: { title: '正在加载游戏' },
    component: () => import(/* webpackChunkName: "scenes" */ '@/views/sdk/index.vue')
  },
  {
    name: 'skfb',
    path: '/scenes/skfb',
    meta: { title: '正在加载游戏' },
    component: () => import(/* webpackChunkName: "skfb" */ '@/views/scenes/gaoruifa_zf_01/Index.vue')
  },
  {
    name: 'skfb02',
    path: '/scenes/skfb02',
    meta: { title: '正在加载游戏' },
    component: () => import(/* webpackChunkName: "skfb02" */ '@/views/scenes/gaoruifa_zf_02/Index.vue')
  },
  {
    name: 'xyy',
    path: '/actions/xyy-gift',
    meta: { title: '领取礼包码' },
    component: () => import(/* webpackChunkName: "xyy-gift" */ '@/views/concern/XiaoyaoyouGift.vue')
  },
  {
    name: 'poly',
    path: '/poly',
    meta: { title: '正在加载游戏' },
    component: () => import(/* webpackChunkName: "poly" */ '@/views/poly/index.vue')
  },
  {
    name: 'sw',
    path: '/sw',
    meta: { title: '正在加载游戏' },
    component: () => import(/* webpackChunkName: "sw" */ '@/views/sw.vue')
  },
  {
    name: 'ad',
    path: '/ad',
    meta: { title: '用户专属福利' },
    component: () => import(/* webpackChunkName: "ad" */ '@/views/ad/index.vue')
  },
  {
    name: 'punch',
    path: '/punch',
    meta: { title: '每日签到' },
    component: () => import(/* webpackChunkName: "layout" */ '@/views/Layout.vue'),
    children: [
      {
        name: 'punch-mrlm',
        path: 'mrlm',
        meta: { title: '微信签到' },
        component: () => import(/* webpackChunkName: "punch-mrlm" */ '@/views/punch/mrlm/Index.vue')
      }
    ]
  },
  {
    name: 'test',
    path: '/test',
    meta: { title: '测试' },
    component: () => import(/* webpackChunkName: "test" */ '@/views/test.vue')
  },
  {
    name: '404',
    path: '*',
    meta: { title: '404' },
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/games/' : process.env.BASE_URL,
  routes
});

export default router;
