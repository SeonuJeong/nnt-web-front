<script setup>
import { onMounted, ref } from "vue";
import { useLocationStore } from "@/stores/location.js";
import { alertController, IonSearchbar } from "@ionic/vue";
import { Geolocation } from "@capacitor/geolocation";
import router from "@/router";
import StartDestSelect from "@/components/map/StartDestSelect.vue";
import resultList from "@/components/map/resultList.vue";

const useloc = useLocationStore();

const lat = ref(35.2309383);
const lng = ref(129.0825007);

const startLoc = {
  lat: 0,
  lng: 0,
  state: false,
};

const destLoc = {
  lat: 0,
  lng: 0,
  state: false,
};

let marker = null;
let startMarker = null;
let destMarker = null;
const markerState = ref(false);

let map = null;

const initMap = function () {
  const container = document.getElementById("map");

  const options = {
    center: new kakao.maps.LatLng(lat.value, lng.value),
    level: 3,
  };

  map = new kakao.maps.Map(container, options);

  startMarker = new kakao.maps.Marker();
  let startMarkjerImage = new kakao.maps.MarkerImage(
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png",
    new kakao.maps.Size(50, 45),
    new kakao.maps.Point(15, 43)
  );
  startMarker.setImage(startMarkjerImage);

  destMarker = new kakao.maps.Marker();
  let destMarkerImage = new kakao.maps.MarkerImage(
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png",
    new kakao.maps.Size(50, 45),
    new kakao.maps.Point(15, 43)
  );
  destMarker.setImage(destMarkerImage);

  marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(lat.value, lng.value),
  });

  marker.setMap(map);
  markerState.value = true;
};

onMounted(() => {
  initMap();

  kakao.maps.event.addListener(map, "click", function (mouseEvent) {
    if (markerState.value == true) {
      marker.setMap(null);
      markerState.value = false;
      return;
    }

    const latlng = mouseEvent.latLng;

    lat.value = latlng.getLat();
    lng.value = latlng.getLng();

    marker.setPosition(new kakao.maps.LatLng(lat.value, lng.value));
    marker.setMap(map);
    markerState.value = true;
  });
});

const gpsAlert = async () => {
  const alert = await alertController.create({
    header: "GPS 수신 불가",
    subHeader: "",
    message: "위치정보를 켜주세요",
    buttons: ["OK"],
  });

  await alert.present();
};

const panTo = function () {
  const moveLatLon = new kakao.maps.LatLng(lat.value, lng.value);

  map.panTo(moveLatLon);
};

const printCurrentPosition = async () => {
  let coordinates;

  try {
    coordinates = await Geolocation.getCurrentPosition();
  } catch {
    gpsAlert();
    return;
  }

  lat.value = coordinates.coords.latitude;
  lng.value = coordinates.coords.longitude;
  panTo();

  marker.setMap(null);

  marker.setPosition(new kakao.maps.LatLng(lat.value, lng.value));

  marker.setMap(map);
  markerState.value = true;
};

const completeAlert = async () => {
  const alert = await alertController.create({
    header: "확인 불가",
    subHeader: "",
    message: "출발지와 도착지를 설정해주세요",
    buttons: ["OK"],
  });

  await alert.present();
};

const isComplete = function () {
  if (startLoc.state && destLoc.state) {
    useloc.setStartPos(startLoc.lat, startLoc.lng);
    useloc.setDestPos(destLoc.lat, destLoc.lng);
    router.push("/option");
  } else {
    completeAlert();
  }
};

const geocoder = new kakao.maps.services.Geocoder();

const startCallback = function (result, status) {
  if (status === kakao.maps.services.Status.OK) {
    useloc.setStartAddress(result[0].address.address_name);
  }
};

const destCallback = function (result, status) {
  if (status === kakao.maps.services.Status.OK) {
    useloc.setDestAddress(result[0].address.address_name);
  }
};

const startBtn = function () {
  startLoc.lat = lat.value;
  startLoc.lng = lng.value;
  startLoc.state = true;
  marker.setMap(null);
  markerState.value = false;

  const coord = new kakao.maps.LatLng(lat.value, lng.value);
  startMarker.setPosition(coord);
  startMarker.setMap(map);

  geocoder.coord2Address(coord.getLng(), coord.getLat(), startCallback);
};

const destBtn = function () {
  destLoc.lat = lat.value;
  destLoc.lng = lng.value;
  destLoc.state = true;
  marker.setMap(null);
  markerState.value = false;

  const coord = new kakao.maps.LatLng(lat.value, lng.value);
  destMarker.setPosition(coord);
  destMarker.setMap(map);

  geocoder.coord2Address(coord.getLng(), coord.getLat(), destCallback);
};

//==== search window ===========
const places = new kakao.maps.services.Places();
const searchData = ref([]);
const isSearch = ref(false);
const searchChange = function (e) {
  const callback = function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      searchData.value = result;
    }
  };

  isSearch.value = true;

  if (e.target.value != "") {
    places.keywordSearch(e.target.value, callback);
  }
};

