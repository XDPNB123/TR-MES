<script setup lang="ts">
import printJS from "print-js";
import QrcodeVue from "qrcode.vue";
import JsBarcode from "jsbarcode";
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "装箱单制作",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "装箱单制作",
  // 该页面的描述
  description: "同日 MES 系统，装箱单制作",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，装箱单制作",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
let units = ref<string[]>([
  "PCS",
  "米",
  "毫米",
  "张",
  "KG",
  "瓶（通）",
  "盒（包）",
  "双（对）",
  "平方米",
  "卷",
  "台",
  "套",
  "件",
  "根",
  "个",
  "袋",
  "立方",
  "升",
  "支",
  "箱",
  "盒",
  "节",
  "把",
  "片",
  "公斤",
  "干公斤",
  "包",
  "本",
]);
// 页面缓存
definePageMeta({
  keepalive: false,
});
const router = useRouter();
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
//弹框
let addDialog = ref<boolean>(false);
let editDialog = ref<boolean>(false);
let deleteDialog = ref<boolean>(false);
let auditDialog = ref<boolean>(false);

let addDetailDialog = ref<boolean>(false);
let addDetailDialog2 = ref<boolean>(false);
let addDetailDialog3 = ref<boolean>(false);
let editDetailDialog = ref<boolean>(false);
let deleteDetailDialog = ref<boolean>(false);
//装箱单头
let orderHeaders = ref<any[]>([
  {
    title: "装箱单号",
    align: "center",
    key: "packcode",
    sortable: false,
    filterable: true,
  },
  {
    title: "项目号",
    align: "center",
    key: "projectcode",
    sortable: false,
    filterable: true,
  },

  {
    title: "日期",
    align: "center",
    key: "date",
    sortable: false,
    filterable: true,
  },
  {
    title: "堆",
    align: "center",
    key: "num",
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
//装箱单明细头
let detailHeaders = ref<any[]>([
  {
    title: "产品",
    align: "center",
    key: "production",
    sortable: false,
    filterable: true,
  },
  {
    title: "规格",
    align: "center",
    key: "model",
    sortable: false,
    filterable: true,
  },

  {
    title: "数量",
    align: "center",
    key: "qty",
    sortable: false,
    filterable: true,
  },
  {
    title: "备注",
    align: "center",
    key: "rmks",
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
//自制件表头
let homemadeHeaders = ref<any[]>([
  { title: "零件名", align: "center", key: "partName" },
  { title: "总装物料名", align: "start", key: "totalName" },
  { title: "物料编码", align: "start", key: "resultCode" },
  { title: "项目号", align: "start", key: "projectCode" },
  { title: "项目类型", align: "start", key: "projectType" },
  { title: "单位名", align: "start", key: "unitName" },
]);
//外购件表头
let materialHeaders = ref<any[]>([
  {
    title: "项目号",
    align: "center",
    key: "project_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "设备名称",
    align: "center",
    key: "devicename",
    sortable: false,
    filterable: true,
  },
  {
    title: "设备编号",
    align: "center",
    key: "devicecode",
    sortable: false,
    filterable: true,
  },
  {
    title: "存货编码",
    align: "center",
    key: "inventory_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "名称",
    align: "center",
    key: "product_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "规格/图号",
    align: "center",
    key: "specification_drawing_number",
    sortable: false,
    filterable: true,
  },
  {
    title: "总数量",
    align: "center",
    key: "total_quantity",
    sortable: false,
    filterable: true,
  },
  {
    title: "单位",
    align: "center",
    key: "unit",
    sortable: false,
    filterable: true,
  },
]);
//存储装箱单数据
let orderList = ref<any[]>([]);
//存储明细单数据
let detailList = ref<any[]>([]);
// 装箱单搜索条件
let searchPackCode = ref<any>("");
let searchProjectCode = ref<any>("");
let searchProduction = ref<any>("");
let searchRmks = ref<any>("");
//装箱单搜素
async function filter() {
  const data: any = await useHttp(
    "/PackingList/M94GetPackingList",
    "get",
    undefined,
    {
      packcode: searchPackCode.value,
      projectcode: searchProjectCode.value,
      production: searchProduction.value,
      rmks: searchRmks.value,
    }
  );
  orderList.value = data.data
    .map((item: any) => {
      item.date = item.date.substring(0, 10);
      return item;
    })
    .sort((a: any, b: any) => {
      if (a.id > b.id) {
        return -1;
      }
      return 1;
    });
  packCode.value = orderList.value[0].packcode;
  projectCode.value = orderList.value[0].projectcode;
}
//装箱单重置搜索
function resetFilter() {
  searchPackCode.value = "";
  searchProjectCode.value = "";
  searchProduction.value = "";
  searchRmks.value = "";
  getOrderData();
}
// 装箱单明细搜素
let searchProduction2 = ref<any>("");
let searchRmks2 = ref<any>("");
//明细搜索
function filterDetail() {
  getDetailData();
}
//重置明细搜索
function resetDetail() {
  searchProduction2.value = "";
  searchRmks2.value = "";
  getDetailData();
}
//获取数据库的装箱单数据
async function getOrderData() {
  const data: any = await useHttp(
    "/PackingList/M94GetPackingList",
    "get",
    undefined,
    {
      packcode: searchPackCode.value,
      projectcode: searchProjectCode.value,
      production: searchProduction.value,
      rmks: searchRmks.value,
      startdate: new Date().toISOString().substring(0, 10),
      enddate: new Date().toISOString().substring(0, 10),
    }
  );
  orderList.value = data.data
    .map((item: any) => {
      item.date = item.date.substring(0, 10);
      return item;
    })
    .sort((a: any, b: any) => {
      if (a.id > b.id) {
        return -1;
      }
      return 1;
    });
  packCode.value = orderList.value[0].packcode;
  projectCode.value = orderList.value[0].projectcode;
}
//获取数据库的装箱单明细数据
async function getDetailData() {
  const data: any = await useHttp(
    "/PackingList/M97GetPackingListDetial",
    "get",
    undefined,
    {
      production: searchProduction2.value,
      rmks: searchRmks2.value,
      packcode: packCode.value,
    }
  );
  detailList.value = data.data.sort((a: any, b: any) => {
    if (a.no > b.no) {
      return -1;
    }
    return 1;
  });
}
let packCode = ref<any>("");
let projectCode = ref<any>("");
// 点击显示装箱单明细
function showDetail(item: any, obj: any) {
  packCode.value = obj.item.raw.packcode;
  projectCode.value = obj.item.raw.projectcode;
}
watch(packCode, function () {
  getDetailData();
});
//页面加载获取数据
onMounted(() => {
  getOrderData();
});
//装箱单对象
let orderInfo = ref<any>(null);
//新增装箱单
function showAddDialog() {
  orderInfo.value = {
    projectcode: "",
    date: new Date().toISOString().substring(0, 10),
    packer: "",
    lwh: "",
    package_material: "",
  };

  addDialog.value = true;
}
//确认新增
async function addSucces() {
  const data: any = await useHttp(
    "/PackingList/M95AddPackingList",
    "post",
    orderInfo.value
  );
  if (data.code === 200) {
    getOrderData();
    addDialog.value = false;
    setSnackbar("green", "新增成功");
  } else {
    setSnackbar("black", "新增失败");
  }
}

//装箱单的修改
function showEditDialog(item: any) {
  orderInfo.value = { ...item };
  editDialog.value = true;
}
async function editSucces() {
  const data: any = await useHttp("/PackingList/M96UptPackingList", "put", [
    orderInfo.value,
  ]);
  if (data.code === 200) {
    getOrderData();
    editDialog.value = false;
    setSnackbar("green", "修改成功");
  } else {
    setSnackbar("black", "修改失败");
  }
}
//装箱单的删除
function showDelDialog(item: any) {
  orderInfo.value = { ...item };
  deleteDialog.value = true;
}
async function delSucces() {
  const data: any = await useHttp(
    "/PackingList/M97DelPackingList",
    "delete",
    undefined,
    { id: orderInfo.value.id, packcode: orderInfo.value.packcode }
  );
  if (data.code === 200) {
    getOrderData();
    deleteDialog.value = false;
    setSnackbar("green", "删除成功");
  } else {
    setSnackbar("black", "删除失败");
  }
}

//装箱单明细的制作
let productHeaders = ref<any[]>([]);
let productTableData = ref<any>([]);
let selected = ref<any[]>([]);
//产品信息的搜索

let searchName = ref<any>("");
let searchMac = ref<any>("");
let searchTotalName = ref<any>("");
//外购件搜素
let searchProduct = ref<any>("");
let searchTypeName = ref<any>("");
watch(searchTypeName, async function () {
  if (searchTypeName.value === "自制件") {
    selected.value = [];
    await productList();
  } else {
    selected.value = [];
    await getMaterialData();
  }
});

//新增装箱单明细信息
function showAddDetail() {
  selected.value = [];
  searchTypeName.value = "自制件";
  productList();
  addDetailDialog.value = true;
}
//根据项目号和零件名查询产料
async function productList() {
  try {
    const data: any = await useHttp(
      "/MaterialForm/M53GetHomemadeForm",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 10000,
        SortType: 1,
        SortedBy: "_id",
        projectCode: projectCode.value,
        partName: searchName.value,
        totalCode: searchMac.value,
        totalName: searchTotalName.value,
      }
    );
    if (!data.data.totalCount) {
      productTableData.value = [];
      productHeaders.value = homemadeHeaders.value; //给数据表头赋值相对应的值
    } else {
      productTableData.value = data.data.pageList; //赋值
      productHeaders.value = homemadeHeaders.value; //给数据表头赋值相对应的值
    }
  } catch (error) {
    console.log(error);
  }
}

let searchAll = ref<any>("");

//获取到标准外购件的数据
async function getMaterialData() {
  const outData: any = await useHttp(
    "/PackingList/M102GetProcuredOrder",
    "get",
    undefined,
    {
      project_code: projectCode.value,
      devicename: searchName.value,
      devicecode: searchMac.value,
      query_parameter: searchAll.value,
    }
  );

  productTableData.value = outData.data;
  productHeaders.value = materialHeaders.value;
}

//产品搜素
function filterNameProduct() {
  if (searchTypeName.value === "自制件") {
    productList();
  }
  if (searchTypeName.value === "标准外购件") {
    getMaterialData();
  }
}
//重置产品搜索
function resetFilterNameProduct() {
  if (searchTypeName.value === "自制件") {
    searchName.value = "";
    searchMac.value = "";
    searchTotalName.value = "";
    productList();
  } else {
    searchName.value = "";
    searchMac.value = "";
    searchAll.value = "";
    getMaterialData();
  }
}
let addDetailList = ref<any[]>([]);
function saveMcodeProduct() {
  if (selected.value.length === 0) {
    return setSnackbar("black", "请选择产品，创建装箱单明细");
  }
  addDetailList.value = [];
  if (searchTypeName.value === "自制件") {
    selected.value.forEach((item: any) => {
      addDetailList.value.push({
        packcode: packCode.value,
        production: item.partName,
        model: "",
        qty: "",
        unit: item.unitName,
        rmks: item.totalCode + "-" + item.partCode,
      });
    });
  } else {
    selected.value.forEach((item: any) => {
      addDetailList.value.push({
        packcode: packCode.value,
        production: item.product_name,
        model: item.specification_drawing_number,
        qty: item.total_quantity,
        unit: item.unit,
        rmks: item.inventory_code,
      });
    });
  }
  addDetailDialog2.value = true;
}
//在当前索引加一的位置复制一行当前数据加入数组

function addRow(item: any, index: number) {
  addDetailList.value.splice(index, 0, { ...item });
}
function minusRow(item: any, index: number) {
  addDetailList.value.splice(index, 1);
}
async function addDetailSucces() {
  const data: any = await useHttp(
    "/PackingList/M98AddPackingListDetial",
    "post",
    addDetailList.value
  );
  if (data.code === 200) {
    addDetailDialog.value = false;
    addDetailDialog2.value = false;
    getDetailData();
    setSnackbar("green", "新增成功");
  } else {
    setSnackbar("black", "新增失败");
  }
}
//装箱单明细对象
let detailInfo = ref<any>(null);
// 删除装箱单的明细
function showDelDetailDialog(item: any) {
  detailInfo.value = { ...item };
  deleteDetailDialog.value = true;
}
//确认删除
async function delDetailSucces() {
  const data: any = await useHttp(
    "/PackingList/M100DelPackingListDetial",
    "delete",
    undefined,
    {
      id: [detailInfo.value.no],
    }
  );
  if (data.code === 200) {
    deleteDetailDialog.value = false;
    getDetailData();
    setSnackbar("green", "删除成功");
  } else {
    setSnackbar("black", "删除失败");
  }
}

//打印
let selectRows = ref<any[]>([]);
let printList = ref<any[]>([]);
//选择的装箱单编号
let code = ref<any[]>([]);
//选择的所有的装箱单明细数据
let detailData = ref<any[]>([]);
async function print() {
  await getPrintData();
  console.log(printList.value);
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
//获取选择的所有装箱单明细
async function fetchDetailData() {
  for (const item of code.value) {
    const data: any = await useHttp(
      "/PackingList/M97GetPackingListDetial",
      "get",
      undefined,
      {
        production: "",
        rmks: "",
        packcode: item,
      }
    );
    detailData.value.push(...data.data);
  }
}
//获取打印数据
async function getPrintData() {
  //第一步 拿到选择的所有的装箱单号
  await selectRows.value.forEach((item: any) => {
    code.value.push(item.packcode);
  });

  //第二步 获取选择的所有装箱单的明细数据
  await fetchDetailData();

  //第三步,将装箱单数据和装箱单数据的明细组合成树形结构
  printList.value = await buildTree(selectRows.value, detailData.value);
}
// 将俩个数组整合到一起成一个树形结构的方法
function buildTree(parents: any, children: any) {
  let tree: any = [];
  parents.forEach((parent: any) => {
    let node = { ...parent, children: [] };
    children.forEach((child: any) => {
      if (child.packcode === parent.packcode) {
        node.children.push(child);
      }
    });
    tree.push(node);
  });
  return tree;
}

function focusInput(inputRef: any) {
  const inputElement = document.querySelector(
    `[ref=${inputRef}]`
  ) as HTMLElement;
  if (inputElement) {
    inputElement.focus();
  }
}
</script>
<template>
  <v-row class="ma-2">
    <!-- 出库单表头 -->
    <v-col cols="5">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">装箱单</v-toolbar>
        <v-row class="ma-1">
          <v-col cols="3">
            <v-text-field
              label="装箱单号"
              v-model="searchPackCode"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="项目号"
              v-model="searchProjectCode"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="产品名称"
              v-model="searchProduction"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="产品备注"
              v-model="searchRmks"
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
              >新增装箱单</v-btn
            >
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="print"
              >打印装箱单</v-btn
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
                <!-- 修改 -->
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="showEditDialog(item.raw)"
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
                          :value="item.packcode"
                        ></qrcode-vue>
                      </div>

                      <div style="font-weight: black; white-space: nowrap">
                        装箱单:{{ item.packcode }}
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
                        Project No/项目号：<input
                          type="text"
                          :value="item.projectcode"
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
                          No:
                          <input
                            :value="item.num"
                            type="text"
                            style="
                              border: none;
                              border-bottom: 1px solid black;
                              outline: none;
                              text-align: center;
                            "
                          />
                        </div>
                      </div>
                      <!-- 第一列第三行 -->
                      <div style="white-space: nowrap" class="mt-4">
                        包装材料：
                        <span style="padding-right: 80px"
                          >Case(木箱) <input type="checkbox"
                        /></span>
                        <span>Crate(板条箱) <input type="checkbox" /></span>
                      </div>
                    </div>

                    <!-- 第二列 -->
                    <div class="d-flex flex-column">
                      <!-- 第二列第一行 -->
                      <div style="white-space: nowrap">
                        Date/日期：<input
                          type="text"
                          :value="item.date"
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
                        L/W/H(长/宽/高)/其他：<input
                          type="text"
                          :value="item.lwh"
                          style="
                            border: none;
                            border-bottom: 1px solid black;
                            outline: none;
                            text-align: center;
                          "
                        />
                      </div>
                      <!-- 第二列第三行 -->
                      <div style="white-space: nowrap" class="mt-4">
                        <span style="padding-right: 80px"
                          >Carton(纸箱）<input type="checkbox"
                        /></span>
                        <span>其他 <input type="checkbox" /></span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">装箱明细：</div>
                  <!-- 表格 -->
                  <div style="white-space: nowrap" class="mt-4">
                    <table border="1" style="border-collapse: collapse">
                      <tr>
                        <th style="text-align: center; height: 44px">No</th>
                        <th style="text-align: center; height: 44px">
                          Production
                        </th>
                        <th style="text-align: center; height: 44px">
                          Model No/Item No
                        </th>
                        <th style="text-align: center; height: 44px">QTY</th>
                        <th style="text-align: center; height: 44px">Rmks</th>
                      </tr>
                      <tr>
                        <th style="text-align: center; height: 44px">序号</th>
                        <th style="text-align: center; height: 44px">产品</th>
                        <th style="text-align: center; height: 44px">
                          产品规格及型号
                        </th>
                        <th style="text-align: center; height: 44px">数量</th>
                        <th style="text-align: center; height: 44px">备注</th>
                      </tr>

                      <tr
                        v-for="(item_, index_) in item.children.slice(
                          (page - 1) * 10,
                          page * 10
                        )"
                        :key="index_"
                      >
                        <td
                          style="text-align: center; height: 44px; width: 80px"
                        >
                          {{ index_ + (page - 1) * 10 + 1 }}
                        </td>
                        <td
                          style="
                            text-align: center;
                            height: 44px;
                            width: 230px;
                            max-width: 230px;
                            word-wrap: break-word;
                            white-space: normal;
                          "
                        >
                          {{ item_.production }}
                        </td>
                        <td
                          style="
                            text-align: center;
                            height: 44px;
                            width: 180px;
                            max-width: 180px;
                            word-wrap: break-word;
                            white-space: normal;
                          "
                        >
                          {{ item_.model.length > 15 ? "/" : item_.model }}
                        </td>
                        <td
                          style="text-align: center; height: 44px; width: 80px"
                        >
                          {{ item_.qty }}{{ item_.unit }}
                        </td>
                        <td
                          style="text-align: center; height: 44px; width: 230px"
                        >
                          {{ item_.rmks }}
                        </td>
                      </tr>
                      <!-- 空白行 -->
                      <tr
                        v-for="(item__, index__) in 10 -
                        item.children.slice((page - 1) * 10, page * 10).length"
                        :key="index__"
                      >
                        <td
                          style="text-align: center; height: 44px; width: 80px"
                        ></td>
                        <td
                          style="text-align: center; height: 44px; width: 230px"
                        ></td>

                        <td
                          style="text-align: center; height: 44px; width: 180px"
                        ></td>
                        <td
                          style="text-align: center; height: 44px; width: 80px"
                        ></td>
                        <td
                          style="text-align: center; height: 44px; width: 230px"
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
                        :value="item.packer"
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
                        :value="item.date"
                        style="
                          border: none;
                          border-bottom: 1px solid black;
                          outline: none;
                        "
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-end">
                    {{ item.num }}-({{ page }}/{{
                      Math.ceil(item.children.length / 10)
                    }})
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
        <v-toolbar class="text-h6 pl-6" v-if="packCode"
          >装箱单【{{ packCode }}】明细</v-toolbar
        >
        <v-toolbar class="text-h6 pl-6" v-else>装箱单明细</v-toolbar>

        <v-row class="ma-1">
          <v-col cols="6">
            <v-text-field
              label="产品"
              v-model="searchProduction2"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="编码"
              v-model="searchRmks2"
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
              v-show="packCode"
              @click="showAddDetail"
              v-permission="`${router.currentRoute.value.fullPath}->addDetail`"
              >新增明细</v-btn
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
    <!-- 新增装箱单 -->
    <v-dialog v-model="addDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增装箱单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="项目号"
                v-model="orderInfo.projectcode"
                clearable
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="日期"
                v-model="orderInfo.date"
                type="date"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="装箱员"
                v-model="orderInfo.packer"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="包装材料"
                v-model="orderInfo.package_material"
                :items="['木箱', '板条箱', '纸箱', '其他']"
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
    <!-- 修改装箱单 -->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改装箱 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="项目号"
                v-model="orderInfo.projectcode"
                clearable
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="日期"
                v-model="orderInfo.date"
                type="date"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="装箱员"
                v-model="orderInfo.packer"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="包装材料"
                v-model="orderInfo.package_material"
                :items="['木箱', '板条箱', '纸箱', '其他']"
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
    <!-- 删除装箱单 -->
    <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除装箱单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要删除【{{ orderInfo.packcode }}】这装箱单吗?
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

    <!-- 新增装箱单明细 -->
    <v-dialog v-model="addDetailDialog" min-width="1800px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 可以批量选择产品，批量增加产出料 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-row class="ma-2">
            <v-col cols="3">
              <v-text-field
                label="零件名查询"
                variant="outlined"
                density="compact"
                v-model="searchName"
                hide-details
                @keydown.enter="filterNameProduct()"
              ></v-text-field>
            </v-col>

            <v-col cols="3">
              <v-text-field
                label="项目号查询"
                variant="outlined"
                density="compact"
                v-model="projectCode"
                hide-details
                @keydown.enter="filterNameProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="3" v-show="searchTypeName === '自制件'">
              <v-text-field
                label="总装物料名"
                variant="outlined"
                density="compact"
                v-model="searchTotalName"
                hide-details
                @keydown.enter="filterNameProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="设备号"
                variant="outlined"
                density="compact"
                v-model="searchMac"
                hide-details
                @keydown.enter="filterNameProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="3" v-show="searchTypeName !== '自制件'">
              <v-text-field
                label="外购件信息"
                variant="outlined"
                density="compact"
                v-model="searchAll"
                hide-details
                @keydown.enter="filterNameProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                variant="outlined"
                density="compact"
                label="当前产品类别"
                :items="['自制件', '标准外购件']"
                v-model="searchTypeName"
              >
              </v-select>
            </v-col>
            <v-col cols="8">
              <v-btn
                color="blue-darken-2"
                class="mr-2"
                size="large"
                @click="filterNameProduct()"
                >查询</v-btn
              >
              <v-btn
                color="red"
                class="mr-2"
                size="large"
                @click="resetFilterNameProduct()"
              >
                重置查询
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <v-data-table
                hover
                :items-per-page="10"
                v-model="selected"
                return-object
                show-select
                :headers="productHeaders"
                :items="productTableData"
                style="overflow-x: auto; white-space: nowrap"
                fixed-footer
                fixed-header
                height="400"
                no-data-text="没有找到符合的数据"
              >
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
        <div class="d-flex justify-end mr-6 my-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="saveMcodeProduct()"
          >
            确定
          </v-btn>
          <v-btn color="grey" size="large" @click="addDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 检查新建的明细信息 -->
    <v-dialog v-model="addDetailDialog2" min-width="1400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 检查新建的明细信息 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDetailDialog2 = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row v-for="(item, index) in addDetailList">
            <v-col cols="2">
              <v-text-field
                :ref="`input${index}1`"
                label="产品"
                variant="outlined"
                density="compact"
                autofocus
                v-model="item.production"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :ref="`input${index}2`"
                label="规格"
                variant="outlined"
                density="compact"
                autofocus
                v-model="item.model"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :ref="`input${index}3`"
                label="数量"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.qty"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :ref="`input${index}4`"
                label="单位"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.unit"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :ref="`input${index}5`"
                label="备注"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.rmks"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <div class="d-flex">
                <v-icon
                  class="align-self-center"
                  color="blue"
                  @click="addRow(item, index)"
                >
                  fa-solid fa-plus
                </v-icon>
                <v-icon
                  class="align-self-center ml-5"
                  color="blue"
                  @click="minusRow(item, index)"
                >
                  fa-solid fa-minus
                </v-icon>
              </div>
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
          <v-btn color="grey" size="large" @click="addDetailDialog2 = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 删除装箱单明细 -->
    <v-dialog v-model="deleteDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除装箱单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要删除这条装箱单明细吗?
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
