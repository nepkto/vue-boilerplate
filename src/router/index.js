import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => Dashboard,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/users",
    name: "user.index",
    component: () => import("../views/user"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users/create",
    name: "user.create",
    component: () => import("../views/user/create"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users/edit/:id",
    name: "user.edit",
    component: () => import("../views/user/edit"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/404"),
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters["auth/isLoggedIn"]) {
      next();
      return;
    }
    next("/");
  } else {
    next();
  }
});

export default router;
