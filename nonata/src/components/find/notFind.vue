<script setup></script>

<template>
  <div>
    <div class="box-wrap">
      <img src="@/assets/img/not_find_icon.png" class="not-find-icon" />
      <div class="text-box">검색 결과가 없습니다</div>
      <div class="text-box">직접 방을 만들어 보세요</div>
    </div>
  </div>
</template>

<style scoped>
.box-wrap {
  width: 200px;
  height: 100px;
  position: relative;
  top: 30px;
  left: 50%;
  transform: translate(-50%);
}

.not-find-icon {
  display: block;
  width: 60px;
  height: 60px;
  margin: 0 auto;
}

.text-box {
  text-align: center;
  margin: 0 auto;
}
</style>
