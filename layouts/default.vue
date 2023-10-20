<script setup lang="ts">
// 使用路由
const router = useRouter();

// 使用 cookie
const name = useCookie("name");

// 此处定义用户菜单
const userMenus = ref<any[]>([
  {
    name: "个人信息",
    path: "/auth/personal-information",
    icon: "fa-solid fa-user",
  },
  {
    name: "修改密码",
    path: "/auth/update-password",
    icon: "fa-solid fa-pen-to-square",
  },
  {
    name: "系统设置",
    path: "/auth/system-setting",
    icon: "fa-solid fa-gear",
  },
  {
    name: "常见问题",
    path: "/auth/FAQ",
    icon: "fa-solid fa-circle-question",
  },
]);

// 此处定义页面菜单
const pageMenus = ref<any[]>([
  {
    name: "看板",
    path: "/dashboard",
    icon: "fa-solid fa-chart-column",
    children: [
      {
        parentName: "看板",
        name: "主看板",
        path: "/dashboard/main-dashboard",
        icon: "fa-solid fa-boxes-stacked",
      },
    ],
  },
  {
    name: "MES",
    path: "/mes",
    icon: "fa-solid fa-table-list",
    children: [
      {
        parentName: "MES",
        name: "生产工单",
        path: "/mes/work-order-product",
        icon: "fa-solid fa-table-list",
      },
      {
        parentName: "MES",
        name: "工单排产",
        path: "/mes/work-produce-recode",
        icon: "fa-solid fa-list-ol",
      },
      {
        parentName: "MES",
        name: "常用工序",
        path: "/mes/process-maintenance",
        icon: "fa-solid fa-screwdriver-wrench",
      },
      {
        parentName: "MES",
        name: "BOM清单",
        path: "/mes/bom-list",
        icon: "fa-solid fa-list",
      },
    ],
  },
  {
    name: "WMS",
    path: "/wms",
    icon: "fa-solid fa-chart-column",
    children: [
      {
        parentName: "WMS",
        name: "仓库主页",
        path: "/wms/home",
        icon: "fa-solid fa-gauge",
      },
    ],
  },
  {
    name: "基础信息",
    path: "/work-class",
    icon: "fa-solid fa-users-rays",
    children: [
      {
        parentName: "基础信息",
        name: "工作中心",
        path: "/work-class/work-center",
        icon: "fa-solid fa-location-crosshairs",
      },
      {
        parentName: "基础信息",
        name: "工作中心图形化界面",
        path: "/work-class/work-center-img",
        icon: "fa-solid fa-location-crosshairs",
      },
      {
        parentName: "基础信息",
        name: "班组信息",
        path: "/work-class/work-class",
        icon: "fa-solid fa-people-roof",
      },
    ],
  },
]);

// tabs 类型
type TabType = {
  parentName: string;
  name: string;
  path: string;
  icon: string;
};

// 选中的 tab
let selectTab = ref<TabType | null>(null);

// 正在显示的所有 tab
let tabs = ref<TabType[]>([]);

// 添加 tab
function addTab(tab: TabType) {
  // 新的 tab 是否在 tabs 中已经存在，存在则不添加
  if (tabs.value.findIndex((item) => item.name === tab.name) < 0)
    tabs.value.push(tab);
  // 更新选中的 tab
  selectTab.value = tab;
}

// 移除 tab
function removeTab(tab: TabType) {
  // 获取要删除的 tab 的索引
  const tabIndex = tabs.value.indexOf(tab);
  // 从 tabs 中删除该 tab
  tabs.value.splice(tabIndex, 1);

  // 如果删除的 tab 为选中的 tab
  if (selectTab.value && tab.name === selectTab.value.name) {
    // 如果删除该 tab 后，tabs 长度大于 0
    if (tabs.value.length > 0) {
      // 如果删除的 tab 为最后一个，则需要更新选中的 tab 为前一个 tab，且跳转到前一个 tab
      if (tabIndex === tabs.value.length) {
        selectTab.value = tabs.value[tabIndex - 1];
        router.push({ path: tabs.value[tabIndex - 1].path });
        return;
      }
      // 如果删除的 tab 不为最后一个，则需要更新选中的 tab 为后一个 tab，且跳转到后一个 tab
      selectTab.value = tabs.value[tabIndex];
      router.push({ path: tabs.value[tabIndex].path });
    }
    // 如果删除该 tab 后，tabs 长度等于 0，则不需要做任何操作
  }
  // 如果删除的 tab 不为选中的 tab，则不需要做任何操作
}

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

