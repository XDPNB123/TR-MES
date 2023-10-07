<script setup lang="ts">
// 不启用布局
definePageMeta({
  layout: false,
});
// 获取路由
const router = useRouter();
// 去登陆页面
function goToLogin() {
  router.push({ path: "/auth/login" });
}
</script>

<template>
  <div>
    <client-only>
      <Vue3Lottie animationLink="/欢迎.json" height="100vh" />
    </client-only>

    <div class="title text-h1 text-blue text-center font-weight-bold">
      同日 MES 系统
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
