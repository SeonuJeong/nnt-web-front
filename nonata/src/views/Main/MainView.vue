<script setup>
import { onMounted, ref } from "vue";

const lat = ref(35.2309383);
const lng = ref(129.0825007);

const initMap = function () {
  const container = document.getElementById("map");

  const options = {
    center: new kakao.maps.LatLng(lat.value, lng.value),
    level: 3,
  };

  const map = new kakao.maps.Map(container, options);
  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(lat.value, lng.value),
  });

  marker.setMap(map);
};

onMounted(() => {
  initMap();
});
</script>

<template>
  <div>
    <div id="map" class="map"></div>
  </div>
</template>

<style scoped>
.map {
  width: inherit;
  height: inherit;
}
</style>
