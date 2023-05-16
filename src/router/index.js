import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/item/:id/:salesCode',
    name: 'Item',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Item.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  // {
  //   path: '/new',
  //   name: 'new',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/New.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
