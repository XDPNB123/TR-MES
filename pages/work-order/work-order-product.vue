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

let detailName = ref("");
// 用于刷新视图的 key
let key = ref<number>(0);
//多选产品编号
let selectProducts = ref<any[]>([]);
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
// 工单搜索
let searchTicketNumber = ref<string>("");
let searchProjectNumber = ref<string>("");
let startDate = ref("");
let endDate = ref("");
let startDateDetail = ref("");
let endDateDetail = ref("");
let searchTicketType = ref<string>("");
let searchOutputs = ref<string>("");
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
let keyToChinese = ref<any>({
  id: "序号",
  workorder_hid: "工单编号",
  workorder_type: "工单类型",
  unit: "单位",
  planned_quantity: "计划数量",
  product_description: "产品描述",
  start_date: "开始日期",
  finish_date: "完成日期",
  planned_completion_time: "计划完成时间",
  status: "工单状态",
});
let getChineseKey = (key: any) => keyToChinese.value[key] || key;
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
let keyToDetailChinese = ref<any>({
  mcode: "产出料",
  estimated_delivery_date: "预计交付时间",
  blueprint_id: "图纸号",
  bomdata: "BOM清单",
  procedure: "工序",
  project_code: "项目号",
  standard_time: "标准工时",
  actual_time: "实际工时",
  planned_quantity: "计划数量",
  reported_quantity: "实际报工数量",
  unit: "单位",
  status: "状态",
  workorder_did: "工单明细编号",
  workorder_hid: "工单编号",
  actual_delivery_date: "实际交付时间",
});
let getDetailChineseKey = (key: any) => keyToDetailChinese.value[key] || key;
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
    title: "产品描述",
    key: "product_description",
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
  { title: "序号", align: "start", key: "id" },
  { title: "产出料", align: "start", key: "mcode" },
  { title: "工序", align: "start", key: "procedure" },
  { title: "图纸号", align: "start", key: "blueprint_id" },
  { title: "BOM清单", align: "center", key: "bomdata" },
  { title: "预计交付日期", align: "start", key: "estimated_delivery_date" },
  { title: "实际交付日期", align: "start", key: "actual_delivery_date" },
  { title: "工单明细编号", align: "start", key: "workorder_did" },
  { title: "项目号", align: "start", key: "project_code" },
  { title: "标准工时", align: "start", key: "standard_time" },
  { title: "实际工时", align: "start", key: "actual_time" },
  { title: "计划数量", align: "start", key: "planned_quantity" },
  { title: "实际报工数量", align: "start", key: "reported_quantity" },
  { title: "单位", align: "start", key: "unit" },
  { title: "状态", align: "start", key: "status" },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);
//工单明细表格展示的数据
let tableDataDetail = ref<any[]>([]);

//自制件表头
let homemadeHeaders = ref<any[]>([
  { title: "项目号", align: "start", key: "projectCode" },
  { title: "项目类型", align: "start", key: "projectType" },
  { title: "总装物料名", align: "start", key: "totalName" },
  { title: "零件名", align: "center", key: "partName" },
  { title: "单位名", align: "start", key: "unitName" },
  { title: "物料编码", align: "start", key: "resultCode" },
]);
//自制表数据
let homemadeData = ref<any[]>([]);

//外购件表头
let materialHeaders = ref<any[]>([
  { title: "种类描述", align: "start", key: "middleName" },
  { title: "细类描述", align: "start", key: "smallName" },
  { title: "型号描述", align: "start", key: "xhms" },
  { title: "规格描述", align: "center", key: "ggms" },
  { title: "细类名", align: "start", key: "thinName" },
  { title: "单位名", align: "start", key: "unitName" },
  { title: "物料编码", align: "start", key: "resultCode" },
]);
//外购表数据
let materialData = ref<any[]>([]);

// 工单表格初始页
let tablePage = ref<number>(1);
// 工单表格每页条数
let tablePerPage = ref<number>(10);
// 工单表格有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableData.value.length / tablePerPage.value);
});

