<script setup lang="ts">
// 使用路由
const router = useRouter();

// 使用 cookie
const name = useCookie("name");

// 切换全屏模式
function changeFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// 退出登陆
function exit() {
  router.push({ path: "/auth/login" });
}
</script>

<template>
  <v-app>
    <v-app-bar extension-height="56" density="comfortable">
      <template v-slot:prepend>
        <v-img src="/同日图标.png" width="194px" alt="同日图标" />
      </template>

      <template v-slot:append>
        <v-btn
          class="mr-3"
          icon="fa-solid fa-expand"
          @click="changeFullScreen()"
        ></v-btn>

        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-avatar v-bind="props" class="mr-3">
              <v-img src="/头像.jpg" alt="头像" />
            </v-avatar>
          </template>

          <v-list width="240" rounded="lg">
            <v-list-item
              prepend-avatar="/头像.jpg"
              :title="name || '默认用户'"
              subtitle="205451"
              class="mb-3"
            >
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item to="/auth/personal-information">
              <template #prepend>
                <v-icon class="mr-3" size="small"> fa-solid fa-user </v-icon>
                <div class="text-body-2">个人信息</div>
              </template>
            </v-list-item>

            <v-list-item to="/auth/update-password">
              <template #prepend>
                <v-icon class="mr-3" size="small">
                  fa-solid fa-pen-to-square
                </v-icon>
                <div class="text-body-2">修改密码</div>
              </template>
            </v-list-item>

            <v-list-item to="/auth/system-setting">
              <template #prepend>
                <v-icon class="mr-3" size="small"> fa-solid fa-gear </v-icon>
                <div class="text-body-2">系统设置</div>
              </template>
            </v-list-item>

            <v-list-item to="/auth/FAQ">
              <template #prepend>
                <v-icon class="mr-3" size="small">
                  fa-solid fa-circle-question
                </v-icon>
                <div class="text-body-2">常问问题</div>
              </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="exit()">
              <template #prepend>
                <v-icon class="mr-3" size="small">
                  fa-solid fa-right-from-bracket
                </v-icon>
                <div class="text-body-2">退出登录</div>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:extension>
        <div class="w-100">
          <v-divider></v-divider>

          <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn
                size="x-large"
                :color="
                  router.currentRoute.value.fullPath.startsWith('/dashboard')
                    ? 'blue-darken-3'
                    : undefined
                "
                variant="flat"
                v-bind="props"
              >
                <v-icon>fa-solid fa-chart-column</v-icon>
                <div class="mx-6">看板</div>
                <v-icon>fa-solid fa-angle-down</v-icon>
              </v-btn>
            </template>

            <v-list rounded="lg" class="pa-3">
              <!-- 当 url 匹配到 to 时，就会触发 active-class -->
              <v-list-item
                rounded="lg"
                active-class="list-item-active"
                to="/dashboard/main-dashboard"
                prepend-icon="fa-solid fa-chart-line"
                title="主看板"
              >
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn
                class="mx-6"
                size="x-large"
                :color="
                  router.currentRoute.value.fullPath.startsWith('/work-order')
                    ? 'blue-darken-3'
                    : undefined
                "
                variant="flat"
                v-bind="props"
              >
                <v-icon>fa-solid fa-table-list</v-icon>
                <div class="mx-6">工单</div>
                <v-icon>fa-solid fa-angle-down</v-icon>
              </v-btn>
            </template>

            <v-list rounded="lg" class="pa-3">
              <!-- 当 url 匹配到 to 时，就会触发 active-class -->
              <v-list-item
                rounded="lg"
                active-class="list-item-active"
                to="/work-order/work-order-product"
                prepend-icon="fa-solid fa-table-list"
                title="生产工单"
              >
              </v-list-item>
              <v-list-item
                class="mt-1"
                rounded="lg"
                active-class="list-item-active"
                to="/work-order/work-produce-recode"
                prepend-icon="fa-solid fa-list-ol"
                title="工单排产"
              >
              </v-list-item>
              <v-list-item
                class="mt-1"
                rounded="lg"
                active-class="list-item-active"
                to="/work-order/process-maintenance"
                prepend-icon="fa-solid fa-screwdriver-wrench"
                title="常用工序"
              >
              </v-list-item>

              <v-list-item
                class="mt-1"
                rounded="lg"
                active-class="list-item-active"
                to="/work-order/bom-list"
                prepend-icon="fa-solid fa-list"
                title="BOM清单"
              >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<style scoped>
.list-item-active {
  background-image: linear-gradient(25deg, #0044bd, #1e66d3, #2a88e9, #2dacff);
  color: white !important;
}
</style>
