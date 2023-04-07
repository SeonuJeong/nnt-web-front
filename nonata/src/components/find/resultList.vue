<script setup>
import { defineProps } from "vue";
const props = defineProps(["room"]);
</script>

<template>
  <div
    style="position: relative"
    @click="$emit('choose', props.room.locationDto, props.room.roomId)"
  >
    <div class="start-wrap">
      <p class="text-header" style="color: #e84133">출발지:</p>
      <p>{{ props.room.locationDto.startAddress }}</p>
    </div>
    <div class="dest-wrap">
      <p class="text-header" style="color: #5491f5">도착지:</p>
      <p>{{ props.room.locationDto.destAddress }}</p>
    </div>

    <div class="count-wrap">
      <p>{{ props.room.enteredNum }}</p>
      <p>/4</p>
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