// 工单明细表格初始页
let tableDetailPage = ref<number>(1);
// 工单明细表格每页条数
let tableDetailPerPage = ref<number>(10);
// 工单明细表格有多少页
let tableDetailPageCount = computed(() => {
  return Math.ceil(tableDataDetail.value.length / tableDetailPerPage.value);
});

// 产品表格初始页
let productTablePage = ref<number>(1);
// 产品表格每页条数
let productTablePerPage = ref<number>(10);
//产品列表有多少页
let productTablePageCount = computed(() => {
  return Math.ceil(tableDataDetail.value.length / productTablePerPage.value);
});

//工序模块
let chips = ref<any[]>([]); //存储常用工序
let droppedChips = ref<any[]>([]); //维护选择的工序
let draggedChip = ref(null);
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

//用来存储表格selected选择的的数据
let innerTableSelectData = ref<any[]>([]);
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
      alert("请选择需要工序维护的产料");
      return;
    }

    //获取到当前选择的数据
    innerTableSelectData.value = tableDataDetail.value.filter((item: any) =>
      selected.value.includes(item.id)
    );

    //判断选择的数据他们的工序是否一致
    let isSameProcedure = innerTableSelectData.value.every(
      (item, index, array) => {
        return item.procedure === array[0].procedure;
      }
    );
    if (isSameProcedure) {
      // 所有选中的数据都有相同的工序属性
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
          PageSize: 5,
        }
      );
      chips.value = data.data;
      //过滤出已选工序和未选工序
      const workorderHids = innerTableSelectData.value[0].procedure.split(",");
      droppedChips.value = chips.value.filter((chip) =>
        workorderHids.includes(chip.procedure_name)
      );
      chips.value = chips.value.filter(
        (chip) => !workorderHids.includes(chip.procedure_name)
      );
    } else {
      alert("您选择的数据的初始工序属性并不一致，请检查后重新选择");
      return;
    }
  } catch (error) {
    console.log(error);
  }
  processDialog.value = true;
}

//工序维护
async function showProcessDialog(item: any) {
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
        PageSize: 5,
      }
    );
    chips.value = data.data;
    //将点击的哪行数据存到选择数据中
    innerTableSelectData.value.push(item);
    //过滤出已选工序和未选工序
    const workorderHids = item.procedure.split(",");
    droppedChips.value = chips.value.filter((chip) =>
      workorderHids.includes(chip.procedure_name)
    );
    chips.value = chips.value.filter(
      (chip) => !workorderHids.includes(chip.procedure_name)
    );
  } catch (error) {
    console.log(error);
  }
  processDialog.value = true;
}

//关闭\取消工序维护框，需要清空已选择的数据
function cancelProcess() {
  innerTableSelectData.value = [];
  processDialog.value = false;
}

//保存工序
async function saveTicket() {
  try {
    if (droppedChips.value.length === 0) {
      alert("请你至少选择一个工序");
      return;
    }
    // 将选择的工序数组拼接成字符串
    innerTableSelectData.value.forEach((item) => {
      item.procedure = droppedChips.value
        .map((item) => item.procedure_name)
        .join(",");
    });
    await useHttp(
      "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
      "put",
      innerTableSelectData.value
    );
    getWorkOrderDetail("");
  } catch (error) {
    console.log(error);
  }
  processDialog.value = false;
  innerTableSelectData.value = [];
}

// 工单表头搜索过滤
async function filterTableData() {
  try {
    const workData: any = await useHttp(
      "/MesWorkOrder/M01GetWorkOrderList",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 20,
        SortType: 1,
        SortedBy: "id",
        workorder_hid: searchTicketNumber.value,
        status: searchTicketType.value,
        start_date: null,
        planned_quantity: null,
        product_id: null,
        product_description: "",
        planned_completion_time: null,
        workorder_type: "",
        finish_date: null,
      }
    );
    tableData.value = formatDate(workData.data.pageList);

    // 确保日期已经选择
    // 确保日期已经选择
    if (startDate.value === "" || endDate.value === "") {
      return;
    }
    // 转换日期为时间戳进行比较
    const startTimestamp = new Date(startDate.value).getTime();
    const endTimestamp = new Date(endDate.value).getTime();

    // 过滤表数据
    tableData.value = tableData.value.filter((item) => {
      const itemTimestamp = new Date(item.start_date).getTime();
      return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
    });
  } catch (error) {
    console.log(error);
  }
}
// 工单表头重置搜索
function resetFilter() {
  searchTicketType.value = "";
  searchTicketNumber.value = "";
  startDate.value = "";
  endDate.value = "";
  detailName.value = "";
  getWorkOrder();
}

