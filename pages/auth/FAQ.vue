<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "常见问题",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "常见问题",
  // 该页面的描述
  description: "同日 MES 系统，常见问题",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，常见问题",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 不采用布局
definePageMeta({
  layout: false,
});
onMounted(() => {
  // 页面初始动画
  useGsap.from(".initial-animation", {
    y: 100,
    opacity: 0,
    duration: 1,
  });
});
</script>

<template>
  <div class="initial-animation">这是常见问题页面</div>
</template>
