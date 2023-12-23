<script setup lang="ts">
import printJS from "print-js";
import QrcodeVue from "qrcode.vue";
//弹框
let addDialog = ref<boolean>(false);
let editDialog = ref<boolean>(false);
let deleteDialog = ref<boolean>(false);
let auditDialog = ref<boolean>(false);

let addDetailDialog = ref<boolean>(false);
let editDetailDialog = ref<boolean>(false);
let deleteDetailDialog = ref<boolean>(false);
let orderHeaders = ref<any[]>([
  {
    title: "出库单号",
    align: "center",
    key: "out_order_num",
    sortable: false,
    filterable: true,
  },
  {
    title: "出库类型",
    align: "center",
    key: "out_order_type",
    sortable: false,
    filterable: true,
  },

  {
    title: "制单时间",
    align: "center",
    key: "order_date",
    sortable: false,
    filterable: true,
  },
  {
    title: "出库制单员",
    align: "center",
    key: "order_maker",
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
    title: "库区",
    align: "center",
    key: "area_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "单据状态",
    align: "center",
    key: "order_status",
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
let detailHeaders = ref<any[]>([
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
    title: "物料编码",
    align: "center",
    key: "sku_code",
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
    title: "明细状态",
    align: "center",
    key: "detail_status",
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
    title: "库存批次",
    align: "center",
    key: "lot",
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
]);
//查询数据
//出货清单
let searchWarehouse = ref<any>("");
let searchArea = ref<any>("");
let searchStatus = ref<any>("");
let searchWType = ref<any>("");
let searchOrderNum = ref<any>("");
//清单明细
let searchContainer = ref<any>("");
let searchPlace = ref<any>("");
let searchSkuCode = ref<any>("");
let searchSkuName = ref<any>("");
//库存
let searchCtnId = ref<any>("");
let searchPlaceId = ref<any>("");
let searchMaterial = ref<any>("");
let searchMaterialDesc = ref<any>("");
let searchSkuSpec = ref<any>("");
let searchLot = ref<any>("");
//清单查询
function filter() {
  getDate();
}
//明细查询
function filterDetail() {
  getDateDetail();
}
//清单重置查询
function resetFilter() {
  searchWarehouse.value = "";
  searchArea.value = "";
  searchStatus.value = "";
  searchWType.value = "";
  getDate();
}
//明细重置搜素
function resetDetail() {
  searchContainer.value = "";
  searchPlace.value = "";
  searchSkuCode.value = "";
  searchSkuName.value = "";
  getDateDetail();
}
//存储当前下的清单编号
let orderCode = ref<string>("");
let status = ref<string>("");
watch(orderCode, function () {
  getDateDetail();
});
//清单数据
let orderList = ref<any[]>([]);
//获取数据库清单数据
async function getDate() {
  const data: any = await useHttp(
    "/WmsOutOrder/G166GetOutOrderList",
    "get",
    undefined,
    {
      out_order_type: searchWType.value,
      order_status: searchStatus.value,
      warehouse_code: searchWarehouse.value,
      area_code: searchArea.value,
      out_order_num: searchOrderNum.value,
    }
  );
  orderList.value = data.data.map((item: any) => {
    item.order_date = item.order_date.substring(0, 10);
    return item;
  });
  orderCode.value = orderList.value[0].out_order_num;
}
//点击获取当前清单下的明细
function showDetail(item: any, obj: any) {
  orderCode.value = obj.item.raw.out_order_num;
  status.value = obj.item.raw.order_status;
}

let detailList = ref<any[]>([]);
//获取数据库清单明细数据
async function getDateDetail() {
  const data: any = await useHttp(
    "/WmsOutOrder/G170GetOutDetialList",
    "get",
    undefined,
    {
      container_code: searchContainer.value,
      place_code: searchPlace.value,
      sku_code: searchSkuCode.value,
      sku_name: searchSkuName.value,
      out_order_num: orderCode.value,
    }
  );
  detailList.value = data.data;
}
//页面加载更新数据
onMounted(() => {
  getDate();
  getDateDetail();
});
//清单对象
let orderInfo = ref<any>("");
//打开清单添加弹框
function showAddDialog() {
  orderInfo.value = {
    out_order_type: "",
    belong_customer: "",
    warehouse_code: "",
    area__code: "",
    order_status: "新建",
    priority: "",
    carrier_people: "",
    reserved01: "",
    reserved02: "",
    reserved03: "",
    reserved04: "",
    reserved05: "",
    reserved06: "",
    reserved07: "",
    reserved08: "",
    reserved09: "",
    reserved10: "",
  };
  addDialog.value = true;
}
async function addSucces() {
  const data: any = await useHttp("/WmsOutOrder/G167AddOutOrder", "post", [
    orderInfo.value,
  ]);
  getDate();
  addDialog.value = false;
}
//清单修改
function showEditDialog(item: any) {
  orderInfo.value = { ...item };
  editDialog.value = true;
}
async function editSucces() {
  const data: any = await useHttp(
    "/WmsOutOrder/G168UptOutOrder",
    "put",
    orderInfo.value
  );
  getDate();
  editDialog.value = false;
}
//清单删除
function showDelDialog(item: any) {
  orderInfo.value = { ...item };
  deleteDialog.value = true;
}
async function delSucces() {
  const data: any = await useHttp(
    "/WmsOutOrder/G169DelOutOrder",
    "delete",
    undefined,
    {
      id: orderInfo.value.id,
      out_order_num: orderInfo.value.out_order_num,
    }
  );
  getDate();
  getDateDetail();
  deleteDialog.value = false;
}
//清单审核
function showAuditDialog(item: any) {
  orderInfo.value = { ...item };
  auditDialog.value = true;
}
async function auditSucces() {
  orderInfo.value.order_status = "已审核";
  const data: any = await useHttp(
    "/WmsOutOrder/G168UptOutOrder",
    "put",
    orderInfo.value
  );
  orderCode.value = orderInfo.value.out_order_num;
  await getDateDetail();
  detailList.value = detailList.value.map((item: any) => {
    item.detail_status = "已审核";
    return item;
  });
  await useHttp("/WmsOutOrder/G172UptOutDetial", "put", detailList.value);
  getDate();
  getDateDetail();
  auditDialog.value = false;
}

//清单明细对象
let detailInfo = ref<any>("");
let tabArr: any = [];
//打开清单明细添加弹框
function showAddDetail() {
  tabArr = [];
  addDetailDialog.value = true;
  selected.value = [];
  getInventoryData();
}
async function addDetailSucces() {
  selected.value.forEach((item: any) => {
    tabArr.push({
      out_order: orderCode.value,
      container_code: item.container_id,
      place_code: item.place_code,
      sku_code: item.sku,
      sku_name: item.sku_desc,
      sku_spec: item.sku_spec,
      batch_lot: item.lot,
      sku_qty: item.qty,
      detail_status: "新建",
      flag_done: "N",
    });
  });
  const data: any = await useHttp(
    "/WmsOutOrder/G171AddOutDetial",
    "post",
    tabArr
  );
  getDateDetail();
  addDetailDialog.value = false;
}
//清单明细修改
function showEditDetailDialog(item: any) {
  detailInfo.value = { ...item };
  editDetailDialog.value = true;
}
function editDetailSucces() {
  editDetailDialog.value = false;
}
//清单明细删除
function showDelDetailDialog(item: any) {
  detailInfo.value = { ...item };
  deleteDetailDialog.value = true;
}
async function delDetailSucces() {
  const data: any = await useHttp(
    "/WmsOutOrder/G173DelOutDetial",
    "delete",
    undefined,
    {
      id: detailInfo.value.id,
    }
  );
  getDateDetail();
  deleteDetailDialog.value = false;
}
//库存
let inventoryList = ref<any[]>([]);
//多选
let selected = ref<any[]>([]);
//获取数据库数据
async function getInventoryData() {
  const data: any = await useHttp("/wmsInventory/G115condition_query", "post", {
    container_id: searchCtnId.value,
    place_code: searchPlaceId.value,
    warehouse_code: "",
    area_code: "",
    sku: searchMaterial.value,
    sku_desc: searchMaterialDesc.value,
    indateTo: "",
    indateFrom: "",
    lot: searchLot.value,
    reserved01: "",
    sku_spec: searchSkuSpec.value,
  });
  inventoryList.value = data.data.map((item: any) => {
    item.time_in = item.time_in.substring(0, 10);
    item.time_out = item.time_out.substring(0, 10);
    item.time_first_in = item.time_first_in.substring(0, 10);
    return item;
  });
}
//查询
function filter1() {
  getInventoryData();
}
//重置查询
function resetFilter1() {
  searchCtnId.value = "";
  searchPlaceId.value = "";
  searchMaterial.value = "";
  searchMaterialDesc.value = "";
  searchLot.value = "";
  searchSkuSpec.value = "";
  getInventoryData();
}
//打印
let selectRows = ref<any[]>([]);
function print() {
  printJS({
    printable: "printContent",
    type: "html",
    targetStyles: ["*"],
  });
  selectRows.value = [];
}
</script>
<template>
  <v-row class="ma-2">
    <!-- 出库单表头 -->
    <v-col cols="5">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">出库清单</v-toolbar>
        <v-row class="ma-1">
          <v-col cols="3">
            <v-text-field
              label="库区"
              v-model="searchArea"
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
              label="状态"
              v-model="searchStatus"
              :items="['新建', '已审核', '已出库']"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              label="出库类型"
              v-model="searchWType"
              :items="['生产领料', '项目发货', '其他']"
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
              >查询</v-btn
            >
            <v-btn
              color="red"
              class="mr-2 mt-2"
              size="default"
              @click="resetFilter"
              >重置查询</v-btn
            >
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="showAddDialog"
              >添加清单</v-btn
            >
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="print"
              >打印</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-data-table
              hover
              :items-per-page="10"
              :headers="orderHeaders"
              :items="orderList"
              v-model="selectRows"
              show-select
              return-object
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              height="610"
              no-data-text="没有找到符合的数据"
              @click:row="showDetail"
            >
              <template v-slot:item.action="{ item }">
                <v-icon
                  color="green"
                  size="small"
                  class="mr-3"
                  @click.stop="showAuditDialog(item.raw)"
                  v-if="item.raw.order_status === '新建'"
                >
                  fa-solid fa-eye
                </v-icon>
                <!-- 修改 -->
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="showEditDialog(item.raw)"
                >
                  fa-solid fa-pen
                </v-icon>
                <!-- 删除 -->
                <v-icon
                  color="red"
                  size="small"
                  @click.stop="showDelDialog(item.raw)"
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
          <!-- 打印页面 -->
          <v-col cols="12" v-show="false">
            <div id="printContent">
              <div
                v-for="(item, index) in selectRows"
                :key="index"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                "
              >
                <div>
                  <qrcode-vue
                    style="width: 70px; height: 70px"
                    :value="item.out_order_num"
                  ></qrcode-vue>
                </div>
                <div class="text-text-subtitle-1">
                  出库单号:{{ item.out_order_num }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- 出库单明细 -->
    <v-col cols="7">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6" v-if="orderCode"
          >出库清单【{{ orderCode }}】明细</v-toolbar
        >
        <v-toolbar class="text-h6 pl-6" v-else>出库清单明细</v-toolbar>

        <v-row class="ma-1">
          <v-col cols="3">
            <v-text-field
              label="库位"
              v-model="searchPlace"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="容器"
              v-model="searchContainer"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field
              label="物料编码"
              v-model="searchSkuCode"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="物料名称"
              v-model="searchSkuName"
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
              @click="filterDetail"
              >查询</v-btn
            >
            <v-btn
              color="red"
              class="mr-2 mt-2"
              size="default"
              @click="resetDetail"
              >重置查询</v-btn
            >
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="showAddDetail"
              v-if="orderCode && status === '新建'"
              >添加明细</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-data-table
              hover
              :items-per-page="10"
              :headers="detailHeaders"
              :items="detailList"
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              height="610"
              no-data-text="没有找到符合的数据"
            >
              <template v-slot:item.action="{ item }">
                <!-- 删除 -->
                <v-icon
                  color="red"
                  size="small"
                  @click="showDelDetailDialog(item.raw)"
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- 新增清单 -->
    <v-dialog v-model="addDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增清单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-select
                label="出库类型"
                v-model="orderInfo.out_order_type"
                :items="['生产领料', '项目发货', '其他']"
                clearable
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-select
                label="仓库"
                v-model="orderInfo.warehouse_code"
                :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="库区"
                v-model="orderInfo.area_code"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="addDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改清单 -->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改清单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-select
                label="出库类型"
                v-model="orderInfo.out_order_type"
                :items="['生产领料', '项目发货', '其他']"
                clearable
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-select
                label="仓库"
                v-model="orderInfo.warehouse_code"
                :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="库区"
                v-model="orderInfo.area_code"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="editDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除清单 -->
    <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除清单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要删除【{{ orderInfo.out_order_num }}】这一清单吗?
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="delSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 审核清单 -->
    <v-dialog v-model="auditDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 审核清单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="auditDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-select
                label="出库类型"
                readonly
                v-model="orderInfo.out_order_type"
                :items="['生产领料', '项目发货', '其他']"
                clearable
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-select
                label="仓库"
                readonly
                v-model="orderInfo.warehouse_code"
                :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="库区"
                readonly
                v-model="orderInfo.area_code"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="auditSucces()"
          >
            审核通过
          </v-btn>
          <v-btn color="grey" size="large" @click="auditDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 新增清单明细 -->
    <v-dialog v-model="addDetailDialog" min-width="1400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增清单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
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
                label="库存批次"
                v-model="searchLot"
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
                @click="filter1"
                >查询</v-btn
              >
              <v-btn
                color="red"
                class="mr-2 mt-2"
                size="default"
                @click="resetFilter1"
                >重置查询</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-data-table
                hover
                :items-per-page="10"
                :headers="headers"
                :items="inventoryList"
                v-model="selected"
                show-select
                return-object
                style="overflow-x: auto; white-space: nowrap"
                fixed-footer
                fixed-header
                height="610"
                no-data-text="没有找到符合的数据"
              ></v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addDetailSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="addDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改清单明细 -->
    <v-dialog v-model="editDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改清单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="容器号"
                v-model="detailInfo.container_code"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="库位"
                v-model="detailInfo.place_code"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="物料编码"
                v-model="detailInfo.sku_code"
                :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="物料名称"
                v-model="detailInfo.sku_name"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="物料规格"
                v-model="detailInfo.sku_spec"
                :items="[0, 1, 2, 3, 4]"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="批次号"
                v-model="detailInfo.batch_lot"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="物料数量"
                v-model="detailInfo.sku_qty"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="明细标记"
                v-model="detailInfo.flag_done"
                :items="['N', 'Y']"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editDetailSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="editDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除清单明细 -->
    <v-dialog v-model="deleteDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除清单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要删除这条清单明细吗?
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="delDetailSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
