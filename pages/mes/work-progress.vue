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
