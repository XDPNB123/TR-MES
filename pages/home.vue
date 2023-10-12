<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "主页",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "主页",
  // 该页面的描述
  description: "同日 MES 系统，主页",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，主页",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
onMounted(() => {
  // 页面初始动画
  useGsap.from(".initial-animation", {
    y: 100,
    opacity: 0,
    duration: 0.5,
  });
});
</script>

<template>
  <div class="initial-animation">
    <client-only>
      <Vue3Lottie animationLink="/主页.json" height="80vh" />
    </client-only>
  </div>
</template>
