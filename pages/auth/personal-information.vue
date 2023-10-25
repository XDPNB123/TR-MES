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

<script setup lang="ts">
import draggable from "vuedraggable";
const list1 = ref([
  { name: "John", id: 1 },
  { name: "Joao", id: 2 },
  { name: "Jean", id: 3 },
  { name: "Gerard", id: 4 },
]);
const list2 = ref([
  { name: "Juan", id: 5 },
  { name: "Edgard", id: 6 },
  { name: "Johnson", id: 7 },
]);
</script>

<template>
  <v-slide-group show-arrows>
    <draggable :list="list1" group="people" itemKey="name">
      <template #item="{ element, index }">
        <v-card
          class="inline-card mx-2"
          :border="true"
          :title="element.name + '>' + index"
        >
        </v-card>
      </template>
    </draggable>
  </v-slide-group>
  <v-row class="mt-3">
    <v-col cols="2">
      <v-card width="200">
        <draggable :list="list2" group="people" itemKey="name">
          <template #item="{ element, index }">
            <v-list-item
              :border="true"
              :title="element.name + '>' + index"
            ></v-list-item>
          </template>
        </draggable>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.inline-card {
  display: inline-flex;
}
</style>
