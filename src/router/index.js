import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '@/store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { authRequired: true },
  },
  {
    path: '/item/:id/:salesCode',
    name: 'Item',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Item.vue'),
    meta: { authRequired: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(function (to, from, next) {
  if (
    to.matched.some(function (routeInfo) {
      return routeInfo.meta.authRequired;
    }) &&
    !store.getters.isLogin
  ) {
    // 로그인이 안 되어있을 시 로그인 페이지로 이동
    next('/login');
  } else if (to.name === 'login' && store.getters.isLogin) {
    // 로그인 상태로 로그인 페이지 접근 시 홈으로 이동
    next('/');
  } else {
    next();
  }
});

export default router;
