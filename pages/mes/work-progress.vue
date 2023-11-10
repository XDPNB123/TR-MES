<script setup lang="ts">
//工单类型
let workType = ref<any[]>([
  "机加",
  "钣金",
  "电器装配",
  "单机装配",
  "总装",
  "其他",
]);
//获取项目号
let projectCode = ref<any[]>(["111", "222", "333", "444", "555"]);
</script>

<template>
  工单进度
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-toolbar density="compact">
          <v-toolbar-title class="text-center ml-0 text-blue font-weight-bold"
            >项目号</v-toolbar-title
          >
        </v-toolbar>
        <div class="d-flex flex-warp" style="width: 100vh; overflow-x: auto">
          <div
            v-for="(item, index) in projectCode"
            class="pa-3 ma-3"
            style="border: 0.4px solid green; border-radio: 10px"
          >
            {{ item }}
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-toolbar density="compact">
          <v-toolbar-title class="text-center ml-0 text-blue font-weight-bold"
            >工单类型</v-toolbar-title
          >
        </v-toolbar>
        <!-- 工单类型 -->
      </v-card>
    </v-col>
  </v-row>
</template>
