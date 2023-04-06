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

    <nav class="bar-wrap">
      <div class="logo-wrap">
        <img class="nonata-logo" src="@/assets/nonata_logo.svg" />
      </div>
      <div class="hamburger-wrap">
        <img
          class="hamburger-icon"
          src="@/assets/img/hamburger_icon.png"
          @click="hamburgerClick"
        />
      </div>
    </nav>
  </div>
</template>

<style scoped>
.map {
  width: inherit;
  height: inherit;
}

.bar-wrap {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
  border-radius: 20px 20px 20px 20px;
  width: 90%;
  height: 60px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.logo-wrap {
  position: absolute;
  width: 150px;
  height: inherit;
  left: 50%;
  transform: translate(-50%);
  background-color: white;
  border-radius: 20px 20px 20px 20px;
  z-index: 1;
}

.nonata-logo {
  height: 60px;
}

.hamburger-wrap {
  position: absolute;
  right: 5px;
  width: 140px;
  height: inherit;
  background-color: white;
  border-radius: 20px 20px 20px 20px;
  z-index: 1;
}

.hamburger-icon {
  position: absolute;
  right: 8px;
  height: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 8px;
}
</style>
