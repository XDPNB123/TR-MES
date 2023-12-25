<script setup lang="ts">
useSeoMeta({
  // 该页面的标题
  title: "库存管理",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "库存管理",
  // 该页面的描述
  description: "同日 MES 系统，库存管理",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，库存管理",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
//搜索
let searchCtnId = ref<any>(null);
let searchPlaceId = ref<any>(null);
let searchWarehouse = ref<any>(null);
let searchArea = ref<any>(null);
let searchMaterial = ref<any>(null);
let searchMaterialDesc = ref<any>(null);
let searchInDateTo = ref<any>(null);
let searchInDateFrom = ref<any>(null);
let searchLot = ref<any>(null);
let searchReserve = ref<any>(null);
let searchSkuSpec = ref<any>(null);
//表头
let headers = ref<any[]>([
  {
    title: "库位编号",
    align: "center",
    key: "place_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "容器编号",
    align: "center",
    key: "container_id",
    sortable: false,
    filterable: true,
  },

  {
    title: "物料描述",
    align: "center",
    key: "sku_desc",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料编码",
    align: "center",
    key: "sku",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料规格",
    align: "center",
    key: "sku_spec",
    sortable: false,
    filterable: true,
  },
  {
    title: "项目编号",
    align: "center",
    key: "reserved01",
    sortable: false,
    filterable: true,
  },

  {
    title: "库存数量",
    align: "center",
    key: "qty",
    sortable: false,
    filterable: true,
  },
  {
    title: "包装单位",
    align: "center",
    key: "uom",
    sortable: false,
    filterable: true,
  },

  {
    title: "来源单号",
    align: "center",
    key: "source_order",
    sortable: false,
    filterable: true,
  },
  {
    title: "来源类型",
    align: "center",
    key: "source_type",
    sortable: false,
    filterable: true,
  },
  {
    title: "条码",
    align: "center",
    key: "barcode",
    sortable: false,
    filterable: true,
  },
  {
    title: "库存状态",
    align: "center",
    key: "state",
    sortable: false,
    filterable: true,
  },
  {
    title: "库存批次",
    align: "center",
    key: "lot",
    sortable: false,
    filterable: true,
  },
  {
    title: "入库时间（最新）",
    align: "center",
    key: "time_in",
    sortable: false,
    filterable: true,
  },
  {
    title: "出库时间（计划）",
    align: "center",
    key: "time_out",
    sortable: false,
    filterable: true,
  },
  {
    title: "第一次入库时间",
    align: "center",
    key: "time_first_in",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建人",
    align: "center",
    key: "user_create",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新人",
    align: "center",
    key: "user_update",
    sortable: false,
    filterable: true,
  },
]);
//存储数据库数据
let inventoryList = ref<any[]>([]);
//获取数据库数据
async function getInventoryData() {
  const data: any = await useHttp(
    "/wmsInventory/G115condition_query",
    "post",

    {
      container_id: searchCtnId.value,
      place_code: searchPlaceId.value,
      warehouse_code: searchWarehouse.value,
      area_code: searchArea.value,
      sku: searchMaterial.value,
      sku_desc: searchMaterialDesc.value,
      indateTo: searchInDateTo.value,
      indateFrom: searchInDateFrom.value,
      lot: searchLot.value,
      reserved01: searchReserve.value,
      sku_spec: searchSkuSpec.value,
    }
  );
  inventoryList.value = data.data.map((item: any) => {
    item.time_in = item.time_in.substring(0, 10);
    item.time_out = item.time_out.substring(0, 10);
    item.time_first_in = item.time_first_in.substring(0, 10);
    return item;
  });
}
onMounted(() => {
  getInventoryData();
});
//搜索
function filter() {
  getInventoryData();
}
//重置搜素
function resetFilter() {
  searchCtnId.value = "";
  searchPlaceId.value = "";
  searchWarehouse.value = "";
  searchArea.value = "";
  searchMaterial.value = "";
  searchMaterialDesc.value = "";
  searchInDateTo.value = "";
  searchInDateFrom.value = "";
  searchLot.value = "";
  searchReserve.value = "";
  searchSkuSpec.value = "";
  getInventoryData();
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="2">
      <v-text-field
        label="容器编号"
        v-model="searchCtnId"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="库位编号"
        v-model="searchPlaceId"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>

    <v-col cols="2">
      <v-text-field
        label="物料编码"
        v-model="searchMaterial"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="物料描述"
        v-model="searchMaterialDesc"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="物料规格"
        v-model="searchSkuSpec"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="项目编号"
        v-model="searchReserve"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="库存批次"
        v-model="searchLot"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="库区"
        v-model="searchArea"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-select
        label="仓库"
        v-model="searchWarehouse"
        :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>

    <v-col cols="2">
      <v-text-field
        label="最早入库时间"
        v-model="searchInDateTo"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        type="date"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="最晚入库时间"
        v-model="searchInDateFrom"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        type="date"
      ></v-text-field>
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
    </v-col>
    <v-col cols="12">
      <v-data-table
        hover
        :items-per-page="10"
        :headers="headers"
        :items="inventoryList"
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
      ></v-data-table>
    </v-col>
  </v-row>
</template>
