<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "欢迎使用",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "欢迎使用",
  // 该页面的描述
  description: "同日 MES 系统，欢迎使用",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，欢迎使用",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 不启用布局
definePageMeta({
  layout: false,
});
onMounted(() => {
  // 页面初始动画
  useGsap.from(".initial-animation", {
    y: 200,
    opacity: 0,
    duration: 2,
    ease: "back",
  });
});

// 获取路由
const router = useRouter();
// 去登陆页面
function goToLogin() {
  router.push({ path: "/auth/login" });
}
</script>

<template>
  <div class="initial-animation">
    <client-only>
      <Vue3Lottie animationLink="/欢迎.json" height="100vh" />
    </client-only>

    <div class="title text-h1 text-blue text-center font-weight-bold">
      同日数字化工厂系统
    </div>

    <div class="btn-container">
      <v-btn
        size="x-large"
        color="blue-darken-1"
        rounded="xl"
        min-width="200px"
        width="400px"
        @click="goToLogin()"
        >去登陆
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.btn-container {
  width: 100%;
  position: absolute;
  bottom: 10vh;
  display: flex;
  justify-content: center;
}
.title {
  width: 100%;
  position: absolute;
  top: 10vh;
}
</style>
