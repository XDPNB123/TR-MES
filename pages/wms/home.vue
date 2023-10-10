<script setup lang="ts">
// 搜索引擎优化
// useSeoMeta({
//   // 该页面的标题
//   title: "物料清单"
// });

// 页面缓存
definePageMeta({
  keepalive: true,
});

let counter= ref<number>(0);
function addOne( ss : number ){
  counter.value =(counter.value as number) +ss;
}
</script>

<template>
  <head>物料清单</head>
  <div>
    <div>这是WMS主页面</div>
    <label>{{counter}}</label>
    <v-btn onclick="addOne(3)">增加3</v-btn>
  </div>
</template>