<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "生产工单",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "生产工单",
  // 该页面的描述
  description: "同日 MES 系统，生产工单",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，生产工单",
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
//单位
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
//工单表头的状态
let workStatus = ref([
  "新建未审核",
  "已审核待排产",
  "已排产生产中",
  "正常完工",
  "异常暂停",
  "异常取消",
  "强制关闭",
]);
//工单明细的状态
let workDetailStatus = ref([
  "新建待分配",
  "已分配生产中",
  "正常完工",
  "异常暂停",
  "异常取消",
  "强制关闭",
]);
//存储当前操作的工单编号
let detailName = ref("");
//存储当前工单数据的产品编号
let productName = ref("");
// 用于刷新视图的 key
let key = ref<number>(0);
//多选产品编号
let selectedRows = ref<any[]>([]);
//创建一个键值对数组，存储工单明细
let details = ref<any>({});
// 路由
const router = useRouter();
let selected = ref<any[]>([]);
// 工单新增、修改、删除对话框
let addDialog = ref(false);
let editDialog = ref(false);
let deleteDialog = ref(false);
let addDetailDialog = ref(false);
let deleteDetailDialog = ref(false);
let editDetailDialog = ref(false);
let productDialog = ref(false);
let auditDialog = ref(false);
let processDialog = ref(false);
let mcodeDialog = ref(false);
let deleteProduceDialog = ref(false);
// 工单搜索
let searchTicketNumber = ref<string>("");
let searchProjectNumber = ref<string>("");
let startDate = ref("");
let endDate = ref("");
let startDateDetail = ref("");
let endDateDetail = ref("");
let searchTicketStatus = ref<string>("");
let searchTicketType = ref("");
let searchOutputs = ref<string>("");
let searchProduct = ref<any>("");
let searchName = ref("");
// 正在操作的工单
let operatingTicket = ref<any>({
  workorder_type: "",
  planned_completion_time: "",
  unit: "",
  planned_quantity: "",
  product_id: "",
  product_description: "",
  start_date: "",
  finish_date: "",
  status: "",
});
//正在操作的工单明细
let operatingTicketDetail = ref<any>({
  mcode: "",
  estimated_delivery_date: "",
  blueprint_id: "",
  project_code: "",
  standard_time: "",
  actual_time: "",
  procedure: "",
  planned_quantity: "",
  reported_quantity: "",
  unit: "",
  workorder_hid: "",
  actual_delivery_date: "",
  status: "",
});
//工单表按照开始时间进行降序排序
// 展示的工单表格数据
let tableData = ref<any[]>([]);
// 工单表头
let tableHeaders = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工单号",
    key: "workorder_hid",
    align: "center",
    sortable: false,
    filterable: true,
  },

  {
    title: "工单类型",
    key: "workorder_type",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "计划数量",
    key: "planned_quantity",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "单位",
    key: "unit",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "产品描述",
    key: "product_description",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "开始日期",
    key: "start_date",
    align: "center",
    sortable: true,
    filterable: true,
  },
  {
    title: "完成日期",
    key: "finish_date",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "计划完成时间",
    key: "planned_completion_time",
    align: "center",
    sortable: false,
    filterable: true,
  },

  {
    title: "工单状态",
    key: "status",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);

//工单明细表头
let headers = ref<any[]>([
  {
    title: "序号",
    align: "center",
    key: "id",
    sortable: false,
    filterable: true,
  },
  {
    title: "产出料",
    align: "center",
    key: "mcode",
    sortable: false,
    filterable: true,
  },
  {
    title: "工序",
    align: "center",
    key: "procedure",
    sortable: false,
    filterable: true,
  },
  {
    title: "图纸号",
    align: "center",
    key: "blueprint_id",
    sortable: false,
    filterable: true,
  },
  {
    title: "BOM清单",
    align: "center",
    key: "bomdata",
    sortable: false,
    filterable: true,
  },
  {
    title: "项目号",
    align: "center",
    key: "project_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "预计交付日期",
    align: "center",
    key: "estimated_delivery_date",
    sortable: false,
    filterable: true,
  },
  {
    title: "实际交付日期",
    align: "center",
    key: "actual_delivery_date",
    sortable: false,
    filterable: true,
  },
  {
    title: "工单明细编号",
    align: "center",
    key: "workorder_did",
    sortable: false,
    filterable: true,
  },

  {
    title: "标准工时",
    align: "center",
    key: "standard_time",
    sortable: false,
    filterable: true,
  },
  {
    title: "实际工时",
    align: "center",
    key: "actual_time",
    sortable: false,
    filterable: true,
  },
  {
    title: "计划数量",
    align: "center",
    key: "planned_quantity",
    sortable: false,
    filterable: true,
  },
  {
    title: "实际报工数量",
    align: "center",
    key: "reported_quantity",
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
  {
    title: "状态",
    align: "center",
    key: "status",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: true,
  },
]);
//工单明细表格展示的数据
let tableDataDetail = ref<any[]>([]);

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
  { title: "型号描述", align: "start", key: "xhms" },
  { title: "规格描述", align: "center", key: "ggms" },
  { title: "物料编码", align: "start", key: "resultCode" },
  { title: "种类描述", align: "start", key: "middleName" },
  { title: "细类描述", align: "start", key: "smallName" },
  { title: "细类名", align: "start", key: "thinName" },
  { title: "单位名", align: "start", key: "unitName" },
]);

// 工单表格初始页
let tablePage = ref<number>(1);
// 工单表格每页条数
let tablePerPage = ref<number>(10);
//一共有多少行工单数据
let tableDataLength = ref<number>(0);

// 工单明细表格初始页
let tableDetailPage = ref<number>(1);
// 工单明细表格每页条数
let tableDetailPerPage = ref<number>(10);
//一共有多少工单明细行数据
let tableDataDetailLength = ref<number>(0);

