<script setup>
import router from "@/router";
import axios from "axios";
import { useUserStore } from "@/stores/user.js";
import { alertController } from "@ionic/vue";
const userStore = useUserStore();

const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

const errorAlert = async (msg) => {
  const alert = await alertController.create({
    header: "오류",
    subHeader: "",
    message: msg,
    buttons: ["OK"],
  });

  await alert.present();
};

const data = async function () {
  await axios({
    method: "get",
    url: "/api/myroom",

    headers: {
      Authorization: "Bearer " + getCookieValue("Authorization"),
    },
  })
    .then(function (response) {
      console.log(response);
      if (response.data.status == "ACCEPTED") {
        userStore.roomOk();
      }
    })
    .catch(function (error) {
      userStore.logout();

      return false;
    });

  router.push("/myroom");
};
</script>

<template>
  <div class="wrap">
    <div class="login-box" @click="data">나의 합승방</div>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(206, 205, 205, 0.993);
}

.login-box {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: black;
  text-align: center;
  line-height: 40px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}
</style>
