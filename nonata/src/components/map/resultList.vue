<script setup>
import { defineProps } from "vue";
const props = defineProps(["data"]);
</script>

<template>
  <div
    style="position: relative"
    @click="$emit('choose', props.data.y, props.data.x, props.data.id)"
  >
    <div class="start-wrap">
      <p class="text-header">장소:</p>
      <p>{{ props.data.place_name }}</p>
    </div>
    <div class="dest-wrap">
      <p class="text-sub">카테고리:</p>
      <p class="text-sub">{{ props.data.category_name }}</p>
    </div>
  </div>
</template>

<style scoped>
.start-wrap {
  position: absolute;
  left: 0;
  top: 0;
  height: 25px;
  width: 80%;
}

.dest-wrap {
  position: absolute;
  left: 0;
  top: 25px;
  height: 25px;
  width: 80%;
}

p {
  display: inline;
}

.text-header {
  font-size: 15px;
  font-weight: bold;
}

.text-sub {
  font-size: 12px;
  font-weight: bold;
}
.count-wrap {
  position: absolute;
  right: 0;
  top: 0;
  width: 20%;
  height: 50px;

  text-align: center;
  line-height: 50px;
}
</style>
