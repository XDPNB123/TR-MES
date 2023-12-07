<script setup lang="ts">
//弹框

//搜索
let searchCtnId = ref<any>(null);
let searchPlaceId = ref<any>(null);
let searchWarehouse = ref<any>(null);
let searchArea = ref<any>(null);
let searchMaterial = ref<any>(null);
let searchMaterialDesc = ref<any>(null);
let searchInDateTo = ref<any>(null);
let searchInDateFrom = ref<any>(null);
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
    title: "物料规格",
    align: "center",
    key: "sku_spec",
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
    title: "库区",
    align: "center",
    key: "area_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "仓库",
    align: "center",
    key: "warehouse_code",
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
    title: "操作",
    align: "center",
    key: "action",
    sortable: false,
    filterable: true,
  },
]);
//存储数据库数据
let inventoryList = ref<any[]>([]);
//获取数据库时间
async function getInventoryData() {
  const data: any = await useHttp(
    "/wmsInventory/G115condition_query",
    "post",

    {
      ctn_id: searchCtnId.value,
      placeid: searchPlaceId.value,
      warehouse: searchWarehouse.value,
      area: searchArea.value,
      material: searchMaterial.value,
      materialDesc: searchMaterialDesc.value,
      indateTo: searchInDateTo.value,
      indateFrom: searchInDateFrom.value,
    }
  );
  inventoryList.value = data.data;
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
  getInventoryData();
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-text-field
        label="容器编号"
        v-model="searchCtnId"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="库位编号"
        v-model="searchPlaceId"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
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
    <v-col cols="3">
      <v-select
        label="库区"
        v-model="searchArea"
        :items="['0', '1']"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="物料编码"
        v-model="searchMaterial"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="物料描述"
        v-model="searchMaterialDesc"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
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
    <v-col cols="3">
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
      <v-btn color="blue-darken-2" class="mr-2 mt-2" size="default">
        新增库位
      </v-btn>
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
      >
        <template v-slot:item.action="{ item }">
          <!-- 修改 -->
          <v-icon color="blue" size="small" class="mr-3">
            fa-solid fa-pen
          </v-icon>
          <!-- 删除 -->
          <v-icon color="red" size="small"> fa-solid fa-trash </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <!-- 新增库存 -->
    <v-dialog v-model="addDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增库位 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-select
                label="仓库类型"
                v-model="stationInfo.place_type"
                :items="['平面库', '立体库', '临时库', '虚拟库']"
                clearable
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="默认物料"
                v-model="stationInfo.default_sku"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                label="仓库号"
                v-model="stationInfo.warehouse"
                :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="库区号"
                v-model="stationInfo.area_code"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="排"
                v-model="stationInfo.num_row"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="列"
                v-model="stationInfo.num_cloumn"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="层"
                v-model="stationInfo.num_layer"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="4">
              <v-text-field
                label="长"
                v-model="stationInfo.lenth"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="4"
              ><v-text-field
                label="宽"
                v-model="stationInfo.width"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="4"
              ><v-text-field
                label="高"
                v-model="stationInfo.height"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="12">
              <v-text-field
                label="库位名称"
                v-model="stationInfo.place_desc"
                clearable
                hide-details
                append-inner-icon="fa-solid fa-star"
                @click:append-inner="importName"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addSation()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="addDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
