<script setup lang="ts">
useSeoMeta({
  // 该页面的标题
  title: "库存流水",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "库存流水",
  // 该页面的描述
  description: "同日 MES 系统，库存流水",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，库存流水",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: false,
});
//表头
let Headers = ref<any[]>([
  {
    title: "类型",
    align: "center",
    key: "type",
    sortable: false,
    filterable: true,
  },
  {
    title: "库位",
    align: "center",
    key: "place_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "容器号",
    align: "center",
    key: "container_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料名称",
    align: "center",
    key: "sku_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料编码",
    align: "center",
    key: "sku_code",
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
    title: "批次号",
    align: "center",
    key: "batch_lot",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料数量",
    align: "center",
    key: "sku_qty",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作时间",
    align: "center",
    key: "date",
    sortable: false,
    filterable: true,
  },
]);
//存储数据库数据
let billList = ref<any[]>([]);
//获取数据库数据
async function getBillData() {
  billList.value = [];
  const data1: any = await useHttp(
    "/wmsPalletize/G148condition",
    "get",
    undefined,
    {
      target_place: searchArea.value,
      container_code: searchContainer.value,
      sku: searchCode.value,
      sku_batch_lot: searchLot.value,
      sku_name: searchName.value,
      sku_spec: searchGg.value,
      flag_sync: "Y",
      target_warehouse: "A",
      date_puton_from: searchDateStart,
      date_puton_to: searchDateEnd,
    }
  );
  await data1.data.forEach((item: any) => {
    billList.value.push({
      type: "in",
      place_code: item.target_place,
      container_code: item.container_code,
      sku_name: item.sku_name,
      sku_code: item.sku,
      sku_spec: item.sku_spec,
      batch_lot: item.sku_batch_lot,
      sku_qty: item.sku_qty,
      date: item.time_put_on,
    });
  });

  const data2: any = await useHttp(
    "/WmsOutOrder/G170GetOutDetialList",
    "get",
    undefined,
    {
      container_code: searchContainer.value,
      place_code: searchArea.value,
      sku_code: searchCode.value,
      sku_name: searchName.value,
      batch_lot: searchLot.value,
      sku_spec: searchGg.value,
      createdate_from: searchDateStart,
      createdate_to: searchDateEnd,
      flag_done: "Y",
    }
  );
  await data2.data.forEach((item_: any) => {
    billList.value.push({
      type: "out",
      place_code: item_.place_code,
      container_code: item_.container_code,
      sku_name: item_.sku_name,
      sku_code: item_.sku_code,
      sku_spec: item_.sku_spec,
      batch_lot: item_.batch_lot,
      sku_qty: item_.sku_qty,
      date: item_.reserved10,
    });
  });
  billList.value.sort((a: any, b: any) => {
    if (a.date > b.date) {
      return -1;
    }
    return 0;
  });
}
onMounted(() => {
  getBillData();
});
//搜索名称
let searchArea = ref<any>("");
let searchContainer = ref<any>("");
let searchName = ref<any>("");
let searchGg = ref<any>("");
let searchCode = ref<any>("");
let searchLot = ref<any>("");
let date = new Date();
date.setMonth(date.getMonth() - 6);
let searchDateStart = date.toISOString().substring(0, 10);
let searchDateEnd = new Date().toISOString().substring(0, 10);

function filter() {
  getBillData();
}
function resetFilter() {
  searchArea.value = "";
  searchContainer.value = "";
  searchLot.value = "";
  searchCode.value = "";
  searchGg.value = "";
  searchName.value = "";
  searchDateStart = date.toISOString().substring(0, 10);
  searchDateEnd = new Date().toISOString().substring(0, 10);
  getBillData();
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-text-field
        label="库位"
        v-model="searchArea"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="容器号"
        v-model="searchContainer"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="物料名称"
        v-model="searchName"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="物料规格"
        v-model="searchGg"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="物料编码"
        v-model="searchCode"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="批次"
        v-model="searchLot"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="最早创建时间"
        v-model="searchDateStart"
        type="date"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="最晚创建时间"
        v-model="searchDateEnd"
        type="date"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="filter"
        >查询</v-btn
      >
      <v-btn color="red" class="mr-2 mt-2" size="default" @click="resetFilter"
        >重置查询</v-btn
      >
    </v-col>
    <v-col cols="12">
      <v-data-table
        hover
        :items-per-page="10"
        :headers="Headers"
        :items="billList"
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
      >
      </v-data-table>
    </v-col>
  </v-row>
</template>
