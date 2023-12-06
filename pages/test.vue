<template>
  <VQRCode2 :data="dataCode"></VQRCode2>
</template>

<script setup lang="ts">
import { ref } from "vue";
let dataCode = ref<any[]>([
  {
    text: "库位号1",
    value: "A-01-01-01-01",
  },
  {
    text: "库位号2",
    value: "A-01-01-01-02",
  },
  {
    text: "库位号3",
    value: "A-01-01-01-03",
  },
  {
    text: "库位号4",
    value: "A-01-01-01-04",
  },
]);
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
