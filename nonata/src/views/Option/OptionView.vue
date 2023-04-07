<script setup>
import { onMounted, ref } from "vue";
import { useLocationStore } from "@/stores/location.js";

const useloc = useLocationStore();

const startLoc = useloc.getStart();

const destLoc = useloc.getDest();

let startMarker = null;
let destMarker = null;

let map = null;

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
};

onMounted(() => {
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
</script>
