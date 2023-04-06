<script setup>
const setScreenSize = function () {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
setScreenSize();
window.addEventListener("resize", setScreenSize);
</script>

<template></template>

<style scoped></style>
