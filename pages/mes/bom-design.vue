<script setup lang="ts">
let designDemo = ref<any[]>([
  {
    id: 1,
    name: "RGV小车",
    code: "M-RGV01",
    value: "rgv01-00",
  },
  {
    id: 2,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
  {
    id: 3,
    name: "称重模块",
    code: "M-CZJ01",
    value: "cz01-00",
  },
]);
let partList = ref<any[]>([
  {
    id: 1,
    name: "封板",
    value: "rgv01-00",
  },
  {
    id: 2,
    name: "滚筒输送组",
    value: "rgv01-00",
  },
  {
    id: 3,
    name: "台车大梁",
    value: "rgv01-00",
  },
  {
    id: 4,
    name: "电机止转架",
    value: "rgv01-00",
  },
  {
    id: 5,
    name: "称重支腿",
    value: "cz01-00",
  },
  {
    id: 6,
    name: "底座",
    value: "cz01-00",
  },
  {
    id: 7,
    name: "安装板",
    value: "cz01-00",
  },
  {
    id: 8,
    name: "称重拉杆",
    value: "cz01-00",
  },
]);
let designInfo = ref<any[]>([]);
function showDesign(item: any) {
  designInfo.value = partList.value.filter((_item: any) => {
    return _item.value === item.value;
  });
}
</script>
<template>
  <v-row class="ma-3">
    <v-col cols="12">
      <div class="overflow-x-auto w-100" style="white-space: nowrap">
        <v-card
          class="mx-2 mt-3 mb-1 elevation-2 rounded-lg px-6 py-3 bg-green-lighten-5"
          v-for="(item, index) in designDemo"
          :key="index"
          style="display: inline-block"
          :title="item.name"
          @click="showDesign(item)"
        >
        </v-card>
      </div>
    </v-col>
    <v-col cols="12">
      <v-card title="组装的零部件">
        <v-list v-for="(item, index) in designInfo" :key="index">
          <v-list-item :title="item.name" :subtitle="item.value">
            <template v-slot:append>
              <v-icon color="blue" size="small" class="mr-2">
                fa-solid fa-pen
              </v-icon>

              <v-icon color="red" size="small"> fa-solid fa-trash </v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>