//工单明细搜素
async function filterTableDataDetail() {
  try {
    const workDataDetail: any = await useHttp(
      "/MesWorkOrderDetail/M05WorkOrderDetails",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 30,
        SortType: 1,
        SortedBy: "id",
        workorder_did: "",
        workorder_hid: detailName.value,
        blueprint_id: "",
        mcode: searchOutputs.value,
        planned_quantity: "",
        unit: "",
        procedure: "",
        project_code: searchProjectNumber.value,
        reported_quantity: "",
        estimated_delivery_date: "",
        actual_delivery_date: "",
        actual_time: "",
        standard_time: "",
      }
    );
    tableDataDetail.value = formatDateDetail(workDataDetail.data.pageList);
    // 确保日期已经选择
    // 确保日期已经选择
    if (startDateDetail.value === "" || endDateDetail.value === "") {
      return;
    }
    // 转换日期为时间戳进行比较
    const startTimestamp = new Date(startDateDetail.value).getTime();
    const endTimestamp = new Date(endDateDetail.value).getTime();

    // 过滤表数据
    tableDataDetail.value = tableDataDetail.value.filter((item) => {
      const itemTimestamp = new Date(item.estimated_delivery_date).getTime();
      return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
    });
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
  getWorkOrderDetail(detailName.value);
}
//页面加载时获取数据
onMounted(async () => {
  getWorkOrder();
  getWorkOrderDetail("");
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
        PageIndex: 1,
        PageSize: 20,
        SortType: 1,
        SortedBy: "id",
        workorder_hid: "",
        status: "",
        start_date: null,
        planned_quantity: null,
        product_id: null,
        product_description: "",
        planned_completion_time: null,
        workorder_type: "",
        finish_date: null,
      }
    );
    tableData.value = formatDate(data.data.pageList);
    workorderId.value = data.data.pageList.map(
      (item: any) => item.workorder_hid
    );
  } catch (error) {
    console.log(error);
  }
}
//将工单数据的日期进行截取，保留年月份
function formatDate(data: any) {
  try {
    data.forEach((item: any, index: number) => {
      item.start_date = item.start_date.substring(0, 10);
      item.finish_date = item.finish_date.substring(0, 10);
      item.planned_completion_time = item.planned_completion_time.substring(
        0,
        10
      );
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

//获取工单明细数据
async function getWorkOrderDetail(workorder_hid: string) {
  try {
    const data: any = await useHttp(
      "/MesWorkOrderDetail/M05WorkOrderDetails",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 30,
        SortType: 1,
        SortedBy: "id",
        workorder_did: "",
        workorder_hid: workorder_hid,
        blueprint_id: "",
        mcode: "",
        planned_quantity: "",
        unit: "",
        procedure: "",
        project_code: "",
        reported_quantity: "",
        estimated_delivery_date: "",
        actual_delivery_date: "",
        actual_time: "",
        standard_time: "",
      }
    );
    tableDataDetail.value = formatDateDetail(data.data.pageList);
  } catch (error) {
    console.log(error);
  }
}

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
  getWorkOrderDetail(obj.item.raw.workorder_hid);
  detailName.value = obj.item.raw.workorder_hid;
}

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
    await useHttp(
      "/MesWorkOrder/M02AddWorkOrder",
      "post",
      operatingTicket.value
    );
    getWorkOrder();
  } catch (error) {
    console.log(error);
  }
  addDialog.value = false;
}
// 新增工单明细前重置新增对话框
function resetAddDetailDialog() {
  operatingTicketDetail.value = {
    mcode: "",
    estimated_delivery_date: "",
    blueprint_id: "",
    project_code: "",
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
  getWorkOrder();
}

//新增工单明细行
async function addTicketDetail() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrderDetail/M06AddWorkOrderDetails",
      "post",
      [operatingTicketDetail.value]
    );
    getWorkOrderDetail(detailName.value);
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
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
    getWorkOrderDetail(detailName.value);
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
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
    getWorkOrderDetail(detailName.value);
  } catch (error) {
    console.log(error);
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
//点击弹出产品编号表格弹框
async function showProductDialog() {
  try {
    const homeData: any = await useHttp(
      "/MaterialForm/GetHomemadeForm",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 30,
        SortType: 1,
        SortedBy: "id",
        queryname: "",
      }
    );
    const outData: any = await useHttp(
      "/MaterialForm/GetMaterialForm",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 30,
        SortType: 1,
        SortedBy: "id",
        queryname: "",
      }
    );
    homemadeData.value = homeData.pageList;
    materialData.value = outData.pageList;
    productTableData.value = homemadeData.value;
    productHeaders.value = homemadeHeaders.value;
  } catch (error) {
    console.log(error);
  }
  productDialog.value = true;
}

