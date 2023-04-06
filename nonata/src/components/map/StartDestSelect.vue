<script setup></script>

<template>
  <div>
    <div class="address-wrap">
      <slot></slot>
    </div>
    <div class="button-wrap">
      <button class="start-button" @click="$emit('startBtn')">출발</button>
      <button class="dest-button" @click="$emit('destBtn')">도착</button>
    </div>
  </div>
</template>

<style scoped>
.address-wrap {
  position: relative;
  height: 30px;
  width: 200px;
  left: 50%;
  transform: translate(-50%);
  top: 5px;
}
.button-wrap {
  position: absolute;
  width: 230px;
  height: 70px;
  left: 50%;
  transform: translate(-50%);
}
.start-button {
  display: inline-block;
  width: 100px;
  height: 60px;
  background-color: #e84133;
  border-radius: 50px 50px 50px 50px;
  margin-right: 30px;
  margin-top: 5px;
  margin-bottom: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.dest-button {
  display: inline-block;
  width: 100px;
  height: 60px;
  border-radius: 50px 50px 50px 50px;
  background-color: #5491f5;
  margin-top: 5px;
  margin-bottom: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
