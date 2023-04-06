<script setup>
import { RouterView } from "vue-router";

const setScreenSize = function () {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
setScreenSize();
window.addEventListener("resize", setScreenSize);
</script>

<template>
  <RouterView class="module area_sidebar" />
</template>

<style scoped>
.module {
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
  position: relative;
  max-height: 1000px;
}

.area_sidebar {
  height: calc(var(--vh, 1vh) * 100);
}
</style>