let productTypeName = ref("自制件");
//切换数据
function handoffData() {
  if (productTypeName.value === "自制件") {
    productTableData.value = materialData.value;
    productTypeName.value = "外制件";
    productHeaders.value = materialHeaders.value;
  } else {
    productTableData.value = homemadeData.value;
    productTypeName.value = "自制件";
    productHeaders.value = homemadeHeaders.value;
  }
}
//选择产品编号
function saveProduct() {
  try {
    //找到所选的产品信息
    const selectedData = productTableData.value.filter((item: any) =>
      selectProducts.value.includes(item.id)
    );
    //将找到的产品信息，拼接成字符串
    let productString = selectedData.map((item: any) => item.mcode).join(",");
    //将选择的产品信息值，赋值给新建工单的产品信息
    operatingTicket.value.product_description = productString;
  } catch (error) {
    console.log(error);
  }
  productDialog.value = false;
}
</script>

<template>
  <v-row class="ma-2">
    <!-- 左边工单表格 -->
    <v-col cols="6">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">工单</v-toolbar>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-text-field
              label="工单编号"
              variant="outlined"
              density="compact"
              v-model="searchTicketNumber"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-select
              label="工单状态"
              variant="outlined"
              density="compact"
              v-model="searchTicketType"
              :items="workStatus"
              hide-details
            ></v-select>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="最早开始日期"
              type="date"
              variant="outlined"
              density="compact"
              v-model="startDate"
              hide-details
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
              color="green"
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
              v-model:page="tablePage"
              :headers="tableHeaders"
              :items="tableData"
              :items-per-page="tablePerPage"
              style="white-space: nowrap"
              @click:row="showTicketDetail"
            >
              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:item.actions="{ item }">
                <!-- <v-icon color="orange" size="small" class="mr-3" @click.stop="">
              fa-solid fa-eye
            </v-icon> -->
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
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="产出料"
              variant="outlined"
              density="compact"
              v-model="searchOutputs"
              hide-details
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
              color="green"
              class="mr-2"
              size="large"
              @click="resetAddDetailDialog()"
              >新增明细</v-btn
            >
            <v-btn @click="batchWork()" class="mr-2 bg-primary" size="large"
              >批量工序维护</v-btn
            >
          </v-col>
          <v-col cols="2">
            <v-select
              class="mr-1"
              variant="outlined"
              label="每页最大数"
              :items="[10, 20, 30, 40]"
              v-model="tableDetailPerPage"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
            <v-data-table
              v-model:page="tableDetailPage"
              :items-per-page="tableDetailPerPage"
              v-model="selected"
              multi-sort
              show-select
              :key="key"
              :headers="headers"
              :items="tableDataDetail"
              class="font-size"
            >
              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
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
                    :color="item.raw.procedure ? 'green' : 'red'"
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
                    :color="item.raw.bomdata ? 'green' : 'red'"
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
                    :color="item.raw.blueprint_id ? 'green' : 'red'"
                    >{{ item.raw.blueprint_id ? "可维护" : "未维护" }}
                    <v-tooltip activator="parent" location="top">{{
                      item.raw.blueprint_id
                    }}</v-tooltip>
                  </v-btn>
                </span>
              </template>
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination
                    v-model="tableDetailPage"
                    :length="tableDetailPageCount"
                  ></v-pagination>
                </div>
              </template>
            </v-data-table>
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
          ></v-text-field>

          <v-select
            label="单位"
            :items="units"
            v-model="operatingTicket.unit"
          ></v-select>
          <v-text-field
            label="开始日期"
            type="date"
            v-model="operatingTicket.start_date"
          />
          <v-text-field
            label="完成日期"
            type="date"
            v-model="operatingTicket.finish_date"
          ></v-text-field>
          <v-text-field
            label="计划完成日期"
            type="date"
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
          ></v-text-field>
          <v-select
            label="单位"
            :items="units"
            v-model="operatingTicket.unit"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.start_date"
            type="date"
            label="开始日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.finish_date"
            type="date"
            label="完成日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.planned_completion_time"
            type="date"
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
          您确认要删除这条工单吗？

          <v-list>
            <v-list-item
              v-for="(value, key, index) in operatingTicket"
              :key="index"
            >
              <template #prepend> {{ getChineseKey(key) }}:</template>
              <template #append>
                {{ value }}
              </template>
            </v-list-item>
          </v-list>
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
          <v-toolbar-title> 新增工单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicketDetail.mcode"
            label="产出料"
          ></v-text-field>
          <v-select
            label="工单编号"
            :items="workorderId"
            v-model="operatingTicketDetail.workorder_hid"
          ></v-select>
          <v-text-field
            v-model="operatingTicketDetail.estimated_delivery_date"
            type="date"
            label="预计交付时间"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.blueprint_id"
            label="图纸号"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.project_code"
            label="项目号"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.planned_quantity"
            label="计划数量"
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
          您确认要删除这条工单明细吗？

          <v-list>
            <v-list-item
              v-for="(value, key, index) in operatingTicketDetail"
              :key="index"
            >
              <template #prepend> {{ getDetailChineseKey(key) }}:</template>
              <template #append>
                {{ value }}
              </template>
            </v-list-item>
          </v-list>
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
            v-model="operatingTicketDetail.mcode"
            label="产料"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.estimated_delivery_date"
            type="date"
            label="交付时间"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.blueprint_id"
            label="图纸号"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.project_code"
            label="项目号"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.planned_quantity"
            label="计划数量"
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
    <v-dialog v-model="processDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工序维护 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cancelProcess()">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row class="ma-3">
          <v-col cols="1"></v-col>
          <v-col cols="6">
            <v-card class="h-60">
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
                  :title="chip.procedure_name"
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
            <v-card flat>
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
                  {{ chip.procedure_name }}
                </v-chip>
              </div>
              <v-chip v-else>已无可选择的工序</v-chip>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-end mr-6 mb-4">
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
    <v-dialog v-model="productDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 选择产品描述 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="productDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-toolbar class="text-h6 pl-6">产品类型</v-toolbar>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-text-field
                label="项目号"
                variant="outlined"
                density="compact"
                v-model="searchProjectNumber"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="8">
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
                color="green"
                class="mr-2"
                size="large"
                @click="handoffData()"
              >
                {{ productTypeName }}
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-select
                class="mr-1"
                variant="outlined"
                label="每页最大数"
                :items="[10, 20, 30, 40]"
                v-model="productTablePerPage"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <v-data-table
                v-model:page="productTablePage"
                :items-per-page="productTablePerPage"
                v-model="selectProducts"
                multi-sort
                show-select
                :key="key"
                :headers="productHeaders"
                :items="productTableData"
                class="font-size"
                style="max-height: 400px; overflow-y: auto"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    color="blue"
                    size="small"
                    class="mr-3"
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
                <template v-slot:bottom>
                  <div class="text-center pt-2">
                    <v-pagination
                      v-model="productTablePage"
                      :length="tableDetailPageCount"
                    ></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="saveProduct()">
            确定
          </v-btn>
          <v-btn color="grey" size="large" @click="productDialog = false">
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
  </v-row>
</template>

<style scoped>
.font-size {
  font-size: small;
  white-space: nowrap;
  width: 100%;
}
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
