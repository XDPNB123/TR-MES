<script setup lang="ts">
//搜索绑定
let searchWarehouse = ref<any>(null);
let searchPlaceCode = ref<any>(null);
let searchPlaceDesc = ref<any>(null);
let searchAreaCode = ref<any>(null);
let searchContainer = ref<any>(null);
let searchDefaultSku = ref<any>(null);
let searchFlag = ref<any>(null);
let searchIsEmpty = ref<any>(null);
let searchOccupy = ref<any>(null);
let searchPlaceType = ref<any>(null);
let searchDisable = ref<any>(null);

let headers = ref<any[]>([
  {
    title: "仓库号",
    align: "center",
    key: "warehouse",
    sortable: false,
    filterable: true,
  },
  {
    title: "库位类型",
    align: "center",
    key: "place_type",
    sortable: false,
    filterable: true,
  },
  {
    title: "库位号",
    align: "center",
    key: "place_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "库位名称",
    align: "center",
    key: "place_desc",
    sortable: false,
    filterable: true,
  },
  {
    title: "库区号",
    align: "center",
    key: " area_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "容器号",
    align: "center",
    key: "container_id",
    sortable: false,
    filterable: true,
  },
  {
    title: "占用单据号",
    align: "center",
    key: "occupy_order",
    sortable: false,
    filterable: true,
  },
  {
    title: "默认物料",
    align: "center",
    key: "default_sku",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否为空Y/N",
    align: "center",
    key: "is_empty",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否有任务",
    align: "center",
    key: "flag_has_task",
    sortable: false,
    filterable: true,
  },
  {
    title: "禁用",
    align: "center",
    key: "disable",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    align: "center",
    key: "action",
    sortable: false,
    filterable: true,
  },
]);
let wareHouseList = ref<any[]>([]);
//获取数据库内的数据
async function getWareHouseDate() {
  const data: any = await useHttp("/wmsPlace/G100placeid", "get", undefined, {
    place_id: "",
    warehouse: searchWarehouse.value,
    place_code: searchPlaceCode.value,
    place_desc: searchPlaceDesc.value,
    area_code: searchAreaCode.value,
    container_id: searchContainer.value,
    is_empty: searchIsEmpty.value,
    flag_has_task: searchFlag.value,
    default_sku: searchDefaultSku.value,
    occupy_order: searchOccupy.value,
    place_type: searchPlaceType.value,
    disable: searchDisable.value,
  });
  wareHouseList.value = data.data.map((item: any) => {
    item.is_empty = item.is_empty === "Y" ? "是" : "否";
    item.flag_has_task = item.flag_has_task === "Y" ? "是" : "否";
    item.disable = item.disable === "Y" ? "是" : "否";
    return item;
  });
}
//页面加载时,获取数据
onMounted(() => {
  getWareHouseDate();
});
//搜索
function filter() {
  getWareHouseDate();
}
//重置搜素
function resetFilter() {
  searchWarehouse.value = "";
  searchPlaceCode.value = "";
  searchPlaceDesc.value = "";
  searchAreaCode.value = "";
  searchContainer.value = "";
  searchDefaultSku.value = "";
  searchFlag.value = "";
  searchIsEmpty.value = "";
  searchOccupy.value = "";
  searchPlaceType.value = "";
  searchDisable.value = "";
  getWareHouseDate();
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="2">
      <v-text-field
        label="仓库号"
        v-model="searchWarehouse"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="库位号"
        v-model="searchPlaceCode"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="仓库名称"
        v-model="searchPlaceDesc"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="库区号"
        v-model="searchAreaCode"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="容器号"
        v-model="searchContainer"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="默认物料"
        v-model="searchDefaultSku"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="库位类型"
        v-model="searchPlaceType"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="占用单据号"
        v-model="searchOccupy"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-select
        label="是否有任务"
        v-model="searchFlag"
        variant="outlined"
        :items="['是', '否']"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="2">
      <v-select
        label="是否为空"
        v-model="searchIsEmpty"
        :items="['是', '否']"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="2">
      <v-select
        label="是否禁用"
        v-model="searchDisable"
        :items="['是', '否']"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="filter"
        >搜索</v-btn
      >
      <v-btn color="red" class="mr-2 mt-2" size="default" @click="resetFilter"
        >重置搜索</v-btn
      >
      <v-btn color="blue-darken-2" class="mr-2 mt-2" size="default">
        新增库位
      </v-btn>
    </v-col>
    <v-col>
      <v-data-table
        hover
        :items-per-page="10"
        :headers="headers"
        :items="wareHouseList"
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
      >
        <template v-slot:item.action="{ item }">
          <!-- 库位详情 -->
          <v-icon color="blue" size="small" class="mr-5">
            fa-solid fa-mattress-pillow
          </v-icon>
          <!-- 修改 -->
          <v-icon color="blue" size="small" class="mr-3">
            fa-solid fa-pen
          </v-icon>
          <!-- 删除 -->
          <v-icon color="red" size="small"> fa-solid fa-trash </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>
