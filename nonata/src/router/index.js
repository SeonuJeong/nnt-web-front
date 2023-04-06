import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user.js";
import MainView from "../views/Home/MainView.vue";
import { alertController } from "@ionic/vue";

const loginAlert = async () => {
  const alert = await alertController.create({
    header: "잠시만요",
    subHeader: "",
    message: "로그인이 필요해요",
    buttons: ["OK"],
  });

  await alert.present();
};

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
    {
      path: "/map",
      name: "map",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/Map/MapView.vue"),

      beforeEnter: (to, from) => {
        const userStore = useUserStore();

        if (userStore.getLogin) {
          return true;
        }
        loginAlert();
        return router.push("/menu");
      },
    },
  ],
});

export default router;
