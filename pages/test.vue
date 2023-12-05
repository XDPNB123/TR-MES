<template>
  <div class="container">
    <div class="page" :class="{ flipped: isFlipped }">
      <div class="front">
        <v-btn @click="isFlipped = true">翻转到新页面</v-btn>
        <div>初始页面</div>
      </div>
      <div class="back">
        <v-btn @click="isFlipped = false">返回原来页面</v-btn>
        <div>翻转后的新页面</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

let isFlipped = ref(false);
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
