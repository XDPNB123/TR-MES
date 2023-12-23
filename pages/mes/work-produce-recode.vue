<script setup lang="ts">
//tabArr和tabArr1的作用，tabArr1全程存储拖拽的数据，tabArr作为中间值，在代码里面有很多使用，因此他的值变化的很快，tabArr1的值是全程都是存储拖拽的工单任务的。
import printJS from "print-js";
import QrcodeVue from "qrcode.vue";
import JsBarcode from "jsbarcode";
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "工单排产",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工单排产",
  // 该页面的描述
  description: "同日 MES 系统，工单排产",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，工单排产",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});

// 页面缓存
definePageMeta({
  keepalive: false,
});
//工作中心类型
let workCenterType = ref<any[]>(["钣金", "机加工", "装配", "其他"]);
//工单类型
let workType = ref<any[]>([
  "机加",
  "钣金",
  "电器装配",
  "模组装配",
  "总装",
  "其他",
]);
// 正在选中的 tab 页
let showingTab = ref<any>(null);
let detailName = ref<any>("");
//多选
let selected = ref<any[]>([]);
//通过改变选择的对象的工单编号来更改工单工序数据
watch(selected, () => {
  detailName.value = selected.value.join(",");
  getWorkProduce();
});
let onDisabled = ref<boolean>(false);
//存储已审核未排产工单
let workOrderList = ref<any[]>([]);
//存储工单类型
let workOrderType = ref<any>("机加");
watch(workOrderType, function () {
  getWorkOrder();
  if (workOrderType.value === "机加") {
    searchType.value = "机加工";
  } else if (workOrderType.value === "钣金") {
    searchType.value = "钣金";
  } else if (workOrderType.value === "其他") {
    searchType.value = "其他";
  } else {
    searchType.value = "装配";
  }
});
//获取工单数据
async function getWorkOrder() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M01GetWorkOrderList",
      "get",
      undefined,
      {
        status: "已审核待排产",
        workorder_type: workOrderType.value,
        PageIndex: 1,
        PageSize: 100000,
        SortType: 0,
        SortedBy: "id",
      }
    );
    workOrderList.value = data.data.pageList.map((item: any) => {
      item.planned_completion_time = item.planned_completion_time.substring(
        0,
        10
      );
      return item;
    });
  } catch (error) {
    console.log(error);
  }
}

//存储工单工序数据
let workDetailList = ref<any[]>([]);
//未派工单的对象
let workDetailInfo = ref<any>(null);
//修改弹框的的
let editDialog = ref<boolean>(false);
//打印页面
let printDialog = ref<boolean>(false);
//根据工单编号来查询到工单工序数据
async function getWorkProduce() {
  try {
    if (!detailName.value) {
      return (workDetailList.value = []);
    }
    const data: any = await useHttp(
      "/ProductionRecode/M21ProductionRecodeList",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 1000000,
        SortType: 1,
        SortedBy: "id",
        workorder_hid: detailName.value,
      }
    );

    workDetailList.value = data.data.pageList
      .map((item: any) => {
        item.planned_completion_time = item.planned_completion_time.substring(
          0,
          10
        );
        item.assignment_date = item.assignment_date.substring(0, 10);
        return item;
      })
      .filter(
        (_item: any) =>
          _item.work_center_id === null || _item.work_center_id === ""
      )
      .sort((a: any, b: any) => {
        if (a.procedure_order_id < b.procedure_order_id) {
          return -1;
        }
        if (a.procedure_order_id > b.procedure_order_id) {
          return 1;
        }
        return 0;
      });
  } catch (error) {
    console.log(error);
  }
}

//打开修改未派工单的时间的弹框
function showUpDateWork(item: any) {
  workDetailInfo.value = { ...item };
  editDialog.value = true;
}
//确认修改这个对象
async function editDetail() {
  await useHttp("/ProductionRecode/M23UpdateProductionRecode", "put", [
    workDetailInfo.value,
  ]);
  editDialog.value = false;
  setSnackbar(
    "green",
    workDetailInfo.value.material_name +
      workDetailInfo.value.procedure_name +
      "日期修改成功"
  );
  getWorkProduce();
}

//存储拖拽到工作中心的数据
let tabArr = ref<any[]>([]);
let tabArr1 = ref<any[]>([]);

