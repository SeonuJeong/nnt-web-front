<script setup>
import { onMounted, ref, reactive } from "vue";
import { useLocationStore } from "@/stores/location.js";
import axios from "axios";
import { alertController } from "@ionic/vue";
import { useUserStore } from "@/stores/user.js";

const userStore = useUserStore();

const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

const errorAlert = async (msg) => {
  const alert = await alertController.create({
    header: "오류",
    subHeader: "",
    message: msg,
    buttons: ["OK"],
  });

  await alert.present();
};

const successAlert = async (msg) => {
  const alert = await alertController.create({
    header: "알림",
    subHeader: "",
    message: msg,
    buttons: ["OK"],
  });

  await alert.present();
};

const useloc = useLocationStore();

const startLoc = useloc.getStart();
const destLoc = useloc.getDest();

let startMarker = null;
let destMarker = null;

let roomStartMarker = null;
let roomDestMarker = null;

let map = null;

let rangeVal = ref(useloc.getStart().value.range);
let startCircle = null;
let destCircle = null;

const initMap = function () {
  const container = document.getElementById("map");

  const options = {
    center: new kakao.maps.LatLng(startLoc.value.lat, startLoc.value.lng),
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

  startMarker.setPosition(
    new kakao.maps.LatLng(startLoc.value.lat, startLoc.value.lng)
  );
  startMarker.setMap(map);

  destMarker.setPosition(
    new kakao.maps.LatLng(destLoc.value.lat, destLoc.value.lng)
  );
  destMarker.setMap(map);

  roomStartMarker = new kakao.maps.Marker({
    position: null,
  });

  roomDestMarker = new kakao.maps.Marker({
    position: null,
  });

  kakao.maps.event.addListener(map, "click", function (mouseEvent) {
    selectRoomId.value = -1;
    roomStartMarker.setMap(null);
    roomDestMarker.setMap(null);
  });
};

const rooms = ref([]);

const getRoomInfo = function () {
  axios({
    method: "post",
    url: "/api/find",
    data: {
      startX: startLoc.value.lat,
      startY: startLoc.value.lng,
      destX: destLoc.value.lat,
      destY: destLoc.value.lng,
      startRange: startLoc.value.range,
      destRange: destLoc.value.range,
    },
    headers: {
      Authorization: "Bearer " + getCookieValue("Authorization"),
    },
  })
    .then(function (response) {
      rooms.value = response.data;
      console.log(response);
      //console.log(rooms);
    })
    .catch(function (error) {
      userStore.logout();
      errorAlert("로그인 유효 시간을 초과했습니다.");
      router.push("/menu");
    });
};

onMounted(() => {
  getRoomInfo();
  initMap();

  startCircle = new kakao.maps.Circle({
    strokeWeight: 1, // 선의 두께입니다
    strokeColor: "#00a0e9", // 선의 색깔입니다
    strokeOpacity: 0.1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
    strokeStyle: "solid", // 선의 스타일입니다
    fillColor: "#00a0e9", // 채우기 색깔입니다
    fillOpacity: 0.2, // 채우기 불투명도입니다
  });

  startCircle.setPosition(
    new kakao.maps.LatLng(startLoc.value.lat, startLoc.value.lng)
  );
  startCircle.setOptions({
    radius: useloc.getStart().value.range,
  });
  startCircle.setMap(map);

  destCircle = new kakao.maps.Circle({
    strokeWeight: 1, // 선의 두께입니다
    strokeColor: "#00a0e9", // 선의 색깔입니다
    strokeOpacity: 0.1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
    strokeStyle: "solid", // 선의 스타일입니다
    fillColor: "#00a0e9", // 채우기 색깔입니다
    fillOpacity: 0.2, // 채우기 불투명도입니다
  });

  destCircle.setPosition(
    new kakao.maps.LatLng(destLoc.value.lat, destLoc.value.lng)
  );
  destCircle.setOptions({
    radius: useloc.getDest().value.range,
  });
  destCircle.setMap(map);
});

let state = ref("start");

const panTo = function (lat, lng) {
  // 이동할 위도 경도 위치를 생성합니다
  const moveLatLon = new kakao.maps.LatLng(lat, lng);

  // 지도 중심을 부드럽게 이동시킵니다
  // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
  map.panTo(moveLatLon);
};

const stateToggle = function () {
  if (state.value == "start") {
    state.value = "dest";
    rangeVal.value = useloc.getDest().value.range;
    panTo(useloc.getDest().value.lat, useloc.getDest().value.lng);
  } else {
    state.value = "start";
    rangeVal.value = useloc.getStart().value.range;
    panTo(useloc.getStart().value.lat, useloc.getStart().value.lng);
  }
};

const makeRoom = function () {
  axios({
    method: "post",
    url: "/api/make",
    data: {
      startX: startLoc.value.lat,
      startY: startLoc.value.lng,
      destX: destLoc.value.lat,
      destY: destLoc.value.lng,
      startAddress: useloc.getStart().value.address,
      destAddress: useloc.getDest().value.address,
    },
    headers: {
      Authorization: "Bearer " + getCookieValue("Authorization"),
    },
  })
    .then(function (response) {
      console.log(response);
      if (response.data.status == "INTERNAL_SERVER_ERROR") {
        console.log(response);
        errorAlert(response.data.data);
        return;
      }
      successAlert("방을 생성했습니다.");
      router.push("/menu");
    })
    .catch(function (error) {
      userStore.logout();
      errorAlert("로그인 유효 시간을 초과했습니다.");
      router.push("/menu");
    });
};

const selectRoomId = ref(-1);

const choose = function (locationDto, roomId) {
  if (selectRoomId.value != -1) {
    selectRoomId.value = -1;
    roomStartMarker.setMap(null);
    roomDestMarker.setMap(null);
    return;
  }

  selectRoomId.value = roomId;

  roomStartMarker.setMap(null);
  roomDestMarker.setMap(null);

  roomStartMarker.setPosition(
    new kakao.maps.LatLng(locationDto.startX, locationDto.startY)
  );
  roomDestMarker.setPosition(
    new kakao.maps.LatLng(locationDto.destX, locationDto.destY)
  );

  roomStartMarker.setMap(map);
  roomDestMarker.setMap(map);
};

const selectRoom = function () {
  axios({
    method: "post",
    url: "/api/enter",
    data: {
      roomId: selectRoomId.value,
    },
    headers: {
      Authorization: "Bearer " + getCookieValue("Authorization"),
    },
  })
    .then(function (response) {
      if (response.data.status == "INTERNAL_SERVER_ERROR") {
        console.log(response);
        errorAlert(response.data.data);
        return;
      }
      console.log(response);
      successAlert("방에 입장했습니다.");
      router.push("/menu");
    })
    .catch(function (error) {
      userStore.logout();
      errorAlert("로그인 유효 시간을 초과했습니다.");
      router.push("/menu");
    });
};
</script>

<template>
  <div>
    <div id="map" class="map">
      <div class="next-stage-wrap" @click="makeRoom">방만들기</div>
      <div v-show="selectRoomId != -1" class="select-wrap" @click="selectRoom">
        입장
      </div>
    </div>

    <nav name="bar-wrap" class="bar-wrap">
      <div name="back-control" class="back-control" @click="router.back()">
        <img class="back-arrow-icon" src="@/assets/img/back.png" />
      </div>
      <div class="explain-wrap">검색 결과</div>
    </nav>

    <div class="state-change-wrap" @click="stateToggle">
      <div :class="state == 'start' ? 'state-block-red' : 'state-block-blue'">
        {{ state == "start" ? "출발" : "도착" }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.map {
  position: relative;
  width: 100%;
  height: 50%;
}

.bar-wrap {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
  border-radius: 20px 20px 20px 20px;
  width: 90%;
  height: 40px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.back-control {
  position: absolute;
  width: 10%;
  height: 100%;
  border-radius: 20px 0px 0px 20px;
  background-color: #f5f5f5;
}

.back-arrow-icon {
  width: 100%;
  height: 100%;
}

.explain-wrap {
  position: absolute;
  left: 10%;
  width: 90%;
  height: 40px;
  border-radius: 0px 20px 20px 0px;
  background-color: white;
  text-align: center;
  line-height: 40px;
  color: black;
  font-weight: bold;
}

.state-change-wrap {
  position: absolute;
  width: 120px;
  height: 50px;
  top: 70px;
  left: 30px;
  z-index: 1;
  background-color: white;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 20px 20px 20px 20px;
}

.state-block-red {
  position: absolute;
  width: 50px;
  height: 40px;
  border-radius: 20px 20px 20px 20px;
  background-color: #e84133;
  margin-left: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 10px;
  text-align: center;
  line-height: 40px;
  color: white;
}

.state-block-blue {
  position: absolute;
  width: 50px;
  height: 40px;
  border-radius: 20px 20px 20px 20px;
  background-color: #5491f5;
  left: 50px;
  margin-left: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 10px;
  text-align: center;
  line-height: 40px;
  color: white;
}

.state-block-text {
  text-align: center;
  line-height: inherit;
}

.next-stage-wrap {
  position: absolute;
  width: 100px;
  height: 50px;
  bottom: 10px;
  right: 10px;
  z-index: 2;
  background-color: #01c864;
  border-radius: 50px 50px 50px 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: white;
  text-align: center;
  line-height: 50px;
}

.select-wrap {
  position: absolute;
  width: 100px;
  height: 50px;
  bottom: 10px;
  right: 120px;
  z-index: 2;
  background-color: #01c864;
  border-radius: 50px 50px 50px 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: white;
  text-align: center;
  line-height: 50px;
}
</style>
