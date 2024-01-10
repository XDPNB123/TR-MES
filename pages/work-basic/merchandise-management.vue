<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "商品管理",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "商品管理",
  // 该页面的描述
  description: "同日 MES 系统，商品管理",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，商品管理",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 不采用布局
definePageMeta({
  layout: "default",
});
let searchMerchandiseCode = ref<any>(null);
let searchMerchandiseName = ref<any>(null);
let searchMerchandiseTypeId = ref<any>(null);
let searchSupplierName = ref<any>(null);
let merchandiseBigType = ref<any>(null);
let merchandiseMiddleType = ref<any>(null);
let merchandiseSmallType = ref<any>(null);
let addDialog = ref<boolean>(false);
let editDialog = ref<boolean>(false);
let deleteDialog = ref<boolean>(false);
let merchandiseBigList = ref<any[]>([]);
let merchandiseMiddleList = ref<any[]>([]);
let merchandiseSmallList = ref<any[]>([]);
//表头
let headers = ref<any[]>([
  {
    title: "商品编码",
    align: "center",
    key: "commoditycode",
    sortable: false,
    filterable: true,
  },
  {
    title: "商品名称",
    align: "center",
    key: "commodityname",
    sortable: false,
    filterable: true,
  },
  {
    title: "商品类别id",
    align: "center",
    key: "typeid",
    sortable: false,
    filterable: true,
  },
  {
    title: "商品描述",
    align: "center",
    key: "commodity_description",
    sortable: false,
    filterable: true,
  },
  {
    title: "供应商名称",
    align: "center",
    key: "suppliername",
    sortable: false,
    filterable: true,
  },
  {
    title: "品牌",
    align: "center",
    key: "brand",
    sortable: false,
    filterable: true,
  },
  {
    title: "重量",
    align: "center",
    key: "weight",
    sortable: false,
    filterable: true,
  },
  {
    title: "长度",
    align: "center",
    key: "length",
    sortable: false,
    filterable: true,
  },
  {
    title: "高度",
    align: "center",
    key: "width",
    sortable: false,
    filterable: true,
  },
  {
    title: "宽度",
    align: "center",
    key: "height",
    sortable: false,
    filterable: true,
  },
  {
    title: "体积",
    align: "center",
    key: "volume",
    sortable: false,
    filterable: true,
  },
  {
    title: "成本",
    align: "center",
    key: "cost",
    sortable: false,
    filterable: true,
  },
  {
    title: "价格",
    align: "center",
    key: "price",
    sortable: false,
    filterable: true,
  },
  {
    title: "颜色",
    align: "center",
    key: "color",
    sortable: false,
    filterable: true,
  },
]);
let merchandiseList = ref<any[]>([]);
//搜索
function filter() {
  getWareHouseDate();
}
function resetFilter() {}
function showAddDialog() {
  addDialog.value = true;
}
function showEditDialog(item: any) {}
function showDelDialog(item: any) {}
function addMerchandise() {}
function MerchandiseBigTypeSelectDone(){

}
function MerchandiseMiddleTypeSelectDone(){

}
function MerchandiseSmallTypeSelectDone(){}
async function getWareHouseDate() {}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="3">
       <v-text-field
        label="商品编码"
        v-model="searchMerchandiseCode"
        variant="outlined"
        density="compact"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="3">
       <v-text-field
        label="商品名称"
        v-model="searchMerchandiseName"
        variant="outlined"
        density="compact"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="3">
       <v-text-field
        label="商品类别id"
        v-model="searchMerchandiseTypeId"
        variant="outlined"
        density="compact"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="3">
       <v-text-field
        label="供应商名称"
        v-model="searchSupplierName"
        variant="outlined"
        density="compact"
        hide-details
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
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="showAddDialog"
      >
        新增商品
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        hover
        :items-per-page="10"
        :headers="headers"
        :items="merchandiseList"
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
      >
        <template v-slot:item.action="{ item }">
          <v-icon
            color="blue"
            size="small"
            class="mr-3"
            @click="showEditDialog(item.raw)"
          >
            fa-solid fa-pen
          </v-icon>
          <!-- 删除 -->
          <v-icon color="red" size="small" @click="showDelDialog(item.raw)">
            fa-solid fa-trash
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <!-- 商品 -->
  <v-dialog v-model="addDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增商品 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-row>
          
        </v-row>
      </v-card-text>
      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="addMerchandise()"
        >
          确认
        </v-btn>
        <v-btn color="grey" size="large" @click="addDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
