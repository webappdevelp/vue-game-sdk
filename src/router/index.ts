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
    name: 'play',
    path: '/play',
    meta: { title: '正在加载游戏' },
    component: () => import(/* webpackChunkName: "play_game" */ '@/views/sdk/index.vue')
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
