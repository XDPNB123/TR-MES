<template>
  <div>
    <v-btn @click="openPrint()"> 打印 </v-btn>
    <div id="printContent">
      <div>你好</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import printJS from "print-js";
function openPrint() {
  printJS({
    printable: "printContent",
    type: "html",
    targetStyles: ["*"],
  });
}
</script>

<style scoped>
.container {
  perspective: 1000px;
}

.page {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
}

.page.flipped {
  transform: rotateY(180deg);
}

.front,
.back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}
</style>