//将工序数据拖拽到工作中心
function onDragEnd(event: any, item: any) {
  // 获取鼠标的位置
  const x = event.clientX;
  const y = event.clientY;

  // 获取鼠标所在位置的元素
  let element: any = document.elementFromPoint(x, y);

  // 获取离该元素最近的 card 元素
  let cardElement = element.closest(".v-card");

  // 如果没有拖到工作中心容器内，则拖动无效
  if (!cardElement || cardElement.children.length !== 8) return;

  // 获取 card 元素的所有子元素
  const cardChildren = cardElement.children;

  item.work_center_id = cardChildren[5].innerText.substring(3);

  workCenterId.value = cardChildren[5].innerText.substring(3);
  workCenterName.value = cardChildren[2].innerText;

  item.assignment_date = new Date().toISOString().split("T")[0];
  workDetailList.value.splice(workDetailList.value.indexOf(item), 1);

  tabArr.value.push(item);
  tabArr1.value.push(item);

  getCenterProduce();
}

//存储工作中心的集合
let workCenterList = ref<any[]>([]);

//搜素
let searchType = ref<string>("机加工");

//通过更改searchType的值来筛选工作中心
watch(searchType, function () {
  getWorkCenterList();
});

//获取工作中心数据
async function getWorkCenterList() {
  const data = await useHttp(
    "/WorkCenter/M62WorkCenterList",
    "get",
    undefined,
    {
      centertype: searchType.value,
    }
  );
  workCenterList.value = data.data;
}

onMounted(() => {
  getWorkOrder();
  getWorkCenterList();
});

//用显示来工作中心中任务的数据
let tempTabArr = ref<any[]>([]);
//对工作中心的工单工序数据进行排序
watch(tempTabArr, () => {
  tempTabArr.value.sort((a, b) => {
    if (a.procedure_order_id < b.procedure_order_id) {
      return -1;
    }
    if (a.procedure_order_id > b.procedure_order_id) {
      return 1;
    }
    return 0;
  });
});

//存储工作中心编号
let workCenterId = ref("");
let workCenterName = ref("");

//点击工作中心查看工作中心的任务
function showCenterDetail(item: any) {
  workCenterId.value = item.work_center_id;
  workCenterName.value = item.work_center_name;
  getCenterProduce();
}
//根据工作中心编号来查找工单工序数据
async function getCenterProduce() {
  const data: any = await useHttp(
    "/ProductionRecode/M21ProductionRecodeList",
    "get",
    undefined,
    {
      PageIndex: 1,
      PageSize: 10000,
      SortType: 0,
      SortedBy: "id",
      work_center_id: workCenterId.value,
      status: "已审核待排产,已排产待执行,已执行在生产",
    }
  );
  tabArr.value = tabArr1.value;
  tabArr.value = [...tabArr.value, ...data.data.pageList];
  tempTabArr.value = tabArr.value
    .filter(
      (_item: any) =>
        (_item.work_center_id !== "" || _item.work_center_id !== null) &&
        _item.work_center_id === workCenterId.value &&
        _item.status !== "明细行已完成"
    )
    .map((item: any) => {
      item.planned_completion_time = item.planned_completion_time.substring(
        0,
        10
      );
      return item;
    });
}

// 二维码实例
const qrCodeIns = ref<any>(null);
//是否打印的复选框
let checkbox = ref<boolean>(true);
let dataCode = ref<any[]>([]);
//确定保存
async function updateCenterId() {
  if (!tabArr1.value.length) {
    return setSnackbar("black", "您没有拖拽工单工序到对应的工作中心当中");
  }
  tabArr1.value.map((item: any) => (item.status = "已排产待执行"));

  //添加工作中心编号
  const data: any = await useHttp(
    "/ProductionRecode/M63PutProductionRecodeCreateDOId",
    "put",
    tabArr1.value
  );
  tabArr1.value = data.data.map((item: any) => {
    item.planned_completion_time = item.planned_completion_time.substring(
      0,
      10
    );
    item.defaul_outsource = item.defaul_outsource =
      item.defaul_outsource === "Y" ? "是" : "否";
    return item;
  });
  dataCode.value = [];
  tabArr1.value.map((item: any) =>
    dataCode.value.push({
      project: item.project_code,
      mcode: item.material_name,
      produce: item.procedure_description,
      produce_order: item.procedure_order_id,
      date: item.planned_completion_time,
      number: item.planned_quantity,
      unit: item.unit,
      value: item.dispatch_order,
      centerName: item.work_center_name,
      outsource: item.defaul_outsource,
      code: "88.216.1/PGD23110100005",
    })
  );
  //排序
  dataCode.value.sort((a: any, b: any) => {
    // 只关心名称是否相等
    if (a.mcode < b.mcode) {
      return -1;
    }
    if (a.mcode > b.mcode) {
      return 1;
    }

    return a.produce_order - b.produce_order;
  });
  // 是否打印
  if (checkbox.value) {
    nextTick(() => {
      qrCodeIns.value.printQrCode();
    });
  }
  tabArr1.value = [];
  await getWorkProduce();
  let filteredSelected = selected.value.filter(
    (selItem: any) =>
      !workDetailList.value.some(
        (workItem) => workItem.workorder_hid === selItem
      )
  );

  //当这个工单编号的工单工序的内容为空的时候，selected选择的工单编号也应该去除
  selected.value = selected.value.filter(
    (selItem: any) => !filteredSelected.some((workItem) => workItem === selItem)
  );
  let overWorkOrder = filteredSelected.join(",");
  const workOrderDate = filteredSelected.map((item: any) => {
    // 找到对应的工单
    const workOrder = workOrderList.value.find(
      (_item: any) => _item.workorder_hid === item
    );
    // 如果找到了工单，更新它的状态并返回
    if (workOrder) {
      return { ...workOrder, status: "已排产生产中" };
    }
    // 如果没有找到工单，返回null或者其他默认值
    return null;
  });

  //修改当前工单的状态;
  await useHttp(
    "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
    "put",
    workOrderDate
  );

  getWorkOrder();
  getWorkCenterList();

  if (overWorkOrder) {
    setSnackbar(
      "green",
      "工单编号为" + overWorkOrder + "的工单工序数据排产完成"
    );
  } else {
    setSnackbar("green", "您操作的工单工序数据已排产");
  }
}