// 检测 tabs 长度，如果为 0，则跳转到 home 页面
watch(
  tabs,
  () => {
    if (tabs.value.length === 0) {
      selectTab.value = null;
      router.push({ path: "/home" });
    }
  },
  { deep: true }
);
</script>

<template>
  <v-app>
    <v-app-bar color="blue-darken-2" density="compact" extension-height="44">
      <template v-slot:prepend>
        <v-img src="/同日图标.jpg" width="160px" alt="同日图标" />
        <div class="text-white font-weight-bold text-h5 ml-1 mt-1">
          数字化工厂系统
        </div>
      </template>

      <template v-slot:append>
        <v-btn
          class="mr-3"
          icon="fa-solid fa-expand"
          @click="changeFullScreen()"
        ></v-btn>

        <v-menu open-on-hover open-delay="0" close-delay="100">
          <template v-slot:activator="{ props }">
            <v-avatar v-bind="props" class="mr-3">
              <v-img src="/头像.jpg" alt="头像" />
            </v-avatar>
          </template>

          <v-card class="pa-5" rounded="xl">
            <v-list width="180">
              <v-list-item
                rounded="lg"
                class="mb-3"
                prepend-avatar="/头像.jpg"
                :title="name || '默认用户'"
                subtitle="205451"
              >
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item
                rounded="lg"
                :to="item.path"
                :subtitle="item.name"
                :prepend-icon="item.icon"
                v-for="(item, index) in userMenus"
                :key="index"
              ></v-list-item>

              <v-list-item
                rounded="lg"
                @click="exit()"
                prepend-icon="fa-solid fa-right-from-bracket"
                subtitle="退出登录"
              >
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>

      <template v-slot:extension>
        <div
          class="w-100 d-flex justify-space-between pl-3 mt-1"
          style="background-color: white"
        >
          <div class="text-h6 font-weight-medium text-blue-darken-2">
            {{ selectTab?.parentName ?? "" }}
            <span v-show="selectTab">/</span>
            {{ selectTab?.name ?? "" }}
          </div>

          <div>
            <v-menu
              open-on-hover
              open-delay="0"
              close-delay="100"
              v-for="(item, index) in pageMenus"
              :key="index"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  class="rounded-0"
                  :class="{
                    'text-blue-darken-2':
                      router.currentRoute.value.fullPath.startsWith(item.path),
                  }"
                  variant="flat"
                  v-bind="props"
                >
                  <v-icon>{{ item.icon }}</v-icon>
                  <div class="mx-6">{{ item.name }}</div>
                  <v-icon>fa-solid fa-angle-down</v-icon>
                </v-btn>
              </template>

              <v-list rounded="lg" class="pa-3">
                <!-- 当 url 匹配到 to 时，就会触发 active-class -->
                <v-list-item
                  rounded="lg"
                  active-class="list-item-active"
                  v-for="(item_, index_) in item.children"
                  :key="index_"
                  :to="item_.path"
                  :prepend-icon="item_.icon"
                  :title="item_.name"
                  @click="addTab(item_)"
                >
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu
              open-on-hover
              open-delay="0"
              close-delay="100"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ props }">
                <v-btn variant="flat" v-bind="props" class="rounded-0">
                  <v-badge color="green" class="mr-3" :content="tabs.length">
                    <v-icon>fa-regular fa-folder-open</v-icon>
                  </v-badge>
                  已打开的页面
                </v-btn>
              </template>

              <v-list rounded="lg" class="pa-3">
                <!-- 当 url 匹配到 to 时，就会触发 active-class -->
                <v-list-item
                  class="mb-1"
                  rounded="lg"
                  active-class="list-item-active"
                  v-for="(item, index) in tabs"
                  :key="index"
                  :to="item.path"
                  @click="selectTab = item"
                >
                  <template v-slot:prepend>
                    <v-icon class="mr-6">{{ item.icon }}</v-icon>
                    <div>{{ item.name }}</div>
                  </template>
                  <template v-slot:append>
                    <v-icon @click.prevent="removeTab(item)"
                      >fa-solid fa-xmark</v-icon
                    >
                  </template>
                </v-list-item>

                <v-list-item class="mb-1" rounded="lg" @click="tabs = []">
                  <template v-slot:prepend>
                    <v-icon class="mr-6">fa-solid fa-trash</v-icon>
                    <div v-if="tabs.length > 0">关闭所有</div>
                    <div v-else>没有打开任何页面</div>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
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
