<!-- <script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "个人信息",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "个人信息",
  // 该页面的描述
  description: "同日 MES 系统，个人信息",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，个人信息",
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
  <div class="initial-animation">这是个人信息页面</div>
</template> -->

<template>
  <VQRCode :data="data"></VQRCode>
</template>

<script setup lang="ts">
const data = ref<any[]>([
  {
    project: "1234",
    mcode: "椅子",
    produce: "打磨",
    date: "2023-10-01",
    number: "120",
    unit: "个",
    value: "123",
  },
  {
    project: "12222234",
    mcode: "桌子",
    produce: "清洗",
    date: "2023-10-01",
    number: "12",
    unit: "个",
    value: "123",
  },
  {
    project: "23123",
    mcode: "衣服",
    produce: "缝纫",
    date: "2023-10-01",
    number: "200",
    unit: "件",
    value: "123",
  },
]);
</script>
