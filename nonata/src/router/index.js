import { createRouter, createWebHistory } from "vue-router";
import MainView from "../views/Home/MainView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
      children: [
        {
          path: "menu",
          component: () => import("@/views/Home/MenuView.vue"),
        },
      ],
    },
  ],
});

export default router;