// 产品表格初始页
let productTablePage = ref<number>(1);
// 产品表格每页条数
let productTablePerPage = ref<number>(10);
//一共有多少行产品数据
let productDataLength = ref<number>(0);

//工序模块
let chips = ref<any[]>([]); //存储常用工序
let droppedChips = ref<any[]>([]); //维护选择的工序
let draggedChip = ref(null);
let produceGroups = ref(); //常用工艺路线
//实现拖拽功能的方法
function dragStart(chip: any) {
  draggedChip.value = chip;
}
function dragEnd() {
  draggedChip.value = null;
}
function drop() {
  if (draggedChip.value) {
    droppedChips.value.push(draggedChip.value);
    chips.value = chips.value.filter((chip) => chip !== draggedChip.value);
  }
}
function removeChip(index: number) {
  const removedChip = droppedChips.value.splice(index, 1)[0];
  chips.value.push(removedChip);
}

//获取全部的工序数据
async function getProduce() {
  try {
    const data: any = await useHttp(
      "/MesWorkProcess/M09GetProcedureData",
      "get",
      undefined,
      {
        SortedBy: "id",
        PageIndex: 1,
        SortType: 1,
        procedure_name: "",
        procedure_id: "",
        PageSize: 100,
      }
    );
    chips.value = data.data.pageList.map((item: any) => item.procedure_name);
  } catch (error) {
    console.log(error);
  }
}
//获取常用工序流程
async function getUsedProduce() {
  try {
    const newData: any = await useHttp(
      "/MesWorkProcess/M47GetProcessBasisConfig",
      "get",
      undefined
    );

    produceGroups.value = newData.data;
  } catch (error) {
    console.log(error);
  }
}
//用来存储表格selected选择的的数据
let innerTableSelectData = ref<any[]>([]);
//用来存储产出料名称的字段，便于知道在维护哪一行数据
let mcodeName = ref();
// 发请求获取完整的选中的数据
// 判断工序是否一致
// 如果一致，则将选中的数据暂时保存
// 打开对话框，将选中数据的工序显示左边，其他工序过滤到右边
// 点击保存，将左侧的工序拼接后，赋值给每一个暂存的对象
// 将对象数组作为参数调用更新接口重新获取数据
//批量工序维护
async function batchWork() {
  try {
    //判断是否选择数据
    if (selected.value.length === 0) {
      return setSnackbar("black", "请选择需要工序维护的产料");
    }

    //获取到当前选择的数据
    innerTableSelectData.value = tableDataDetail.value.filter((item: any) =>
      selected.value.includes(item.id)
    );
    mcodeName.value = innerTableSelectData.value
      .map((item: any) => item.mcode)
      .join(",");
    //判断选择的数据他们的工序是否一致
    let isSameProcedure = innerTableSelectData.value.every(
      (item, index, array) => {
        return item.procedure === array[0].procedure;
      }
    );
    if (isSameProcedure) {
      // 所有选中的数据都有相同的工序属性
      await getProduce();
      //常用工序流程
      await getUsedProduce();
      //过滤出已选工序和未选工序
      if (
        innerTableSelectData.value[0] &&
        innerTableSelectData.value[0].procedure
      ) {
        const workorderHids =
          innerTableSelectData.value[0].procedure.split(",");
        droppedChips.value = chips.value.filter((chip) =>
          workorderHids.includes(chip)
        );
        chips.value = chips.value.filter(
          (chip) => !workorderHids.includes(chip)
        );
      }
    } else {
      selected.value = [];
      return setSnackbar(
        "black",
        "您选择的数据的初始工序属性并不一致，请检查后重新选择"
      );
    }
  } catch (error) {
    console.log(error);
  }
  processDialog.value = true;
}

//工序维护
async function showProcessDialog(item: any) {
  try {
    await getProduce();
    //常用工序流程
    await getUsedProduce();
    //将点击的哪行数据存到选择数据中
    innerTableSelectData.value.push(item);
    mcodeName.value = innerTableSelectData.value
      .map((item: any) => item.mcode)
      .join(",");
    //过滤出已选工序和未选工序
    if (
      innerTableSelectData.value[0] &&
      innerTableSelectData.value[0].procedure
    ) {
      const workorderHids = item.procedure.split(",");
      droppedChips.value = chips.value.filter((chip) =>
        workorderHids.includes(chip)
      );
      chips.value = chips.value.filter((chip) => !workorderHids.includes(chip));
    }
  } catch (error) {
    console.log(error);
  }
  processDialog.value = true;
}

//关闭\取消工序维护框，需要清空已选择的数据
function cancelProcess() {
  innerTableSelectData.value = [];
  droppedChips.value = [];
  processDialog.value = false;
}

//保存为常用工序路线
async function saveComUsedProduce() {
  try {
    let names = droppedChips.value.join(",");
    await useHttp("/MesWorkProcess/M48AddProcessBasis", "post", {
      ids: "1,2,3",
      names: names,
      describe: null,
    });
    setSnackbar("green", "保存成功");
    getUsedProduce();
  } catch (error) {
    console.log(error);
    setSnackbar("black", "保存失败");
  }
}

//删除时传第参数
let produceItem = ref();
function deleteProduce(item: any) {
  produceItem.value = item;
  deleteProduceDialog.value = true;
}

