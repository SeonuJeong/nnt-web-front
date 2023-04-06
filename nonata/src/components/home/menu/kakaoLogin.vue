<script setup>
import { useUserStore } from "@/stores/user.js";

const userStore = useUserStore();

const loginWithKakao = async function () {
  await Kakao.Auth.authorize({
    redirectUri: "http://www.nonata.link/auth/kakao/callback",
  });

  userStore.oauthLogin();
};
</script>

<template>
  <div class="wrap">
    <img
      src="@/assets/login_icon/kakao_login_medium.png"
      class="login-box"
      @click="loginWithKakao"
      v-if="!userStore.getLogin"
    />

    <div class="logined-box" v-if="userStore.getLogin">로그인 완료</div>
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
  border-radius: 50px;
  text-align: center;
  line-height: 40px;
  color: white;
}

.logined-box {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 150px;
  height: 40px;
  background-color: #fee500;
  text-align: center;
  border-radius: 50px;
  line-height: 40px;
  color: black;
  font-size: 15px;
  font-weight: bold;
}
</style>
