import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/ListView',
    name: 'ListView',
    component: () => import('../views/ListView.vue')
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