//删除常用工序路线
async function deleteComUsedProduce() {
  try {
    await useHttp(
      "/MesWorkProcess/M50DeleteProcessBasis",
      "delete",
      undefined,
      {
        config_code: produceItem.value.config_code,
      }
    );
    setSnackbar("red", "删除成功");
    deleteProduceDialog.value = false;
    getUsedProduce();
  } catch (error) {
    console.log(error);
  }
}
//保存工序
async function saveTicket() {
  try {
    if (droppedChips.value.length === 0) {
      return setSnackbar("black", "请你至少选择一个工序");
    }
    // 将选择的工序数组拼接成字符串
    innerTableSelectData.value.forEach((item) => {
      item.procedure = droppedChips.value.map((item) => item).join(",");
    });
    await useHttp(
      "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
      "put",
      innerTableSelectData.value
    );
    getWorkOrderDetail();
    setSnackbar("green", "保存成功");
  } catch (error) {
    console.log(error);
    setSnackbar("black", "保存失败");
  }
  processDialog.value = false;
  innerTableSelectData.value = [];
  droppedChips.value = [];
}

//点击常用工序流程
async function commonProduce(item: any) {
  let array = item.rsv2.split(",");
  droppedChips.value = array;
  await getProduce();
  chips.value = chips.value.filter((chip) => !array.includes(chip));
}

// 工单表头搜索过滤
async function filterTableData() {
  try {
    tablePage.value = 1;
    getWorkOrder();
  } catch (error) {
    console.log(error);
  }
}
// 工单表头重置搜索
function resetFilter() {
  searchTicketStatus.value = "";
  searchTicketNumber.value = "";
  searchTicketType.value = "";
  startDate.value = "";
  endDate.value = "";
  detailName.value = "";
  tablePage.value = 1;
  getWorkOrder();
}

//工单明细搜素
async function filterTableDataDetail() {
  try {
    tableDetailPage.value = 1;
    getWorkOrderDetail();
  } catch (error) {
    console.log(error);
  }
}
//重置工单明细的搜素
function resetFilterDetail() {
  searchOutputs.value = "";
  searchProjectNumber.value = "";
  startDateDetail.value = "";
  endDateDetail.value = "";
  tableDetailPage.value = 1;
  getWorkOrderDetail();
}
//页面加载时获取数据
onMounted(async () => {
  getWorkOrder();
  getWorkOrderDetail();
});
//存储工单数据的所有工单编号
let workorderId = ref<any[]>([]);
//获取工单数据
async function getWorkOrder() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M01GetWorkOrderList",
      "get",
      undefined,
      {
        PageIndex: tablePage.value,
        PageSize: productTablePerPage.value,
        SortType: 1,
        SortedBy: "id",
        workorder_hid: searchTicketNumber.value,
        status: searchTicketStatus.value,
        workorder_type: searchTicketType.value,
        start_date: startDate.value,
        end_date: endDate.value,
      }
    );
    tableData.value = formatDate(data.data.pageList);
    tableDataLength.value = data.data.totalCount;
    workorderId.value = data.data.pageList.map(
      (item: any) => item.workorder_hid
    );
  } catch (error) {
    setSnackbar("black", "获取数据失败");
    console.log(error);
  }
}
//点击下一页面时再次请求数据库数据
watch(tablePage, () => {
  getWorkOrder();
});

