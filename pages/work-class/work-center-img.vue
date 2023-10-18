<script setup lang="ts">
const arr = new Array(12).fill({
  name: "工作中心",
  status: "状态",
  deprecated: "废弃",
  free: "空闲",
});
</script>
<template>
  <v-row class="ma-3">
    <v-col cols="3" v-for="(item, index) in arr" :key="index">
      <v-card rounded="xl">
        <v-img src="/头像.jpg" height="200px" cover class="align-center">
          <v-card-title class="text-white">{{ item.name }}</v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle class="text-white my-3">{{
            item.status
          }}</v-card-subtitle>
          <v-card-subtitle class="text-white my-3">{{
            item.deprecated
          }}</v-card-subtitle>
          <v-card-subtitle class="text-white my-3">{{
            item.free
          }}</v-card-subtitle>
        </v-img>
      </v-card>
    </v-col>
  </v-row>
</template>