//取消添加工作中心
function cancel() {
  if (!tabArr1.value.length) {
    return;
  }
  tabArr1.value = [];
  tabArr.value = [];
  getWorkProduce();
}

//通过监听tabArr1的内容来更改工作中心详情的内容，有值的时候，左边的工单就无法继续选择了
watch(
  tabArr1,
  function () {
    if (tabArr1.value.length) {
      onDisabled.value = true;
    } else {
      onDisabled.value = false;
    }
    getCenterProduce();
  },
  { deep: true }
);

//删除工作中心的任务
let deleteDialog = ref<boolean>(false);
let workCenterInFo = ref<any>(null);
//打开删除框
function showDeleteCenter(item: any) {
  workCenterInFo.value = item;
  deleteDialog.value = true;
}
//确认删除
async function deleteCenter() {
  //在当前工作中心中删除这一项任务
  tempTabArr.value.splice(tempTabArr.value.indexOf(workCenterInFo.value), 1);
  tabArr.value.splice(tabArr.value.indexOf(workCenterInFo.value), 1);
  tabArr1.value.splice(tabArr1.value.indexOf(workCenterInFo.value), 1);
  //修改工单工序的工作中心编号
  workCenterInFo.value.work_center_id = null;
  workCenterInFo.value.status = "已审核待排产";
  workCenterInFo.value.dispatch_order = null;
  //修改后的数据，通过接口修改数据库中内容
  await useHttp("/ProductionRecode/M23UpdateProductionRecode", "put", [
    workCenterInFo.value,
  ]);
  //判断在这个工作中心删除的这个数据的工单编号的工单的状态是什么
  //拿到当前工单工序的工单编号
  const workHid = workCenterInFo.value.workorder_hid;
  //拿到这个工单编号的工单数据
  const data: any = await useHttp(
    "/MesWorkOrder/M01GetWorkOrderList",
    "get",
    undefined,
    {
      workorder_hid: workHid,
      PageIndex: 1,
      PageSize: 10,
      SortedBy: "id",
      SortType: 0,
    }
  );
  const workOrderInFo = data.data.pageList[0];

  //如果工单状态是"已排产生产中"，调用接口更改为"已审核待排产"。
  if (workOrderInFo.status === "已排产生产中") {
    workOrderInFo.status = "已审核待排产";
    await useHttp("/MesWorkOrder/M03PartiallyUpdateWorkOrder", "put", [
      workOrderInFo,
    ]);
    getWorkOrder();
  } else {
    //判断当前有无选择工单数据（selected）
    if (selected.value.length) {
      //当前选择的有工单编号
      //判断当前删除的这个数据的工单编号是否属于当前选择的这些工单编号
      if (selected.value.includes(workHid)) {
        workDetailList.value.push(workCenterInFo.value);
      }
    } else {
      //当前没有选择数据（selected这个数组为空）
    }
  }
  setSnackbar(
    "green",
    "你成功从工作中心" +
      workCenterName.value +
      "撤销工单编号为" +
      workHid +
      "的这项任务"
  );
  deleteDialog.value = false;
  getWorkCenterList();
}