// 工单表格有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableDataLength.value / tablePerPage.value);
});
//将工单数据的日期进行截取，保留年月份
function formatDate(data: any) {
  try {
    data.forEach((item: any, index: number) => {
      if (item.start_date) {
        item.start_date = item.start_date.substring(0, 10);
      }
      if (item.finish_date) {
        item.finish_date = item.finish_date.substring(0, 10);
      }
      if (item.planned_completion_time) {
        item.planned_completion_time = item.planned_completion_time.substring(
          0,
          10
        );
      }
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

//获取工单明细数据
async function getWorkOrderDetail() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrderDetail/M05WorkOrderDetails",
      "get",
      undefined,
      {
        PageIndex: tableDetailPage.value,
        PageSize: tableDetailPerPage.value,
        SortType: 1,
        SortedBy: "id",
        workorder_hid: detailName.value,
        mcode: searchOutputs.value,
        project_code: searchProjectNumber.value,
        estimated_delivery_date: startDateDetail.value,
        end_date: endDateDetail.value,
      }
    );
    tableDataDetail.value = formatDateDetail(data.data.pageList);
    tableDataDetailLength.value = data.data.totalCount;
  } catch (error) {
    setSnackbar("black", "获取数据失败");
    console.log(error);
  }
}
// 工单明细表格有多少页
let tableDetailPageCount = computed(() => {
  return Math.ceil(tableDataDetailLength.value / tableDetailPerPage.value);
});
//工单明细下一页
watch(tableDetailPage, () => {
  getWorkOrderDetail();
});
//更改工单明细页面显示的最大数量
watch(tableDetailPerPage, () => {
  getWorkOrderDetail();
});
//将工单明细数据的日期进行截取，保留年月份
function formatDateDetail(data: any) {
  try {
    data.forEach((item: any) => {
      if (item.estimated_delivery_date !== null) {
        item.estimated_delivery_date = item.estimated_delivery_date.substring(
          0,
          10
        );
      }
      if (item.actual_delivery_date !== null)
        item.actual_delivery_date = item.actual_delivery_date.substring(0, 10);
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
//点击表单显示表单明细
async function showTicketDetail(item: any, obj: any) {
  detailName.value = obj.item.raw.workorder_hid;
  productName.value = obj.item.raw.product_id.slice(-9); //点击存储当前行的项目号
}
//通过监听当前操作的工单编号是否改变，来显示右边的工单明细数据
watch(detailName, () => {
  tableDetailPage.value = 1;
  getWorkOrderDetail();
});

// 新增工单前重置新增对话框
function resetAddDialog() {
  operatingTicket.value = {
    workorder_type: "机加工",
    product_id: "",
    product_description: "",
    start_date: "",
    finish_date: "",
    unit: "件",
    status: "新建未审核",
  };
  addDialog.value = true;
}
// 新增工单
async function addTicket() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M02AddWorkOrder",
      "post",
      operatingTicket.value
    );
    getWorkOrder();
    if (data.code === 200) {
      setSnackbar("green", "新增成功");
    } else {
      setSnackbar("black", "新增失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "新增失败");
  }
  addDialog.value = false;
}

// 新增工单明细前重置新增对话框
function resetAddDetailDialog() {
  operatingTicketDetail.value = {
    estimated_delivery_date: "",
    blueprint_id: "",
    standard_time: "",
    actual_time: 0,
    procedure: null,
    planned_quantity: "",
    reported_quantity: 0,
    unit: "件",
    workorder_hid: detailName.value,
    actual_delivery_date: null,
    status: null,
  };
  addDetailDialog.value = true;
}
//新增工单明细行
async function addTicketDetail() {
  try {
    const tableArr: any[] = [];
    selectedRows.value.forEach((item: any) => {
      tableArr.push({
        mcode: item.partName,
        estimated_delivery_date:
          operatingTicketDetail.value.estimated_delivery_date,
        blueprint_id: operatingTicketDetail.value.blueprint_id,
        project_code: item.projectCode,
        standard_time: operatingTicketDetail.value.standard_time,
        actual_time: "0",
        procedure: null,
        planned_quantity: operatingTicketDetail.value.planned_quantity,
        reported_quantity: "0",
        unit: operatingTicketDetail.value.unit,
        workorder_hid: detailName.value,
        actual_delivery_date: null,
        status: "新增未分配",
      });
    });
    const data: any = await useHttp(
      "/MesWorkOrderDetail/M06AddWorkOrderDetails",
      "post",
      tableArr
    );
    getWorkOrderDetail();
    selectedRows.value = [];
    if (data.code === 200) {
      setSnackbar("green", "新增成功");
    } else {
      setSnackbar("black", "新增失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "新增失败");
  }
  addDetailDialog.value = false;
}
// 修改工单
async function editTicket() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
      "put",
      operatingTicket.value
    );
    getWorkOrder();
    if (data.code === 200) {
      setSnackbar("green", "修改成功");
    } else {
      setSnackbar("black", "修改失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "修改失败");
  }
  editDialog.value = false;
}

//审核通过
async function auditTicket() {
  try {
    operatingTicket.value.status = "已审核待排产";
    const data: any = await useHttp(
      "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
      "put",
      operatingTicket.value
    );
    getWorkOrder();
  } catch (error) {
    console.log(error);
  }
  auditDialog.value = false;
}

//修改工单明细行
async function editTicketDetail() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
      "put",
      [operatingTicketDetail.value]
    );
    getWorkOrderDetail();
    if (data.code === 200) {
      setSnackbar("green", "修改成功");
    } else {
      setSnackbar("black", "修改失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "修改失败");
  }
  editDetailDialog.value = false;
}

// 删除工单
async function deleteTicket() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M04DeleteWorkOrder",
      "delete",
      undefined,
      {
        workorder_ids: [operatingTicket.value.id],
      }
    );
    getWorkOrder();
    if (data.code === 200) {
      setSnackbar("green", "删除成功");
    } else {
      setSnackbar("black", "删除失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "删除失败");
  }
  deleteDialog.value = false;
}

// 删除工单明细行
async function deleteTicketDetail() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrderDetail/M08DeleteWorkOrderDetails",
      "delete",
      undefined,
      { workorderdetail_ids: [operatingTicketDetail.value.id] }
    );
    getWorkOrderDetail();
    if (data.code === 200) {
      setSnackbar("green", "删除成功");
    } else {
      setSnackbar("black", "删除失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "删除失败");
  }
  deleteDetailDialog.value = false;
}

//查看图纸
function handleBlueprintClick(item: any) {
  console.log(item.blueprint_id); // 查看图纸
}
//bom清单维护
function handleBomClick(item: any) {
  router.push({
    path: "/work-order/bom-list",
    query: { workorder_did: item.workorder_did },
  });
}

//产品编号列表数据
let productTableData = ref();
let productHeaders = ref();
let productTypeName = ref("");
//获取到自制件的数据
async function getHomeData(name: any) {
  const homeData: any = await useHttp(
    "/MaterialForm/M52GetHomemadeForm",
    "get",
    undefined,
    {
      PageIndex: productTablePage.value,
      PageSize: productTablePerPage.value,
      SortType: 1,
      SortedBy: "_id",
      queryname: name.value,
    }
  );
  if (!homeData.data.totalCount) return (productTableData.value = []);
  productTableData.value = homeData.data.pageList; //赋值
  productDataLength.value = homeData.data.totalCount; //获取数据库总数据条
  productHeaders.value = homemadeHeaders.value; //给数据表头赋值相对应的值
}
//获取到标准外购件的数据
async function getMaterialData(searchProduct: any) {
  const outData: any = await useHttp(
    "/MaterialForm/M51GetMaterialForm",
    "get",
    undefined,
    {
      PageIndex: productTablePage.value,
      PageSize: productTablePerPage.value,
      SortType: 1,
      SortedBy: "_id",
      queryname: searchProduct.value,
    }
  );
  if (!outData.data.totalCount) return (productTableData.value = []);
  productTableData.value = outData.data.pageList;
  productDataLength.value = outData.data.totalCount;
  productHeaders.value = materialHeaders.value;
}

//点击弹出产品编号表格弹框
async function showProductDialog() {
  try {
    getHomeData(searchProduct);
    productTypeName.value = "自制件";
    searchProduct.value = "";
  } catch (error) {
    console.log(error);
  }
  productDialog.value = true;
}
//切换产品类别
watch(productTypeName, async () => {
  if (productTypeName.value === "自制件") {
    selectedRows.value = [];
    getHomeData(searchProduct);
  } else if (productTypeName.value === "标准外购件") {
    selectedRows.value = [];
    getMaterialData(searchProduct);
  }
});
//产品列表有多少页
const productTablePageCount = computed(() => {
  return Math.ceil(productDataLength.value / productTablePerPage.value);
});
//切换页面，重新给表格赋值
watch(productTablePage, () => {
  if (productTypeName.value === "自制件") {
    getHomeData(searchProduct);
  } else if (productTypeName.value === "标准外购件") {
    getMaterialData(searchProduct);
  }
});
//修改当前页最大数量
watch(productTablePerPage, () => {
  if (productTypeName.value === "自制件") {
    getHomeData(searchProduct);
  } else if (productTypeName.value === "标准外购件") {
    getMaterialData(searchProduct);
  }
});
//选择产品编号
function saveProduct() {
  try {
    //找到所选的产品信息
    //判断是否只选择一个产品
    if (selectedRows.value.length === 1) {
      const selectedData = selectedRows.value[0];
      //将找到的物料编码，拼接成字符串
      let productIdString = selectedData.resultCode;
      //产品描述
      let productString = "";
      //当选择的是自制件的类型
      if (productTypeName.value === "自制件") {
        //将选择的自制件数据的总装物件名拼接成字符串
        productString = selectedData.totalName;
      }
      if (productTypeName.value === "标准外购件") {
        //将选择的标准外购件数据的零件名拼接成字符串
        let productXhms = selectedData.xhms;
        //将选择的标准外购件数据的规格拼接成字符串
        let productggms = selectedData.ggms;
        //将俩个字符串连接起来
        productString = productXhms + "," + productggms;
      }

      //将选择的产品信息值，赋值给新建工单的产品信息
      operatingTicket.value.product_description = productString;
      //将选择的物料编码，赋值给新建工单的产品id
      operatingTicket.value.product_id = productIdString;
      //清空选择的数据
      selectedRows.value = [];
      productDialog.value = false;
    } else {
      selectedRows.value = [];
      return setSnackbar("black", "一次只能选择一个");
    }
  } catch (error) {
    console.log(error);
  }
}
//产品的搜素
async function filterProduct() {
  try {
    productTablePage.value = 1;
    if (productTypeName.value === "自制件") {
      getHomeData(searchProduct);
    }
    if (productTypeName.value === "标准外购件") {
      getMaterialData(searchProduct);
    }
  } catch (error) {
    console.log(error);
  }
}
//重置搜素
function resetFilterProduct() {
  searchProduct.value = "";
  productTablePage.value = 1;
  if (productTypeName.value === "自制件") {
    getHomeData(searchProduct);
  }
  if (productTypeName.value === "标准外购件") {
    getMaterialData(searchProduct);
  }
}

let productPage = ref(1);
let productPerPage = ref(10);
let productLength = ref(0);
//根据项目号和零件名查询产料
async function productList() {
  try {
    const data: any = await useHttp(
      "/MaterialForm/M53GetHomemadeForm",
      "get",
      undefined,
      {
        PageIndex: productPage.value,
        PageSize: productPerPage.value,
        SortType: 1,
        SortedBy: "_id",
        projectCode: productName.value,
        partName: searchName.value,
      }
    );
    if (!data.data.totalCount) return (productTableData.value = []);
    productTableData.value = data.data.pageList; //赋值
    productLength.value = data.data.totalCount; //获取数据库总数据条
    productHeaders.value = homemadeHeaders.value; //给数据表头赋值相对应的值
  } catch (error) {
    console.log(error);
  }
}

//当前项目产品列表有多少页
const productPageCount = computed(() => {
  return Math.ceil(productLength.value / productPerPage.value);
});

//根据产品的项目号来筛选新增的产出料
async function showMcodeDialog() {
  try {
    productLength.value = 0;
    searchName.value = "";
    productList();
    productPage.value = 1;
    productTypeName.value = "自制件";
  } catch (error) {
    console.log(error);
  }
  mcodeDialog.value = true;
}

//搜素
async function filterNameProduct() {
  try {
    productPage.value = 1;
    productList();
  } catch (error) {
    console.log(error);
  }
}
//重置搜素
function resetFilterNameProduct() {
  searchName.value = "";
  productPage.value = 1;
  productList();
}
watch(productPage, () => {
  productList();
});
watch(productPerPage, () => {
  productList();
});
//选择数据批量创建工单明细产料名和项目号
async function saveMcodeProduct() {
  try {
    if (selectedRows.value.length === 0) {
      return setSnackbar("black", "请选择产出料，创建工单明细");
    }
    operatingTicketDetail.value.mcode = selectedRows.value
      .map((item) => item.partName)
      .join(",");
    mcodeDialog.value = false;
  } catch (error) {
    console.log(error);
  }
}

//文本规则、
//数字规则
const numberRule = ref<any>([(v: any) => /^\d+$/.test(v) || "只能填写数字"]);
//日期规则
const dateRule = ref<any>([
  (v: any) =>
    /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/.test(
      v
    ) || "日期格式如“2023-10-01”",
]);
</script>

<template>
  <v-row class="ma-2">
    <!-- 左边工单表格 -->
    <v-col cols="6">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">工单</v-toolbar>
        <v-row class="ma-2">
          <v-col cols="4">
            <v-text-field
              label="工单编号"
              variant="outlined"
              density="compact"
              v-model="searchTicketNumber"
              hide-details
              @keydown.enter="filterTableData()"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-select
              label="工单状态"
              variant="outlined"
              density="compact"
              v-model="searchTicketStatus"
              :items="workStatus"
              hide-details
              @keydown.enter="filterTableData()"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              label="工单类型"
              variant="outlined"
              density="compact"
              v-model="searchTicketType"
              :items="['机加工', '装配']"
              hide-details
              @keydown.enter="filterTableData()"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="最早开始日期"
              variant="outlined"
              density="compact"
              v-model="startDate"
              type="date"
              hide-details
              @keydown.enter="filterTableData()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="最晚开始日期"
              type="date"
              variant="outlined"
              density="compact"
              v-model="endDate"
              hide-details
              @keydown.enter="filterTableData()"
            >
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              color="black"
              class="mr-2"
              size="large"
              @click="filterTableData()"
              >查询</v-btn
            >
            <v-btn color="red" class="mr-2" size="large" @click="resetFilter()">
              重置查询
            </v-btn>
            <v-btn
              color="teal"
              class="mr-2"
              size="large"
              @click="resetAddDialog()"
            >
              新增工单
            </v-btn>
            <v-btn color="blue" class="mr-2" size="large">导出</v-btn>
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
            <!-- 工单表头表格 -->
            <v-data-table
              :headers="tableHeaders"
              :items="tableData"
              :items-per-page="tablePerPage"
              hover
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              height="610"
              no-data-text="没有找到符合的数据"
              @click:row="showTicketDetail"
            >
              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:item.actions="{ item }">
                <!-- 未审核 -->
                <v-icon
                  color="green"
                  size="small"
                  class="mr-3"
                  v-if="item.raw.status === '新建未审核'"
                  @click.stop="
                    operatingTicket = { ...item.raw };
                    auditDialog = true;
                  "
                >
                  fa-solid fa-eye
                </v-icon>
                <!-- 已审核 -->
                <v-icon color="black" size="small" class="mr-3" v-else>
                  fa-solid fa-eye-slash
                </v-icon>
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="
                    operatingTicket = { ...item.raw };
                    editDialog = true;
                  "
                >
                  fa-solid fa-pen
                </v-icon>

                <v-icon
                  color="red"
                  size="small"
                  @click.stop="
                    operatingTicket = { ...item.raw };
                    deleteDialog = true;
                  "
                >
                  fa-solid fa-trash
                </v-icon>
              </template>

              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination
                    v-model="tablePage"
                    :length="tablePageCount"
                  ></v-pagination>
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- 右边明细表 -->
    <v-col cols="6">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">工单{{ detailName }}明细</v-toolbar>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-text-field
              label="项目号"
              variant="outlined"
              density="compact"
              v-model="searchProjectNumber"
              hide-details
              @keydown.enter="filterTableDataDetail()"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="产出料"
              variant="outlined"
              density="compact"
              v-model="searchOutputs"
              hide-details
              @keydown.enter="filterTableDataDetail()"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="最早交付日期"
              type="date"
              variant="outlined"
              density="compact"
              v-model="startDateDetail"
              hide-details
              @keydown.enter="filterTableDataDetail()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="最晚交付日期"
              type="date"
              variant="outlined"
              density="compact"
              v-model="endDateDetail"
              hide-details
              @keydown.enter="filterTableDataDetail()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="10">
            <v-btn
              color="black"
              class="mr-2"
              size="large"
              @click="filterTableDataDetail()"
              >查询</v-btn
            >
            <v-btn
              color="red"
              class="mr-2"
              size="large"
              @click="resetFilterDetail()"
            >
              重置查询
            </v-btn>
            <v-btn
              color="teal"
              class="mr-2"
              size="large"
              v-if="detailName"
              @click="resetAddDetailDialog()"
              >新增明细</v-btn
            >
            <v-btn @click="batchWork()" class="mr-2" color="blue" size="large"
              >批量工序维护</v-btn
            >
          </v-col>
          <v-col cols="2">
            <v-select
              class="mr-1"
              density="compact"
              hide-details
              variant="outlined"
              label="每页最大数"
              :items="[10, 20, 30, 40]"
              v-model="tableDetailPerPage"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
            <v-data-table
              hover
              :items-per-page="tableDetailPerPage"
              v-model="selected"
              show-select
              :key="key"
              :headers="headers"
              :items="tableDataDetail"
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              no-data-text="没有找到符合的数据"
              height="610"
            >
              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-2"
                  @click="
                    operatingTicketDetail = { ...item.raw };
                    editDetailDialog = true;
                  "
                >
                  fa-solid fa-pen
                </v-icon>

                <v-icon
                  color="red"
                  size="small"
                  @click="
                    operatingTicketDetail = { ...item.raw };
                    deleteDetailDialog = true;
                  "
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
              <template v-slot:item.procedure="{ item }">
                <span>
                  <v-btn
                    @click="showProcessDialog(item.raw)"
                    :color="item.raw.procedure ? 'green' : 'grey'"
                    >{{ item.raw.procedure ? "可维护" : "未维护" }}
                    <v-tooltip activator="parent" location="top">{{
                      item.raw.procedure
                    }}</v-tooltip>
                  </v-btn>
                </span>
              </template>
              <template v-slot:item.bomdata="{ item }">
                <span>
                  <v-btn
                    @click="handleBomClick(item.raw)"
                    :color="item.raw.bomdata ? 'green' : 'grey'"
                    >{{ item.raw.bomdata ? "可维护" : "未维护" }}
                    <v-tooltip activator="parent" location="top">{{
                      item.raw.bomdata
                    }}</v-tooltip>
                  </v-btn></span
                >
              </template>
              <template v-slot:item.blueprint_id="{ item }">
                <span>
                  <v-btn
                    @click="handleBlueprintClick(item.raw)"
                    :color="item.raw.blueprint_id ? 'green' : 'grey'"
                    >{{ item.raw.blueprint_id ? "可维护" : "未维护" }}
                    <v-tooltip activator="parent" location="top">{{
                      item.raw.blueprint_id
                    }}</v-tooltip>
                  </v-btn>
                </span>
              </template>
              <template v-slot:bottom> </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination
                v-model="tableDetailPage"
                :length="tableDetailPageCount"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- 新增工单表头 -->
    <v-dialog v-model="addDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicket.product_description"
            label="产品描述"
            append-inner-icon="fa-regular fa-hand-pointer"
            @click:append-inner="showProductDialog"
          ></v-text-field>
          <v-select
            label="工单类型"
            :items="['装配', '机加工']"
            v-model="operatingTicket.workorder_type"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.planned_quantity"
            label="计划数量"
            :rules="numberRule"
          ></v-text-field>

          <v-select
            label="单位"
            :items="units"
            v-model="operatingTicket.unit"
          ></v-select>
          <v-text-field
            label="开始日期"
            :rules="dateRule"
            v-model="operatingTicket.start_date"
          />
          <v-text-field
            label="完成日期"
            :rules="dateRule"
            v-model="operatingTicket.finish_date"
          ></v-text-field>
          <v-text-field
            label="计划完成日期"
            :rules="dateRule"
            v-model="operatingTicket.planned_completion_time"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="addTicket()">
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改工单 -->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-select
            label="工单类型"
            :items="['装配', '机加工']"
            v-model="operatingTicket.workorder_type"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.product_description"
            label="产品描述"
            append-inner-icon="fa-regular fa-hand-pointer"
            @click:append-inner="showProductDialog"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.planned_quantity"
            label="计划数量"
            :rules="numberRule"
          ></v-text-field>
          <v-select
            label="单位"
            :items="units"
            v-model="operatingTicket.unit"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.start_date"
            :rules="dateRule"
            label="开始日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.finish_date"
            :rules="dateRule"
            label="完成日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.planned_completion_time"
            :rules="dateRule"
            label="计划完成日期"
          ></v-text-field>
          <v-select
            label="工单状态"
            :items="workStatus"
            v-model="operatingTicket.status"
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="editTicket()">
            确认修改
          </v-btn>
          <v-btn color="grey" size="large" @click="editDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除工单 -->
    <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4 text-center text-red text-h6">
          您确认要删除工单编号为"{{
            operatingTicket.workorder_hid
          }}"这条数据吗？
        </v-card-text>
        <div class="d-flex justify-end mr-6 my-4">
          <v-btn color="red" size="large" class="mr-2" @click="deleteTicket()">
            确认删除
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 新增工单明细 -->
    <v-dialog v-model="addDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 批量新增工单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicketDetail.mcode"
            label="产出料"
            append-inner-icon="fa-regular fa-hand-pointer"
            @click:append-inner="showMcodeDialog"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.estimated_delivery_date"
            :rules="dateRule"
            label="预计交付时间"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.blueprint_id"
            label="图纸号"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.planned_quantity"
            label="计划数量"
            :rules="numberRule"
          ></v-text-field>
          <v-select
            label="单位"
            :items="units"
            v-model="operatingTicketDetail.unit"
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue"
            size="large"
            class="mr-2"
            @click="addTicketDetail()"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除工单明细行 -->
    <v-dialog v-model="deleteDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除工单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4 text-center text-red text-h6">
          您确认要删除工单明细编号为"{{
            operatingTicketDetail.workorder_did
          }}"这条数据吗？
        </v-card-text>
        <div class="d-flex justify-end mr-6 my-4">
          <v-btn
            color="red"
            size="large"
            class="mr-2"
            @click="deleteTicketDetail()"
          >
            确认删除
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改工单明细行 -->
    <v-dialog v-model="editDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicketDetail.estimated_delivery_date"
            :rules="dateRule"
            label="预计交付时间"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.actual_delivery_date"
            :rules="dateRule"
            label="实际交付时间"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.actual_time"
            label="实际工时"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.planned_quantity"
            label="计划数量"
            :rules="numberRule"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.reported_quantity"
            label="实际报工数量"
            :rules="numberRule"
          ></v-text-field>
          <v-select
            label="单位"
            :items="units"
            v-model="operatingTicketDetail.unit"
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue"
            size="large"
            class="mr-2"
            @click="editTicketDetail()"
          >
            确认修改
          </v-btn>
          <v-btn color="grey" size="large" @click="editDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 工序维护弹框 -->
    <v-dialog v-model="processDialog" min-width="400px" width="800px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> {{ mcodeName }}工序维护 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cancelProcess()">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row class="ma-3">
          <v-col cols="1"></v-col>
          <v-col cols="6">
            <v-card height="350px" style="overflow-y: auto">
              <v-card-subtitle>已选工序</v-card-subtitle>
              <v-list @dragover.prevent @drop="drop">
                <v-list-item
                  class="ma-5"
                  v-for="(chip, index) in droppedChips"
                  :key="index"
                  color="primary"
                  text-color="white"
                  draggable="true"
                  v-if="droppedChips.length !== 0"
                  :title="chip"
                >
                  <template v-slot:prepend>
                    <v-badge color="red" overlap class="mr-4"> </v-badge
                  ></template>

                  <template v-slot:append>
                    <v-icon @click="removeChip(index)" size="small"
                      >fa-solid fa-xmark</v-icon
                    ></template
                  >
                </v-list-item>
                <v-list-item
                  v-else
                  subtitle="请选择工序"
                  class="mb-5"
                ></v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
          <v-col cols="3">
            <v-card flat height="350px" style="overflow-y: auto">
              <v-card-subtitle>可选工序</v-card-subtitle>
              <div
                v-for="(chip, index) in chips"
                :key="index"
                draggable="true"
                @dragstart="dragStart(chip)"
                @dragend="dragEnd"
                v-if="chips.length !== 0"
              >
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
                  size="large"
                >
                  {{ chip }}
                </v-chip>
              </div>
              <v-chip v-else>已无可选择的工序</v-chip>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card height="350px" style="overflow-y: auto">
              <v-card-subtitle>常用工艺路线</v-card-subtitle>
              <v-list>
                <v-list-item
                  v-for="(item, index) in produceGroups"
                  :key="index"
                  class="text-h6 mx-auto"
                  @click="commonProduce(item)"
                >
                  {{ index + 1 }}. {{ item.rsv2 }}
                  <template v-slot:append>
                    <v-icon @click.stop="deleteProduce(item)" size="small"
                      >fa-solid fa-xmark</v-icon
                    ></template
                  >
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="green"
            v-if="droppedChips.length !== 0"
            size="large"
            class="mr-6"
            @click="saveComUsedProduce()"
          >
            <v-icon class="mr-1">fa-solid fa-plus</v-icon>
            常用工序路线
          </v-btn>
          <v-btn color="blue" size="large" class="mr-2" @click="saveTicket()">
            保存工序
          </v-btn>
          <v-btn color="grey" size="large" @click="cancelProcess()">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 产品编号类型 -->
    <v-dialog v-model="productDialog" min-width="400px" width="1000px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 选择产品描述 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="productDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-text-field
                label="模糊查询，如您输入零件名，物料编码，项目号等信息的部分便可查询"
                variant="outlined"
                density="compact"
                v-model="searchProduct"
                hide-details
                @keydown.enter="filterProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                variant="outlined"
                density="compact"
                label="当前产品类别"
                :items="['自制件', '标准外购件']"
                v-model="productTypeName"
              >
              </v-select>
            </v-col>
            <v-col cols="8">
              <v-btn
                color="black"
                class="mr-2"
                size="large"
                @click="filterProduct()"
                >查询</v-btn
              >
              <v-btn
                color="red"
                class="mr-2"
                size="large"
                @click="resetFilterProduct()"
              >
                重置查询
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-select
                class="mr-1"
                variant="outlined"
                density="compact"
                hide-details
                label="每页最大数"
                :items="[10, 20, 30, 40]"
                v-model="productTablePerPage"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <v-data-table
                hover
                :items-per-page="productTablePerPage"
                v-model="selectedRows"
                return-object
                show-select
                :key="key"
                :headers="productHeaders"
                :items="productTableData"
                style="overflow-x: auto; white-space: nowrap"
                fixed-footer
                fixed-header
                height="400"
                no-data-text="没有找到符合的数据"
              >
                <template v-slot:bottom>
                  <div class="text-center pt-2 mb-4">
                    <v-pagination
                      v-model="productTablePage"
                      :length="productTablePageCount"
                    ></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
        <div class="d-flex justify-end mr-6 my-4">
          <v-btn color="blue" size="large" class="mr-2" @click="saveProduct()">
            确定
          </v-btn>
          <v-btn color="grey" size="large" @click="productDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 工单明细产出料 -->
    <v-dialog v-model="mcodeDialog" min-width="400px" width="1000px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 可以批量选择产品，批量增加产出料 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="mcodeDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-text-field
                label="零件名查询"
                variant="outlined"
                density="compact"
                v-model="searchName"
                hide-details
                @keydown.enter="filterNameProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                variant="outlined"
                density="compact"
                label="当前产品类别"
                :items="['自制件', '标准外购件']"
                v-model="productTypeName"
              >
              </v-select>
            </v-col>
            <v-col cols="8">
              <v-btn
                color="black"
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
            <v-col cols="4">
              <v-select
                class="mr-1"
                variant="outlined"
                density="compact"
                hide-details
                label="每页最大数"
                :items="[10, 20, 30, 40]"
                v-model="productPerPage"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <v-data-table
                hover
                :items-per-page="productPerPage"
                v-model="selectedRows"
                return-object
                show-select
                :key="key"
                :headers="productHeaders"
                :items="productTableData"
                style="overflow-x: auto; white-space: nowrap"
                fixed-footer
                fixed-header
                height="400"
                no-data-text="没有找到符合的数据"
              >
                <template v-slot:bottom>
                  <div class="text-center pt-2 mb-4">
                    <v-pagination
                      v-model="productPage"
                      :length="productPageCount"
                    ></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
        <div class="d-flex justify-end mr-6 my-4">
          <v-btn
            color="blue"
            size="large"
            class="mr-2"
            @click="saveMcodeProduct()"
          >
            确定
          </v-btn>
          <v-btn color="grey" size="large" @click="mcodeDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 工单表头审核 -->
    <v-dialog v-model="auditDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工单审核 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="auditDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            label="工单类型"
            readonly
            v-model="operatingTicket.workorder_type"
          ></v-text-field>
          <v-text-field
            readonly
            v-model="operatingTicket.product_description"
            label="产品描述"
          ></v-text-field>
          <v-text-field
            readonly
            v-model="operatingTicket.planned_quantity"
            label="计划数量"
          ></v-text-field>
          <v-text-field
            readonly
            label="单位"
            v-model="operatingTicket.unit"
          ></v-text-field>
          <v-text-field
            readonly
            v-model="operatingTicket.start_date"
            label="开始日期"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicket.planned_completion_time"
            label="计划完成日期"
            readonly
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="auditTicket()">
            审核通过
          </v-btn>
          <v-btn color="grey" size="large" @click="auditDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除常用工序流程 -->
    <v-dialog v-model="deleteProduceDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除常用工序流程 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteProduceDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4 text-center text-red text-h6">
          您确认要删除这条数据吗？
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="red"
            size="large"
            class="mr-2"
            @click="deleteComUsedProduce()"
          >
            确认删除
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteProduceDialog = false">
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

<style scoped>
.row-container {
  background-color: rgb(174, 182, 182);
}
.date-input {
  margin-bottom: 24px;
  color: grey;
  padding: 14px;
  border: none;
  border-bottom: 0.5px solid;
  width: 100%;
  background-color: #ebe9e9;
}
</style>
