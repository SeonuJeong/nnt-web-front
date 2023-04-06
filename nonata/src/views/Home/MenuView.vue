<script setup>
import router from "@/router";
import kakaoLogin from "@/components/home/menu/kakaoLogin.vue";
import myRoom from "@/components/home/menu/myRoom.vue";

const clickBack = function () {
  router.replace("/");
};
</script>

<template>
  <div>
    <div class="side-menu-background" @click="clickBack"></div>
    <aside class="side-menu">
      <kakaoLogin class="login-state-wrap"></kakaoLogin>
      <myRoom class="menu-wrap"></myRoom>
    </aside>
  </div>
</template>

<style scoped>
.side-menu {
  position: absolute;
  width: 200px;
  height: 100%;
  top: 0px;
  right: 0px;
  background-color: white;
  z-index: 3;
  transition: all 0.5s;
}
.side-menu-background {
  position: absolute;
  top: 0;
  right: 0;
  background-color: black;
  opacity: 0.2;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.login-state-wrap {
  width: inherit;
  height: 70px;
}

.menu-wrap {
  width: inherit;
  height: 50px;
}
</style>