//日期规则
const dateRule = ref<any>([
  (v: any) =>
    /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/.test(
      v
    ) || "日期格式如“2023-10-01”",
]);
//表头数据
let headers = ref<any[]>([
  {
    title: "进度",
    key: "reported_quantity",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "派工单号",
    key: "dispatch_order",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料",
    key: "material_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工序顺序",
    key: "procedure_order_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心",
    key: "work_center_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否委外",
    key: "defaul_outsource",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工序描述",
    key: "procedure_description",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "分配日期",
    key: "assignment_date",
    align: "center",
    sortable: false,
    filterable: true,
  },
]);
//选择的数据
let selectedRows = ref<any[]>([]);
//搜索的数据
let searchName = ref<any>(null);
let searchDO = ref<any>(null);
//产能视图的数据
let deliverList = ref<any[]>([]);
async function getDeliverList() {
  const data: any = await useHttp(
    "/ProductionRecode/M21ProductionRecodeList",
    "get",
    undefined,
    {
      material_name: searchName.value,
      dispatch_order: searchDO.value,
      PageIndex: 1,
      PageSize: 10000,
      SortType: 1,
      SortedBy: "dispatch_order",
      status: "已排产待执行,已执行在生产",
    }
  );

  deliverList.value = data.data.pageList
    .filter(
      (item: any) => item.dispatch_order !== null && item.dispatch_order !== ""
    )
    .map((_item: any) => {
      _item.reported_quantity =
        _item.reported_quantity > _item.planned_quantity
          ? "100%"
          : Math.round(
              (_item.reported_quantity / _item.planned_quantity) * 100
            ) + "%";
      _item.planned_completion_time = _item.planned_completion_time.substring(
        0,
        10
      );
      _item.assignment_date = _item.assignment_date.substring(0, 10);
      _item.defaul_outsource = _item.defaul_outsource === "Y" ? "是" : "否";
      return _item;
    });
}
//搜索
function searchList() {
  getDeliverList();
}
//重置搜索
function resetSearch() {
  (searchName.value = ""), (searchDO.value = "");
  getDeliverList();
}
//打印派工单
function dyDispatchOrder() {
  if (!selectedRows.value.length) {
    return setSnackbar("black", "请您选择需要打印的派工单");
  }
  selectedRows.value.map((item: any) =>
    dataCode.value.push({
      project: item.project_code,
      mcode: item.material_name,
      produce: item.procedure_description,
      produce_order: item.procedure_order_id,
      date: item.planned_completion_time,
      number: item.planned_quantity,
      unit: item.unit,
      value: item.dispatch_order,
      centerName: item.work_center_name,
      outsource: item.defaul_outsource,
      code: "88.216.1/PGD2311010005",
    })
  );
  nextTick(() => {
    qrCodeIns.value.printQrCode();
  });
}
//打印明细
let workDetail = ref<any[]>([]);
//搜索数据
let searchMcode = ref<string>("");
let searchMdescription = ref<string>("");
let searchWorkId = ref<string>("");
//获取工单明细编号以及派工单
async function getWorkDetail() {
  const data = await useHttp(
    "/MesWorkOrderDetail/M85GetWorkOrderDetails",
    "get",
    undefined,
    {
      status: "已分配生产中",
      workorder_did: searchWorkId.value,
      mcode: searchMcode.value,
      mdescription: searchMdescription.value,
    }
  );
  workDetail.value = data.data.map((item: any) => {
    item.estimated_delivery_date = item.estimated_delivery_date.substring(
      0,
      10
    );
    if (Array.isArray(item.children)) {
      item.children = item.children.map((item_: any) => {
        item_.planned_completion_time = item_.planned_completion_time.substring(
          0,
          10
        );
        return item_;
      });
    }
    return item;
  });
}
//搜索
function searchWork() {
  getWorkDetail();
}
//重置搜索
function resetSearchWork() {
  searchMcode.value = "";
  searchWorkId.value = "";
  searchMdescription.value = "";
  getWorkDetail();
}
let selectedRow = ref<any[]>([]);

//打印
async function openPrint() {
  await JsBarcode(".barcode", "Short barcode", {
    width: 1,
    height: 30,
    displayValue: false,
  }).init();

  printJS({
    printable: "printContent",
    type: "html",
    targetStyles: ["*"],
  });
  selectedRow.value = [];
}
</script>