const backControl = function () {
  if (isSearch.value) {
    isSearch.value = false;
    return;
  }

  router.back();
};

const choose = function (latData, lngData, id) {
  isSearch.value = false;

  if (marker != null) {
    marker.setMap(null);
    marker = null;
    markerState.value = false;
  }

  lat.value = latData;
  lng.value = lngData;

  marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(lat.value, lng.value),
  });

  marker.setMap(map);
  markerState.value = true;
  panTo();
};
</script>

<template>
  <div style="position: relative">
    <div id="map" class="map"></div>
    <nav name="bar-wrap" class="bar-wrap">
      <div name="back-control" class="back-control" @click="backControl">
        <img class="back-arrow-icon" src="@/assets/img/back.png" />
      </div>
      <div name="search-bar" class="search-bar-wrap">
        <ion-searchbar
          showCancelButton="focus"
          class="custom"
          animated="true"
          mode="ios"
          @ionChange="searchChange"
          @ion-focus="isSearch = true"
          @ion-cancel="isSearch = false"
        ></ion-searchbar>
      </div>
    </nav>

    <div class="search-container" v-show="isSearch">
      <div class="search-list-wrap">
        <resultList
          v-for="data in searchData"
          :key="searchData.id"
          :data="data"
          class="result-list-content"
          @choose="choose"
        ></resultList>
      </div>
    </div>

    <div
      name="current-pos-wrap"
      class="current-pos-wrap"
      @click="printCurrentPosition()"
    >
      <img
        src="@/assets/img/gps_icon.png"
        style="
          width: 100%;
          height: 100%;
          display: block;
          margin: auto;
          opacity: 0.75;
        "
      />
    </div>

    <div class="info-wrap" v-show="markerState">
      <StartDestSelect
        class="info-route-wrap"
        @startBtn="startBtn"
        @destBtn="destBtn"
      >
      </StartDestSelect>
    </div>

    <div
      class="next-stage-wrap"
      v-if="destLoc.state && startLoc.state"
      @click="isComplete"
    >
      다음
    </div>
    <footer name="ads-wrap" class="ads-wrap"></footer>
  </div>
</template>

<style scoped>
.map {
  width: 100%;
  height: inherit;
}

.bar-wrap {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%);
  z-index: 3;
  border-radius: 20px 20px 20px 20px;
  width: 90%;
  height: 40px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.back-control {
  display: inline-block;
  width: 10%;
  height: 100%;
  border-radius: 20px 0px 0px 20px;
  background-color: #f5f5f5;
}

.back-arrow-icon {
  width: 100%;
  height: 100%;
}

.search-bar-wrap {
  display: inline-block;
  position: relative;
  width: 90%;
  height: inherit;
  border-radius: 0px 20px 20px 0px;
  background-color: white;
}

.search-bar {
  left: 50%;
  transform: translate(-50%);
  position: absolute;
  width: 70px;
}

ion-searchbar.custom {
  --background: #ffffff;
  --color: #000000;
  --placeholder-color: #000000;
  --icon-color: #000000;
  --clear-button-color: #000000;

  --border-radius: 4px;
  width: 100%;
  height: inherit;
  position: absolute;
}

ion-searchbar.ios.custom {
  --cancel-button-color: #000000;
}

ion-searchbar.md.custom {
  --cancel-button-color: #000000;
}

.current-pos-wrap {
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: 1;
  border-radius: 40px 40px 40px 40px;
  width: 40px;
  height: 40px;
  background-color: aliceblue;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.current-pos-img {
  position: relative;
  margin: auto 0;
}

.ads-wrap {
  position: absolute;
  width: 320px;
  height: 50px;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: none;
}
.info-wrap {
  position: absolute;
  width: 320px;
  height: 100px;
  bottom: 100px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
  border-radius: 20px 20px 20px 20px;
  /* background-color: white; */
}

.info-route-wrap {
  width: inherit;
  height: inherit;
}

.next-stage-wrap {
  position: absolute;
  width: 50px;
  height: 50px;
  bottom: 200px;
  right: 10px;
  z-index: 1;
  background-color: #01c864;
  border-radius: 50px 50px 50px 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: white;
  text-align: center;
  line-height: 50px;
}

.search-container {
  position: absolute;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: #d4dce2;
}

.search-list-wrap {
  position: absolute;
  top: 60px;
  width: 100%;
  height: -webkit-calc(100% - 60px); /* for Chrome, Safari */
  height: -moz-calc(100% - 60px); /* for Firefox */
  height: calc(100% - 60px); /* for IE */
  overflow: scroll;
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
}

.search-list-wrap::-webkit-scrollbar {
  display: none;
}

.result-list-content {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid rgba(206, 205, 205, 0.993);
  background-color: rgb(255, 255, 255);
}
</style>
