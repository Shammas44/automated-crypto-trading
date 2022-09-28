import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/backtesting",
    name: "backtesting",
    component: () => import("../views/BackTestingView.vue"),
  },
  {
    path: "/quotation",
    name: "quotation",
    component: () => import("../views/QuotationView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
