<script setup lang="ts">
let selected = ref<any[]>([]);
let items = ref<any[]>([]);
</script>
<template>
  <tree-view :treeData="items" :checkedValues="selected"></tree-view>
</template>
