import { ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import axios from "axios";
export const useUserStore = defineStore("user", () => {
  const getCookieValue = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

  const loginState = ref(false);
  const hasroom = ref(false);

  axios({
    method: "get",
    url: "/api/set",
    data: {},
    headers: {
      Authorization: "Bearer " + getCookieValue("Authorization"),
    },
  })
    .then(function (response) {
      if (response.data.status == "OK") {
        loginState.value = true;
      }
    })
    .catch(function (error) {});

  function oauthLogin() {
    loginState.value = true;
  }

  function login(userInfo) {
    axios
      .post("/login", {
        email: userInfo.email,
        password: userInfo.password,
      })
      .then(function (response) {
        window.localStorage.setItem(
          "authorization",
          response.headers.authorization
        );

        loginState.value = true;
        router.replace("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function logout() {
    loginState.value = false;
  }

  function roomOk() {
    hasroom.value = true;
  }

  function roomNo() {
    hasroom.value = false;
  }

  const getRoomState = computed(() => {
    return hasroom.value;
  });

  const getLogin = computed(() => {
    return loginState.value;
  });

  return { getLogin, login, logout, roomOk, roomNo, getRoomState, oauthLogin };
});