<template>
  <v-row no-gutters style="height: calc(100vh - 84px)">
    <!-- v-col 默认站整个 row 高度 -->
    <v-col cols="1" class="py-3 pl-3 pr-2">
      <!-- h-100 表示占 col 的整个内容区高度 -->
      <v-card class="h-100 rounded-lg elevation-2">
        <v-toolbar density="compact">
          <v-toolbar-title class="text-center ml-0 text-blue font-weight-bold"
            >页面</v-toolbar-title
          >
        </v-toolbar>
        <v-tabs color="blue" direction="vertical" v-model="showingTab">
          <v-tab value="未派工单"> 未派工单 </v-tab>
          <v-tab value="补打工单" @click="getDeliverList"> 补打工单 </v-tab>
          <v-tab value="打印明细" @click="getWorkDetail"> 打印明细 </v-tab>
        </v-tabs>
      </v-card>
    </v-col>

    <v-col cols="11" class="py-3 pr-3">
      <v-window v-model="showingTab">
        <v-window-item value="未派工单">
          <v-row no-gutters>
            <v-col cols="3">
              <v-card class="rounded-lg elevation-2 ml-1">
                <v-toolbar density="compact">
                  <v-toolbar-title
                    class="text-center ml-0 text-blue font-weight-bold"
                    >未排产工单</v-toolbar-title
                  >
                </v-toolbar>
                <div
                  style="height: calc(100vh - 158px)"
                  class="overflow-y-auto"
                >
                  <v-select
                    variant="solo"
                    density="compact"
                    hide-details
                    prefix="工单类型："
                    v-model="workOrderType"
                    :items="workType"
                  ></v-select>
                  <v-list
                    density="compact"
                    :lines="false"
                    class="ma-2 elevation-2 rounded-lg d-flex align-center"
                    v-for="(item, index) in workOrderList"
                    :key="index"
                    v-if="workOrderList.length"
                  >
                    <v-checkbox
                      style="max-width: 30px"
                      density="compact"
                      hide-details
                      color="blue"
                      class="ml-3"
                      v-model="selected"
                      :value="item.workorder_hid"
                      :disabled="onDisabled"
                    >
                    </v-checkbox>

                    <div>
                      <v-list-item>
                        <template v-slot:default>
                          <div class="text-body-2">
                            工单编号：
                            <span class="text-grey font-weight-medium">
                              {{ item.workorder_hid }}
                            </span>
                          </div>
                        </template>
                      </v-list-item>

                      <v-list-item>
                        <template v-slot:default>
                          <div class="text-body-2">
                            产品描述：
                            <span class="text-grey font-weight-medium">
                              {{ item.product_description }}
                            </span>
                          </div>
                        </template>
                      </v-list-item>

                      <v-list-item>
                        <template v-slot:default>
                          <div class="text-body-2">
                            产品编码：
                            <span class="text-grey font-weight-medium">
                              {{ item.product_id }}
                            </span>
                          </div>
                        </template>
                      </v-list-item>

                      <v-list-item>
                        <template v-slot:default>
                          <div class="text-body-2">
                            计划完成日期：
                            <span class="text-grey font-weight-medium">
                              {{ item.planned_completion_time }}
                            </span>
                          </div>
                        </template>
                      </v-list-item>
                    </div>
                  </v-list>
                  <div class="text-center text-h6 my-3 text-grey" v-else>
                    当前没有已审核未排产的工单
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="9" class="px-3">
              <v-card class="mb-3 elevation-2 rounded-lg">
                <v-toolbar density="compact">
                  <v-toolbar-title
                    v-if="detailName"
                    class="text-blue font-weight-bold"
                    >【{{ detailName }}】未派工单</v-toolbar-title
                  >
                  <v-toolbar-title v-else class="text-blue font-weight-bold"
                    >未派工单</v-toolbar-title
                  >
                </v-toolbar>

                <!-- cols="10" 确定了宽度，此处的 w-100 百分比就生效了 -->
                <div class="overflow-x-auto w-100" style="white-space: nowrap">
                  <v-list
                    class="mx-2 mt-3 mb-1 elevation-2 rounded-lg bg-light-blue-lighten-5"
                    style="display: inline-block; cursor: grab"
                    :lines="false"
                    density="compact"
                    draggable="true"
                    @dragend="onDragEnd($event, element)"
                    v-for="(element, index) in workDetailList"
                    :key="index"
                    v-if="workDetailList.length"
                  >
                    <div style="position: relative">
                      <v-btn
                        v-show="element.status !== '已扫描在执行'"
                        icon="fa-solid fa-pen"
                        variant="plain"
                        size="x-small"
                        style="
                          position: absolute;
                          right: 5px;
                          top: -3px;
                          z-index: 1000;
                        "
                        @click="showUpDateWork(element)"
                      >
                      </v-btn>
                    </div>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序顺序：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_order_id }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          产出料：
                          <span class="text-grey font-weight-medium">
                            {{ element.material_name }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序描述：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_description }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          是否委外：
                          <span class="text-grey font-weight-medium">
                            {{ element.defaul_outsource }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          数量：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_quantity }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          交付日期：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_completion_time }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>

                  <div v-else class="text-center text-h6 my-3 text-grey">
                    工单工序已分配完成
                  </div>
                </div>
              </v-card>

              <!-- 工作中心 -->
              <v-card class="mb-3 elevation-2 rounded-lg">
                <v-toolbar density="compact">
                  <v-toolbar-title class="text-blue font-weight-bold"
                    >工作中心</v-toolbar-title
                  >
                  <template v-slot:append>
                    <v-select
                      variant="solo"
                      density="compact"
                      hide-details
                      prefix="工作中心类型："
                      v-model="searchType"
                      :items="workCenterType"
                    ></v-select>
                  </template>
                </v-toolbar>

                <div class="overflow-x-auto w-100" style="white-space: nowrap">
                  <v-card
                    class="mx-2 mt-3 mb-1 elevation-2 rounded-lg px-6 py-3 bg-green-lighten-5"
                    style="display: inline-block"
                    @click="showCenterDetail(item)"
                    v-for="(item, index) in workCenterList"
                    :key="index"
                  >
                    <v-tooltip activator="parent" location="bottom">
                      <div>
                        设备：
                        {{
                          item.machineinfo
                            .reduce(
                              (oldItem: any, newItem: any, index: any) => {
                                return oldItem + "," + newItem.machine_name;
                              },
                              ""
                            )
                            .substring(1)
                        }}
                      </div>
                      <div>
                        工位：
                        {{
                          item.workstationinfo
                            .reduce(
                              (oldItem: any, newItem: any, index: any) => {
                                return oldItem + "," + newItem.station_name;
                              },
                              ""
                            )
                            .substring(1)
                        }}
                      </div>
                    </v-tooltip>
                    <div style="position: relative">
                      <v-badge
                        color="amber"
                        style="
                          position: absolute;
                          right: -12px;
                          top: 0px;
                          z-index: 1000;
                        "
                        :content="item.count"
                      >
                      </v-badge>
                    </div>
                    <div class="text-h6 mb-3 font-weight-medium">
                      {{ item.work_center_name }}
                    </div>

                    <div class="my-1 text-body-2 text-grey font-weight-medium">
                      类型：{{ item.type }}
                    </div>
                    <div class="my-1 text-body-2 text-grey font-weight-medium">
                      位置：{{ item.work_center_address }}
                    </div>
                    <div class="my-1 text-body-2 text-grey font-weight-medium">
                      编号：{{ item.work_center_id }}
                    </div>
                  </v-card>

                  <div
                    v-if="!workCenterList.length"
                    class="text-center text-h6 my-3 text-grey"
                  >
                    工作中心为空，可能是网络断开了
                  </div>
                </div>

                <v-row class="mt-3">
                  <v-col cols="8">
                    <div
                      v-if="tabArr1.length"
                      class="text-start text-h6 mt-3 ml-3 text-grey"
                    >
                      您已经进行了操作，如果想重新操作，请点击右边的取消按钮。
                      <span v-if="checkbox" class="text-start text-h6 text-red">
                        请设置打印页面为无边距属性,大小为新卷80x50
                      </span>
                    </div>
                  </v-col>

                  <v-col cols="4">
                    <div class="d-flex justify-end">
                      <div class="mr-6">
                        <v-checkbox
                          label="派单并打印"
                          v-model="checkbox"
                          color="red"
                        ></v-checkbox>
                      </div>
                      <div class="mt-3">
                        <v-btn
                          class="mr-2"
                          color="blue"
                          @click="updateCenterId()"
                        >
                          保存派工单
                        </v-btn>
                        <VQRCode :data="dataCode" ref="qrCodeIns"></VQRCode>
                        <v-btn class="mr-2" color="grey" @click="cancel">
                          取消
                        </v-btn>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>

              <!-- 工作详情 -->
              <v-card class="elevation-2 rounded-lg">
                <v-toolbar density="compact">
                  <v-toolbar-title
                    class="font-weight-bold text-blue"
                    v-if="workCenterName"
                    >【{{ workCenterName }}】工作中心详情【{{
                      tempTabArr.length
                    }}】</v-toolbar-title
                  >
                  <v-toolbar-title class="font-weight-bold text-blue" v-else
                    >工作中心详情</v-toolbar-title
                  >
                </v-toolbar>

                <div class="overflow-x-auto w-100" style="white-space: nowrap">
                  <v-list
                    class="mx-2 mt-3 mb-1 elevation-2 rounded-lg"
                    style="display: inline-block"
                    :lines="false"
                    density="compact"
                    v-for="(element, index) in tempTabArr"
                    :key="index"
                    :class="{
                      'bg-light-blue-lighten-5':
                        element.status === '已审核待排产',
                      '': element.status === '已排产待执行',
                      'bg-red-lighten-4': element.status === '已执行在生产',
                    }"
                  >
                    <div style="position: relative">
                      <v-btn
                        v-show="element.status !== '已执行在生产'"
                        icon="fa-solid fa-x"
                        variant="plain"
                        size="x-small"
                        style="
                          position: absolute;
                          right: 5px;
                          top: -3px;
                          z-index: 1000;
                        "
                        @click="showDeleteCenter(element)"
                      >
                      </v-btn>
                    </div>
                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序顺序：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_order_id }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序描述：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_description }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          是否委外：
                          <span class="text-grey font-weight-medium">
                            {{ element.defaul_outsource }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          产出料：
                          <span class="text-grey font-weight-medium">
                            {{ element.material_name }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          数量：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_quantity }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          交付日期：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_completion_time }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          当前状态：
                          <span class="text-grey font-weight-medium">
                            {{ element.status }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                  <div
                    v-show="!tempTabArr.length"
                    class="text-center text-h6 my-3 text-grey"
                  >
                    当前工作中心没有任务
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="补打工单">
          <v-card class="rounded-lg elevation-2 ml-1">
            <v-toolbar density="compact">
              <v-toolbar-title
                class="text-center ml-0 text-blue font-weight-bold"
                >补打工单</v-toolbar-title
              >
            </v-toolbar>
            <v-row class="ma-2">
              <v-col cols="6">
                <v-text-field
                  label="物料名称"
                  v-model="searchName"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  label="派工单号"
                  variant="outlined"
                  density="compact"
                  v-model="searchDO"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn
                  color="blue-darken-2"
                  class="mr-2"
                  size="large"
                  @click="searchList"
                  >查询</v-btn
                >
                <v-btn
                  color="red"
                  class="mr-2"
                  size="large"
                  @click="resetSearch"
                >
                  重置查询
                </v-btn>
                <v-btn
                  color="blue-darken-2"
                  class="mr-2"
                  size="large"
                  @click="dyDispatchOrder"
                  >打印派工单号</v-btn
                ></v-col
              >
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="deliverList"
                  hover
                  style="overflow-x: auto; white-space: nowrap"
                  fixed-footer
                  fixed-header
                  height="610"
                  no-data-text="没有找到符合的数据"
                  v-model="selectedRows"
                  return-object
                  show-select
                >
                  <template v-slot:item.id="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template v-slot:item.reported_quantity="{ item }">
                    <v-progress-circular
                      :model-value="item.raw.reported_quantity"
                      :size="45"
                      color="deep-orange-lighten-2"
                    >
                      {{ item.raw.reported_quantity }}
                    </v-progress-circular>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-window-item>
        <v-window-item value="打印明细">
          <v-card class="rounded-lg elevation-2 ml-1">
            <v-toolbar density="compact">
              <v-toolbar-title
                class="text-center ml-0 text-blue font-weight-bold"
                >打印明细</v-toolbar-title
              >
            </v-toolbar>
            <v-row class="ma-2">
              <v-col cols="4">
                <v-text-field
                  label="工单明细编号"
                  variant="outlined"
                  density="compact"
                  v-model="searchWorkId"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="图纸号"
                  v-model="searchMcode"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="产出料"
                  v-model="searchMdescription"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn
                  color="blue-darken-2"
                  class="mr-2"
                  size="large"
                  @click="searchWork"
                  >查询</v-btn
                >
                <v-btn
                  color="red"
                  class="mr-2"
                  size="large"
                  @click="resetSearchWork"
                >
                  重置查询
                </v-btn>
                <v-btn
                  color="blue-darken-2"
                  class="mr-2"
                  size="large"
                  @click="openPrint()"
                  >打印明细</v-btn
                >
              </v-col>

              <v-col cols="12">
                <v-card height="600px" class="overflow-y-auto">
                  <v-expansion-panels>
                    <v-expansion-panel
                      v-for="(element, index) in workDetail"
                      :key="index"
                    >
                      <div class="d-flex">
                        <v-checkbox
                          style="max-width: 30px"
                          density="compact"
                          hide-details
                          color="blue"
                          class="ml-3"
                          v-model="selectedRow"
                          :value="element"
                        >
                        </v-checkbox>
                        <v-expansion-panel-title>
                          <!-- 工单明细编号 -->
                          <div style="flex-basis: 15%">
                            工单明细编号：
                            {{ element.workorder_did }}
                          </div>
                          <!-- 产出料 -->
                          <div style="flex-basis: 20%">
                            产出料：{{ element.mdescription }}
                          </div>

                          <!-- 计划产出料数量 -->
                          <div style="flex-basis: 13%">
                            计划数量：
                            {{ element.planned_quantity }}
                          </div>
                          <!-- 计划交付日期 -->
                          <div style="flex-basis: 20%">
                            计划交付：
                            {{ element.estimated_delivery_date }}
                          </div>
                          <div>
                            图纸号：
                            {{ element.mcode }}
                          </div>
                        </v-expansion-panel-title>
                      </div>
                      <v-expansion-panel-text>
                        <v-list-item
                          v-for="(item_, index_) in element.children"
                          :key="index_"
                        >
                          <template v-slot:default>
                            <div class="d-flex align-center">
                              <div style="flex-basis: 15%">
                                派工单号：{{ item_.dispatch_order }}
                              </div>

                              <div style="flex-basis: 10%">
                                工序顺序：{{ item_.procedure_order_id }}
                              </div>
                              <div style="flex-basis: 22%">
                                计划日期：{{ item_.planned_completion_time }}
                              </div>
                              <div style="flex-basis: 22%">
                                工序：[{{ item_.procedure_description }}]
                              </div>
                              <div style="flex-basis: 10%">
                                委外：{{
                                  item_.defaul_outsource === "N" ? "否" : "是"
                                }}
                              </div>
                              <div style="flex-basis: 10%">
                                状态：{{ item_.status }}
                              </div>
                              <div style="flex-basis: 10%">
                                @{{ item_.work_center_name }}
                              </div>
                            </div>
                          </template>
                        </v-list-item>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-col>
              <!-- 打印页面 -->
              <v-col cols="12" v-show="false">
                <div id="printContent">
                  <div
                    v-for="(item, index) in selectedRow"
                    :key="index"
                    style="page-break-before: always"
                  >
                    <div class="d-flex">
                      <div style="flex-basis: 40%">
                        产出料：{{ item.mdescription }}
                      </div>
                      <div style="font-weight: bold">
                        料号/图纸号：{{ item.mcode }}
                      </div>
                    </div>
                    <div class="d-flex mt-3">
                      <div style="flex-basis: 35%">
                        工单明细编号：{{ item.workorder_did }}
                      </div>

                      <div style="flex-basis: 35%">
                        计划日期：{{ item.estimated_delivery_date }}
                      </div>
                      <div style="flex-basis: 15%; font-weight: bold">
                        数量：{{ item.planned_quantity }}{{ item.unit }}
                      </div>
                      <svg
                        class="barcode"
                        :jsbarcode-value="item.workorder_did"
                      ></svg>
                    </div>
                    <hr />
                    <!--派工单二维码页面  -->
                    <div v-for="(item_, index_) in item.children" :key="index_">
                      <div style="display: flex" class="mt-3">
                        <div
                          style="padding-right: 5px; flex-basis: 12%"
                          v-if="index_ % 2 === 0"
                        >
                          <qrcode-vue
                            style="width: 70px; height: 70px"
                            :value="item_.dispatch_order"
                          ></qrcode-vue>
                        </div>
                        <div
                          style="
                            font-family: 'SongTi';
                            flex-basis: 25%;
                            align-self: center;
                          "
                        >
                          派工单号：{{ item_.dispatch_order }}
                        </div>

                        <div
                          style="
                            font-family: 'SongTi';
                            flex-basis: 25%;
                            align-self: center;
                            font-weight: bold;
                          "
                        >
                          工序顺序：{{ item_.procedure_order_id }} [{{
                            item_.procedure_description
                          }}]
                        </div>

                        <div
                          style="
                            font-family: 'SongTi';
                            flex-basis: 15%;
                            align-self: center;
                          "
                        >
                          质检:
                          <span style="font-weight: bold">
                            {{
                              item_.required_inspection === "Y" ? "是" : "否"
                            }}
                          </span>
                        </div>
                        <div
                          style="
                            font-family: 'SongTi';
                            flex-basis: 20%;
                            align-self: center;
                          "
                        >
                          @{{ item_.work_center_name }}
                        </div>
                        <div
                          style="padding-right: 5px; flex-basis: 12%"
                          v-if="index_ % 2 !== 0"
                        >
                          <qrcode-vue
                            style="width: 70px; height: 70px"
                            :value="item_.dispatch_order"
                          ></qrcode-vue>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
  <!-- 删除工作中心中任务 -->
  <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title>删除工作中心任务 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="deleteDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4 text-center text-red text-h6">
        是否移除工作中心{{ workCenterName }}中的这项任务
      </v-card-text>
      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn color="blue" size="large" class="mr-2" @click="deleteCenter()">
          确认删除
        </v-btn>
        <v-btn color="grey" size="large" @click="deleteDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>

  <!-- 修改未派工单时间 -->
  <v-dialog v-model="editDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 修改未派工单时间 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-text-field
          v-model="workDetailInfo.planned_completion_time"
          :rules="dateRule"
          label="交付日期"
        ></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="editDetail()"
        >
          确认修改
        </v-btn>
        <v-btn color="grey" size="large" @click="editDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped></style>
