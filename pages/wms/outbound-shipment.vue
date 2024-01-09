<script setup lang="ts">
import printJS from "print-js";
import QrcodeVue from "qrcode.vue";
import JsBarcode from "jsbarcode";
useSeoMeta({
  // 该页面的标题
  title: "出库单制作",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "出库单制作",
  // 该页面的描述
  description: "同日 MES 系统，出库单制作",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，出库单制作",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
const router = useRouter();
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
    if (!item.reserved10) {
      item.reserved10 = null;
    }
    return item;
  });
  orderCode.value = orderList.value[0].out_order_num;
  status.value = orderList.value[0].order_status;
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
});
//清单对象
let orderInfo = ref<any>(null);
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
  if (data.code === 200) {
    setSnackbar("green", "新增成功");
    getDate();
    addDialog.value = false;
  } else {
    setSnackbar("black", "新增失败");
  }
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
  if (data.code === 200) {
    setSnackbar("green", "修改成功");
    getDate();
    editDialog.value = false;
  } else {
    setSnackbar("black", "修改失败");
  }
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
  if (data.code === 200) {
    setSnackbar("green", "删除成功");
    getDate();
    getDateDetail();
    deleteDialog.value = false;
  } else {
    setSnackbar("black", "删除失败");
  }
}
//清单审核
function showAuditDialog(item: any) {
  orderInfo.value = { ...item };
  auditDialog.value = true;
}
async function auditSucces() {
  orderInfo.value.order_status = "已审核";
  orderInfo.value.reserved10 = new Date().toISOString();
  const data: any = await useHttp(
    "/WmsOutOrder/G168UptOutOrder",
    "put",
    orderInfo.value
  );
  orderCode.value = orderInfo.value.out_order_num;
  await getDateDetail();
  detailList.value = detailList.value.map((item: any) => {
    item.detail_status = "已审核";
    item.reserved08 = new Date().toISOString();
    return item;
  });
  await useHttp("/WmsOutOrder/G172UptOutDetial", "put", detailList.value);
  if (data.code === 200) {
    setSnackbar("green", "审核通过");
    getDate();
    getDateDetail();
    auditDialog.value = false;
  } else {
    setSnackbar("black", "审核失败,可能是网络原因");
  }
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
      reserved09: item.uom,
    });
  });
  const data: any = await useHttp(
    "/WmsOutOrder/G171AddOutDetial",
    "post",
    tabArr
  );

  if (data.code === 200) {
    setSnackbar("green", "新增成功");
    selected.value = selected.value.map((item: any) => {
      item.flag_occupy = "Y";
      item.qty = item.qty.toString();
      return item;
    });

    await useHttp("/wmsInventory/G113update", "post", selected.value);

    getDateDetail();
    addDetailDialog.value = false;
  } else {
    setSnackbar("black", "新增失败");
  }
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
    flag_occupy: "N",
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
let printList = ref<any[]>([]);
//选择的清单编号
let code = ref<any[]>([]);
//选择的所有的清单明细数据
let detailData = ref<any[]>([]);
// 打印
async function print() {
  await getPrintData();
  //第四步,打印
  printJS({
    printable: "printContent",
    type: "html",
    targetStyles: ["*"],
  });
  //第五步,清空所有选择的数据
  selectRows.value = [];
  printList.value = [];
  code.value = [];
  detailData.value = [];
}
//获取选择的所有清单明细
async function fetchDetailData() {
  for (const item of code.value) {
    const data: any = await useHttp(
      "/WmsOutOrder/G170GetOutDetialList",
      "get",
      undefined,
      {
        container_code: "",
        place_code: "",
        sku_code: "",
        sku_name: "",
        out_order_num: item,
      }
    );
    detailData.value.push(...data.data);
  }
}
//获取打印数据
async function getPrintData() {
  //第一步 拿到选择的所有的清单单号
  await selectRows.value.forEach((item: any) => {
    code.value.push(item.out_order_num);
  });
  //第二步 获取选择的所有清单的明细数据
  await fetchDetailData();

  //第三步,将清单数据和清单数据的明细组合成树形结构
  printList.value = await buildTree(selectRows.value, detailData.value);
}
// 将俩个数组整合到一起成一个树形结构的方法
function buildTree(parents: any, children: any) {
  let tree: any = [];
  parents.forEach((parent: any) => {
    let node = { ...parent, children: [] };
    children.forEach((child: any) => {
      if (child.out_order === parent.out_order_num) {
        node.children.push(child);
      }
    });
    tree.push(node);
  });
  return tree;
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
              v-permission="`${router.currentRoute.value.fullPath}->addOrder`"
            >
              添加清单</v-btn
            >
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="print"
              >打印清单</v-btn
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
                  v-permission="
                    `${router.currentRoute.value.fullPath}->auditOrder`
                  "
                >
                  fa-solid fa-eye
                </v-icon>
                <!-- 修改 -->
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="showEditDialog(item.raw)"
                  v-if="item.raw.order_status === '新建'"
                  v-permission="
                    `${router.currentRoute.value.fullPath}->updateOrder`
                  "
                >
                  fa-solid fa-pen
                </v-icon>
                <!-- 删除 -->
                <v-icon
                  color="red"
                  size="small"
                  @click.stop="showDelDialog(item.raw)"
                  v-if="item.raw.order_status === '新建'"
                  v-permission="
                    `${router.currentRoute.value.fullPath}->deleteOrder`
                  "
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
          <!-- 打印页面 -->
          <v-col cols="12" v-show="false">
            <div id="printContent">
              <div v-for="(item, index) in printList" :key="index">
                <div
                  style="
                    width: 794px;
                    height: 1123px;
                    page-break-before: always;
                    margin-top: 20px;
                  "
                  class="d-flex flex-column"
                  v-for="page in Math.ceil(item.children.length / 10)"
                  :key="`page-${page}`"
                >
                  <div class="d-flex justify-space-between">
                    <!-- 第一列-->
                    <div>
                      <div class="font-weight-bold">
                        昆山同日工业自动化有限公司
                      </div>
                      <div
                        class="font-weight-black"
                        style="white-space: nowrap"
                      >
                        Tungray Industrial Automation(KunShan)Co.,Ltd
                      </div>
                      <div class="text-subtitle-2">
                        Http://www.tungray.com.cn
                      </div>
                      <div class="text-subtitle-2">
                        E-mail:tungray@tungray.com.cn
                      </div>
                    </div>
                    <!-- 第二列 -->
                    <div class="d-flex flex-column text-h6">
                      <div>地址：江苏昆山淀山</div>
                      <div>湖镇丁家浜路3号</div>
                      <div>电话：0512-36829026</div>
                    </div>
                  </div>
                  <!-- 出库 -->
                  <div class="d-flex justify-space-between">
                    <div
                      class="mt-2 align-self-center"
                      style="border-top: 10px solid black; width: 43%"
                    ></div>
                    <div
                      class="d-flex flex-column justify-center align-self-center"
                      style="align-self: center"
                    >
                      <div style="align-self: center">
                        <qrcode-vue
                          style="width: 60px; height: 60px"
                          :value="item.out_order_num"
                        ></qrcode-vue>
                      </div>

                      <div style="font-weight: black; white-space: nowrap">
                        出库清单:{{ item.out_order_num }}
                      </div>
                    </div>
                    <div
                      class="mt-2 align-self-center"
                      style="border-top: 10px solid black; width: 44%"
                    ></div>
                  </div>
                  <!-- 其他内容 -->
                  <div class="d-flex justify-space-between">
                    <!-- 第一列 -->
                    <div class="d-flex flex-column">
                      <!-- 第一列第一行 -->
                      <div style="white-space: nowrap">
                        出库类型：<input
                          type="text"
                          :value="item.out_order_type"
                          style="
                            border: none;
                            border-bottom: 1px solid black;
                            outline: none;
                            text-align: center;
                          "
                        />
                      </div>
                      <!-- 第一列第二行 -->
                      <div class="d-flex justify-space-between mt-4">
                        <div style="white-space: nowrap">
                          仓库:<input
                            type="text"
                            :value="item.warehouse_code"
                            style="
                              border: none;
                              border-bottom: 1px solid black;
                              outline: none;
                              text-align: center;
                            "
                          />
                        </div>
                        <div style="white-space: nowrap">
                          库区<input
                            type="text"
                            :value="item.area_code"
                            style="
                              border: none;
                              border-bottom: 1px solid black;
                              outline: none;
                              text-align: center;
                            "
                          />
                        </div>
                      </div>
                    </div>

                    <!-- 第二列 -->
                    <div class="d-flex flex-column">
                      <!-- 第二列第一行 -->
                      <div style="white-space: nowrap">
                        制单日期：<input
                          type="text"
                          :value="item.order_date"
                          style="
                            border: none;
                            border-bottom: 1px solid black;
                            outline: none;
                            text-align: center;
                          "
                        />
                      </div>
                      <!-- 第二列第二行 -->
                      <div style="white-space: nowrap" class="mt-4">
                        制单人：<input
                          type="text"
                          :value="item.order_maker"
                          style="
                            border: none;
                            border-bottom: 1px solid black;
                            outline: none;
                            text-align: center;
                          "
                        />
                      </div>
                      <!-- 第二列第三行 -->
                    </div>
                  </div>
                  <div class="mt-4">清单明细：</div>
                  <!-- 表格 -->
                  <div style="white-space: nowrap" class="mt-4">
                    <table border="1" style="border-collapse: collapse">
                      <tr>
                        <th style="text-align: center; height: 30px">库位</th>
                        <th style="text-align: center; height: 30px">容器号</th>
                        <th style="text-align: center; height: 30px">批次</th>
                        <th style="text-align: center; height: 30px">数量</th>
                        <th style="text-align: center; height: 30px">
                          物料名称
                        </th>
                        <th style="text-align: center; height: 30px">
                          物料规格
                        </th>
                        <th style="text-align: center; height: 30px">
                          物料编码
                        </th>
                      </tr>

                      <tr
                        v-for="(item_, index_) in item.children.slice(
                          (page - 1) * 10,
                          page * 10
                        )"
                        :key="index_"
                      >
                        <td
                          style="text-align: center; height: 55px; width: 125px"
                        >
                          {{ item_.place_code }}
                        </td>
                        <td
                          style="text-align: center; height: 55px; width: 85px"
                        >
                          {{ item_.container_code }}
                        </td>

                        <td
                          style="text-align: center; height: 55px; width: 105px"
                        >
                          {{ item_.batch_lot }}
                        </td>
                        <td
                          style="text-align: center; height: 55px; width: 85px"
                        >
                          {{ item_.sku_qty }}
                        </td>
                        <td
                          style="
                            text-align: center;
                            height: 55px;
                            max-width: 140px;
                            word-wrap: break-word;
                            white-space: normal;
                          "
                        >
                          {{ item_.sku_name }}
                        </td>

                        <td
                          style="
                            text-align: center;
                            height: 55px;
                            max-width: 140px;
                            word-wrap: break-word;
                            white-space: normal;
                          "
                        >
                          {{ item_.sku_spec }}
                        </td>
                        <td
                          style="text-align: center; height: 55px; width: 140px"
                        >
                          <qrcode-vue
                            style="width: 50px; height: 50px"
                            :value="item_.sku_code"
                          ></qrcode-vue>
                        </td>
                      </tr>
                      <!--  -->
                      <tr
                        v-for="(item__, index__) in 10 -
                        item.children.slice((page - 1) * 10, page * 10).length"
                        :key="index__"
                      >
                        <td
                          style="text-align: center; height: 55px; width: 120px"
                        ></td>
                        <td
                          style="text-align: center; height: 55px; width: 80px"
                        ></td>

                        <td
                          style="text-align: center; height: 55px; width: 100px"
                        ></td>
                        <td
                          style="text-align: center; height: 55px; width: 80px"
                        ></td>
                        <td
                          style="text-align: center; height: 55px; width: 140px"
                        ></td>

                        <td
                          style="text-align: center; height: 55px; width: 140px"
                        ></td>
                        <td
                          style="text-align: center; height: 55px; width: 140px"
                        ></td>
                      </tr>
                    </table>
                  </div>
                  <div class="mt-4">Your faithfuly:</div>
                  <div
                    class="font-weight-black mt-4"
                    style="white-space: nowrap"
                  >
                    Tungray Industrial Automation(KunShan)Co.,Ltd
                  </div>
                  <div class="mt-4">供应商：昆山同日工业自动化有限公司</div>
                  <div class="d-flex justify-space-around mt-4">
                    <div class="d-flex" style="white-space: nowrap">
                      出库员：<input
                        type="text"
                        style="
                          border: none;
                          border-bottom: 1px solid black;
                          outline: none;
                        "
                      />
                    </div>
                    <div class="d-flex" style="white-space: nowrap">
                      审核时间：<input
                        type="text"
                        :value="item.reserved10"
                        style="
                          border: none;
                          border-bottom: 1px solid black;
                          outline: none;
                        "
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-end mt-5">
                    {{ page }}/{{ Math.ceil(item.children.length / 10) }}
                  </div>
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
              v-permission="`${router.currentRoute.value.fullPath}->addDetail`"
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
                  v-if="item.raw.detail_status === '新建'"
                  v-permission="
                    `${router.currentRoute.value.fullPath}->deleteDetail`
                  "
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
            <v-col cols="12">
              <v-text-field
                label="货主"
                v-model="orderInfo.belong_customer"
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
            <v-col cols="12">
              <v-text-field
                label="货主"
                v-model="orderInfo.belong_customer"
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
  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>
