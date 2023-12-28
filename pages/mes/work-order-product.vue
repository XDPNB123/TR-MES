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
//工单类型
let workType = ref<any[]>(["机加", "钣金", "其他"]);

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
let detailStatus = ref("");
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
let addDetailDialog2 = ref<boolean>(false);
let deleteDetailDialog = ref(false);
let editDetailDialog = ref(false);
let splitDetailDialog = ref(false);
let productDialog = ref(false);
let auditDialog = ref(false);
let processDialog = ref(false);
let mcodeDialog = ref(false);
let deleteProduceDialog = ref(false);
let dialog = ref(false);
// 工单搜索
let searchTicketNumber = ref<string>("");
let searchProjectNumber = ref<string>("");

let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);
let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 1);
let startDate = ref<any>(null);
let endDate = ref<any>(null);
let startDateDetail = ref<any>(null);
let endDateDetail = ref<any>(null);

let searchTicketStatus = ref<string>("");
let searchTicketType = ref("机加");
watch(searchTicketType, function () {
  getWorkOrder();
});
let searchOutputs = ref<string>("");
let searchProduct = ref<string>("00.00.00.00");
let searchProjectCode = ref<string>("");
let searchName = ref("");
let searchProject = ref("");
let searchMac = ref("");

// 正在操作的工单
let operatingTicket = ref<any>(null);
//正在操作的工单明细
let operatingTicketDetail = ref<any>(null);
//工单表按照开始时间进行降序排序
// 展示的工单表格数据
let tableData = ref<any[]>([]);
//工单明细表格展示的数据
let tableDataDetail = ref<any[]>([]);
function isDatePast(dateString: any) {
  let date = new Date(dateString);
  let now = new Date();
  return date < now;
}
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
let produceGroups = ref(); //常用工艺路线

//获取全部的工序数据
async function getProduce() {
  try {
    const data: any = await useHttp(
      "/SysConfig/M47GetProcessBasisConfig",
      "get",
      undefined,
      {
        config_type: "单工序",
      }
    );
    chips.value = data.data;
  } catch (error) {
    console.log(error);
  }
}
//获取常用工序组
async function getProduceGroup() {
  try {
    const newData: any = await useHttp(
      "/SysConfig/M47GetProcessBasisConfig",
      "get",
      undefined,
      { config_type: "常用工序组合" }
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
let selectName = ref<string>("全选");
//选中所有的工单明细
function selectAll() {
  if (selectName.value === "全选") {
    selected.value = [...tableDataDetail.value];
    selectName.value = "清空";
  } else {
    selected.value = [];
    selectName.value = "全选";
  }
}

// 发请求获取完整的选中的数据
// 判断工序是否一致
// 如果一致，则将选中的数据暂时保存
// 打开对话框，将选中数据的工序显示左边，其他工序过滤到右边
// 点击保存，将左侧的工序拼接后，赋值给每一个暂存的对象
// 将对象数组作为参数调用更新接口重新获取数据
//批量工序维护
async function batchWork() {
  try {
    clickIndex.value = -1;
    //判断是否选择数据
    if (selected.value.length === 0) {
      return setSnackbar("black", "请选择需要工序维护的产料");
    }

    //获取到当前选择的数据
    innerTableSelectData.value = [...selected.value];

    mcodeName.value = innerTableSelectData.value
      .map((item: any) => item.mdescription)
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
      await getProduceGroup();
      //过滤出已选工序和未选工序
      if (
        innerTableSelectData.value[0] &&
        innerTableSelectData.value[0].procedure
      ) {
        const workorderHids = innerTableSelectData.value[0].procedure
          .slice(1, -1)
          .split("],[")
          .map((item: any) => item.split(","));

        let combinedArray = [...chips.value, ...produceGroups.value];

        droppedChips.value = workorderHids
          .map((chip: any) =>
            combinedArray.find((item: any) => chip.toString() === item.rsv2)
          )
          .filter(Boolean);
        chips.value = chips.value.filter(
          (chip) =>
            !workorderHids.some((item: any) => chip.rsv2 === item.toString())
        );
      }
    } else {
      selected.value = [];
      selectName.value = "全选";
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
    clickIndex.value = -1;
    await getProduce();
    //常用工序流程
    await getProduceGroup();
    //将点击的哪行数据存到选择数据中
    innerTableSelectData.value.push(item);
    mcodeName.value = innerTableSelectData.value
      .map((item: any) => item.mdescription)
      .join(",");
    //过滤出已选工序和未选工序
    if (
      innerTableSelectData.value[0] &&
      innerTableSelectData.value[0].procedure
    ) {
      const workorderHids = item.procedure
        .slice(1, -1)
        .split("],[")
        .map((item: any) => item.split(","));

      let combinedArray = [...chips.value, ...produceGroups.value];

      // droppedChips.value = combinedArray.filter((chip: any) =>
      //   workorderHids.some((item: any) => chip.rsv2 === item.toString())
      // );
      droppedChips.value = workorderHids
        .map((chip: any) =>
          combinedArray.find((item: any) => chip.toString() === item.rsv2)
        )
        .filter(Boolean);
      chips.value = chips.value.filter(
        (chip) =>
          !workorderHids.some((item: any) => chip.rsv2 === item.toString())
      );
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

//点击当前行数据从chips中剔除
function reduceProcedure(item: any) {
  if (clickIndex.value < 0) {
    chips.value.splice(chips.value.indexOf(item), 1);
    droppedChips.value.push(item);
  } else {
    chips.value.splice(chips.value.indexOf(item), 1);
    droppedChips.value[clickIndex.value].rsv2 =
      droppedChips.value[clickIndex.value].rsv2 + "," + item.rsv2;
  }
}

//存储将单工序修改为工序组的数据
let procedureItem = ref<any>(null);
//123
let clickIndex = ref<number>(-1);
//将当前的单工序修改为工序组
async function addName(item: any, _index: number) {
  clickIndex.value = _index;
  procedureItem.value = item.rsv2;

  await getProduce();
  chips.value = chips.value.filter((_item: any) => _item.rsv2 !== item.rsv2);
}

//保存为常用工序路线
async function saveComUsedProduce() {
  try {
    let names = droppedChips.value[clickIndex.value].rsv2;
    if (names === procedureItem.value) {
      return cancel();
    }
    let isExist = produceGroups.value.some(
      (group: any) => group.rsv2 === names
    );
    if (isExist) {
      setSnackbar("black", "该工序路线已存在，无法重复添加");
      return;
    }
    await useHttp("/SysConfig/M48AddProcessBasis", "post", {
      config_code: "process_basis",
      rsv2: names,
      rsv1: "N",
    });
    setSnackbar("green", "保存成功");
    await getProduceGroup();
    await getProduce();
    //保存成功后重新过滤chips里的数据
    chips.value = chips.value.filter(
      (item: any) =>
        !droppedChips.value.some((_item: any) => _item.rsv2 === item.rsv2)
    );
    //将当前对象替换为常用工序组合，去掉修改标记
    droppedChips.value[clickIndex.value] =
      produceGroups.value[produceGroups.value.length - 1];
    clickIndex.value = -1;
  } catch (error) {
    console.log(error);
    setSnackbar("black", "保存失败");
  }
}

//取消保存为常用工序
async function cancel() {
  droppedChips.value[clickIndex.value].rsv2 = procedureItem.value;
  await getProduce();
  chips.value = chips.value.filter(
    (item: any) =>
      !droppedChips.value.some((_item: any) => _item.rsv2 === item.rsv2)
  );
  clickIndex.value = -1;
}

//保存工序
async function saveTicket() {
  try {
    if (droppedChips.value.length === 0) {
      return setSnackbar("black", "请你至少选择一个工序");
    }

    // 将选择的工序数组拼接成字符串
    innerTableSelectData.value.forEach((item) => {
      (item.procedure = droppedChips.value
        .map((item) => `[${item.rsv2}]`)
        .join(",")),
        (item.status = "已分配待排产");
    });
    await useHttp(
      "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
      "put",
      innerTableSelectData.value
    );

    getWorkOrderDetail();
    let tabArr = ref<any[]>([]);
    innerTableSelectData.value.forEach((item: any) => {
      droppedChips.value.forEach((_item: any, index: number) => {
        tabArr.value.push({
          workorder_hid: item.workorder_hid,
          workorder_did: item.workorder_did,
          procedure_id: _item.config_code,
          material_name: item.mdescription,
          defaul_outsource: _item.rsv1,
          planned_quantity: item.planned_quantity,
          planned_completion_time: item.estimated_delivery_date,
          material_id: item.mcode,
          unit: item.unit,
          procedure_order_id: index + 1,
          status: "已审核待排产",
          required_inspection: _item.rsv3,
          employee_id: "",
          employee_name: "",
        });
      });
    });
    //将维护的工序添加到工单明细工序分配数据库
    await useHttp(
      "/ProductionRecode/M22AddProductionRecode",
      "post",
      tabArr.value
    );
    //查询当前明细下的工单表头状态
    const data_: any = await useHttp(
      "/MesWorkOrder/M01GetWorkOrderList",
      "get",
      undefined,
      {
        workorder_hid: innerTableSelectData.value[0].workorder_hid,
        PageIndex: 1,
        PageSize: 100000,
        SortedBy: "id",
        SortType: "0",
      }
    );
    if (data_.data.pageList[0].status === "已排产生产中") {
      data_.data.pageList[0].status = "已审核待排产";
      await useHttp("/MesWorkOrder/M03PartiallyUpdateWorkOrder", "put", [
        data_.data.pageList[0],
      ]);
    }
    getWorkOrder();
    setSnackbar("green", "保存成功");
  } catch (error) {
    console.log(error);
    setSnackbar("black", "保存失败");
  }
  processDialog.value = false;
  innerTableSelectData.value = [];
  selected.value = [];
  selectName.value = "全选";
  droppedChips.value = [];
}

//点击常用工序组
async function commonProduce(item: any) {
  droppedChips.value.push(item);
}
//移除选择的常用工序组
function removeProceDureGroup(item: any) {
  if (item.config_type === "单工序") {
    droppedChips.value.splice(droppedChips.value.indexOf(item), 1);
    chips.value.push(item);
  } else {
    droppedChips.value.splice(droppedChips.value.indexOf(item), 1);
  }
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
  searchTicketType.value = "机加";
  startDate.value = nowDate.toISOString().substring(0, 10);
  endDate.value = oldDate.toISOString().substring(0, 10);
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
  startDateDetail.value = nowDate.toISOString().substring(0, 10);
  endDateDetail.value = oldDate.toISOString().substring(0, 10);
  tableDetailPage.value = 1;
  getWorkOrderDetail();
}
//页面加载时获取数据
onMounted(async () => {
  startDate.value = nowDate.toISOString().substring(0, 10);
  endDate.value = oldDate.toISOString().substring(0, 10);
  startDateDetail.value = nowDate.toISOString().substring(0, 10);
  endDateDetail.value = oldDate.toISOString().substring(0, 10);
  getWorkOrder();
  getWorkOrderDetail();
});

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
    if (tableData.value.length) {
      detailName.value = tableData.value[0].workorder_hid;
      detailStatus.value = tableData.value[0].status;
      searchProject.value = tableData.value[0].product_id.slice(-9);
      searchMac.value = tableData.value[0].product_id.substring(2, 7);
    }
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
      if (item.scheduled_start_date) {
        item.scheduled_start_date = item.scheduled_start_date.substring(0, 10);
      }
      if (item.scheduled_start_date) {
        item.scheduled_start_date = item.scheduled_start_date.substring(0, 10);
      }
      if (item.approve_date) {
        item.approve_date = item.approve_date.substring(0, 10);
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
async function showTicketDetail(item: any) {
  detailName.value = item.workorder_hid;
  detailStatus.value = item.status;
  searchProject.value = item.product_id.slice(-9);
  searchMac.value = item.product_id.substring(2, 7);
}
//通过监听当前操作的工单编号是否改变，来显示右边的工单明细数据
watch(detailName, () => {
  tableDetailPage.value = 1;
  getWorkOrderDetail();
});
let date = new Date();
// 新增工单前重置新增对话框
function resetAddDialog() {
  operatingTicket.value = {
    workorder_type: "",
    product_id: "",
    planned_quantity: 1,
    product_description: "",
    scheduled_start_date: new Date().toISOString().slice(0, 10),
    planned_completion_time: "",
    unit: "套",
    status: "新建未审核",
  };
  addDialog.value = true;
}
//存储新增工单信息
let tabArr1 = ref<any[]>([]);
let workOrderType = ref<any[]>(["机加"]);
// 新增工单
async function addTicket() {
  try {
    if (!operatingTicket.value.product_description) {
      return setSnackbar("black", "请您输入产品描述");
    }
    if (!operatingTicket.value.planned_completion_time) {
      return setSnackbar("black", "请您选择计划完成时间");
    }

    workOrderType.value.forEach((item: any) => {
      tabArr1.value.push({
        workorder_type: item,
        product_id: operatingTicket.value.product_id,
        planned_quantity: operatingTicket.value.planned_quantity,
        product_description: operatingTicket.value.product_description,
        scheduled_start_date: operatingTicket.value.scheduled_start_date,
        planned_completion_time: operatingTicket.value.planned_completion_time,
        unit: operatingTicket.value.unit,
        status: operatingTicket.value.status,
      });
    });
    const data: any = await useHttp(
      "/MesWorkOrder/M02AddWorkOrder",
      "post",
      tabArr1.value
    );
    if (data.code === 200) {
      setSnackbar("green", "新增成功");
      addDialog.value = false;
      await getWorkOrder();
      tabArr1.value = [];
      detailName.value = tableData.value[0].workorder_hid;
      detailStatus.value = tableData.value[0].status;
    } else {
      setSnackbar("black", "新增失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "新增失败");
  }
}

// 新增工单明细前重置新增对话框
function resetAddDetailDialog() {
  selectedRows.value = [];
  productList();
  productTypeName.value = "自制件";
  mcodeDialog.value = true;
}
//新增工单明细行
async function addDetailSucces() {
  try {
    const tableArr: any[] = [];
    addDetailList.value.forEach((item: any) => {
      tableArr.push({
        mdescription: item.partName,
        mcode: item.resultCode,
        estimated_delivery_date: item.date,
        blueprint_id: "",
        project_code: item.projectCode,
        standard_time: item.hour,
        actual_time: "0",
        procedure: null,
        planned_quantity: item.num,
        reported_quantity: "0",
        unit: item.unitName,
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
      addDetailDialog2.value = false;
      mcodeDialog.value = false;
    } else {
      setSnackbar("black", "新增失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "新增失败");
  }
}
// 修改工单
async function editTicket() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
      "put",
      [operatingTicket.value]
    );
    getWorkOrder();
    if (data.code === 200) {
      setSnackbar("green", "修改成功");
      editDialog.value = false;
    } else {
      setSnackbar("black", "修改失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "修改失败");
  }
}

//审核通过
async function auditTicket() {
  try {
    operatingTicket.value.status = "已审核待排产";
    operatingTicket.value.approve_date = new Date().toISOString().slice(0, 10);
    const data: any = await useHttp(
      "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
      "put",
      [operatingTicket.value]
    );
    getWorkOrder();
  } catch (error) {
    console.log(error);
  }
  auditDialog.value = false;
}
//拆分明细行数据，新增一个明细行数据
//剩余的数量和委外的数量
let nowData = ref<number>(0);
let oldData = ref<number>(0);
async function splitTicket() {
  if (
    Number(nowData.value) + Number(oldData.value) !==
    operatingTicketDetail.value.planned_quantity
  ) {
    return setSnackbar(
      "black",
      "请你确保剩余数量和委外数量相加与初始任务数量一致"
    );
  }
  //修改当前明细行数据的数量
  operatingTicketDetail.value.planned_quantity = oldData.value;
  operatingTicketDetail.value.mdescription =
    operatingTicketDetail.value.mdescription + "(已拆批)";
  await useHttp("/MesWorkOrderDetail/M07UpdateWorkOrderDetail", "put", [
    operatingTicketDetail.value,
  ]);
  //修改当前明细编号下的排产数据的每条的数据
  const data: any = await useHttp(
    "/ProductionRecode/M21ProductionRecodeList",
    "get",
    undefined,
    {
      workorder_did: operatingTicketDetail.value.workorder_did,
      PageIndex: 1,
      PageSize: 100000,
      SortedBy: "id",
      SortType: "0",
    }
  );
  //存储当前明细编号下的所有排产数据
  let productionData: any = data.data.pageList;
  productionData = productionData.map((item: any) => {
    item.planned_quantity = oldData.value;
    item.material_name = operatingTicketDetail.value.mdescription;
    if (
      item.reported_quantity >= operatingTicketDetail.value.planned_quantity
    ) {
      item.reported_quantity = operatingTicketDetail.value.planned_quantity;
    }
    return item;
  });

  //调用排产数据修改的接口进行修改
  await useHttp(
    "/ProductionRecode/M23UpdateProductionRecode",
    "put",
    productionData
  );
  //新增一个批次工单明细对象
  const newDetailData = {
    estimated_delivery_date:
      operatingTicketDetail.value.estimated_delivery_date,
    blueprint_id: operatingTicketDetail.value.blueprint_id,
    standard_time: operatingTicketDetail.value.standard_time,
    actual_time: operatingTicketDetail.value.actual_time,
    procedure: null,
    planned_quantity: nowData.value,
    reported_quantity: 0,
    unit: operatingTicketDetail.value.unit,
    workorder_hid: operatingTicketDetail.value.workorder_hid,
    actual_delivery_date: operatingTicketDetail.value.actual_delivery_date,
    status: "新增未分配",
    mcode: operatingTicketDetail.value.mcode,
    mdescription:
      operatingTicketDetail.value.mdescription.slice(0, -5) + "(批次工单)",
    project_code: operatingTicketDetail.value.project_code,
  };
  await useHttp("/MesWorkOrderDetail/M06AddWorkOrderDetails", "post", [
    newDetailData,
  ]);
  setSnackbar("green", "拆批成功");
  // //查询当前明细下的工单表头状态
  // const data_: any = await useHttp(
  //   "/MesWorkOrder/M01GetWorkOrderList",
  //   "get",
  //   undefined,
  //   {
  //     workorder_hid: operatingTicketDetail.value.workorder_hid,
  //     PageIndex: 1,
  //     PageSize: 100000,
  //     SortedBy: "id",
  //     SortType: "0",
  //   }
  // );
  // console.log(data_.data.pageList[0]);
  // if (data_.data.pageList[0].status === "已排产生产中") {
  //   data_.data.pageList[0].status = "已审核待排产";

  //   await useHttp("/MesWorkOrder/M03PartiallyUpdateWorkOrder", "put", [
  //     data_.data.pageList[0],
  //   ]);
  // }
  getWorkOrder();
  getWorkOrderDetail();
  splitDetailDialog.value = false;
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
      editDetailDialog.value = false;
    } else {
      setSnackbar("black", "修改失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "修改失败");
  }
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
    getWorkOrderDetail();
    if (data.code === 200) {
      setSnackbar("green", data.data);
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
      setSnackbar("green", data.data);
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
    path: "/mes/bom-list",
    query: { workorder_did: item.workorder_did, mcodeName: item.mcode },
  });
}

//产品编号列表数据
let productTableData = ref();
let productHeaders = ref();
let productTypeName = ref("");
//获取到自制件的数据
async function getHomeData() {
  const homeData: any = await useHttp(
    "/MaterialForm/M52GetHomemadeForm",
    "get",
    undefined,
    {
      PageIndex: productTablePage.value,
      PageSize: productTablePerPage.value,
      SortType: 1,
      SortedBy: "_id",
      queryname: searchProduct.value,
      projectCode: searchProjectCode.value,
    }
  );
  if (!homeData.data.totalCount) return (productTableData.value = []);
  productTableData.value = homeData.data.pageList; //赋值
  productDataLength.value = homeData.data.totalCount; //获取数据库总数据条
  productHeaders.value = homemadeHeaders.value; //给数据表头赋值相对应的值
}
//获取到标准外购件的数据
async function getMaterialData() {
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
    getHomeData();
    selectedRows.value = [];
    productTypeName.value = "自制件";
    searchProduct.value = "00.00.00.00";
    searchProjectCode.value = "";
  } catch (error) {
    console.log(error);
  }
  productDialog.value = true;
}
//切换产品类别
watch(productTypeName, async () => {
  if (productTypeName.value === "自制件") {
    selectedRows.value = [];
    getHomeData();
  } else if (productTypeName.value === "标准外购件") {
    selectedRows.value = [];
    getMaterialData();
  }
});
//产品列表有多少页
const productTablePageCount = computed(() => {
  return Math.ceil(productDataLength.value / productTablePerPage.value);
});
//切换页面，重新给表格赋值
watch(productTablePage, () => {
  if (productTypeName.value === "自制件") {
    getHomeData();
  } else if (productTypeName.value === "标准外购件") {
    getMaterialData();
  }
});
//修改当前页最大数量
watch(productTablePerPage, () => {
  if (productTypeName.value === "自制件") {
    getHomeData();
  } else if (productTypeName.value === "标准外购件") {
    getMaterialData();
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
        //判断总转名和零部件名称是否一致
        if (selectedData.totalName === selectedData.partName) {
          productString = selectedData.totalName;
        } else {
          //总转和零部件名称不一致
          //将选择的自制件数据的总装物件名拼接成字符串
          productString = selectedData.partName;
        }
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
      operatingTicket.value.unit = selectedData.unitName;
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
      getHomeData();
    }
    if (productTypeName.value === "标准外购件") {
      getMaterialData();
    }
  } catch (error) {
    console.log(error);
  }
}
//重置搜素
function resetFilterProduct() {
  if (productTypeName.value === "自制件") {
    searchProduct.value = "00.00.00.00";
    searchProjectCode.value = "";
    productTablePage.value = 1;
    getHomeData();
  }
  if (productTypeName.value === "标准外购件") {
    searchProduct.value = "";
    productTablePage.value = 1;
    getMaterialData();
  }
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
        projectCode: searchProject.value,
        partName: searchName.value,
        totalCode: searchMac.value,
      }
    );
    if (!data.data.totalCount) return (productTableData.value = []);
    productTableData.value = data.data.pageList; //赋值
    productHeaders.value = homemadeHeaders.value; //给数据表头赋值相对应的值
  } catch (error) {
    console.log(error);
  }
}

//根据产品的项目号来筛选新增的产出料
async function showMcodeDialog() {
  try {
    selectedRows.value = [];
    productList();
    productTypeName.value = "自制件";
  } catch (error) {
    console.log(error);
  }
  mcodeDialog.value = true;
}

//搜素
async function filterNameProduct() {
  try {
    productList();
  } catch (error) {
    console.log(error);
  }
}
//重置搜素
function resetFilterNameProduct() {
  searchName.value = "";
  searchProject.value = "";
  searchMac.value = "";
  productList();
}
function clear() {
  selectedRows.value = [];
}
//选择数据批量创建工单明细产料名和项目号
let addDetailList = ref<any[]>([]);
async function saveMcodeProduct() {
  if (selectedRows.value.length === 0) {
    return setSnackbar("black", "请选择产出料，创建工单明细");
  }
  addDetailList.value = [];
  let date2: any = new Date();
  date2.setDate(date2.getDate() + 10);
  selectedRows.value.forEach((item: any) => {
    addDetailList.value.push({
      partName: item.partName,
      resultCode: item.resultCode,
      unitName: item.unitName,
      projectCode: item.projectCode,
      num: "",
      date: date2.toISOString().substring(0, 10),
      hour: 24,
    });
  });
  addDetailDialog2.value = true;
}

//文本规则、
//数字规则
const numberRule = ref<any>([
  (v: any) => /^\d+$/.test(v) || "只能填写数字且不为空",
]);
//日期规则
const dateRule = ref<any>([
  (v: any) =>
    /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/.test(
      v
    ) || "日期格式如“2023-10-01”",
]);
const rules = [
  (value: any) => {
    if (value) return true;
    return "不能为空";
  },
];
</script>

<template>
  <v-row class="ma-2">
    <!-- 左边工单表格 -->
    <v-col cols="6">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">工单头</v-toolbar>
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
              :items="workType"
              hide-details
              @keydown.enter="filterTableData()"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="最早计划 开始日期"
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
              label="最晚计划开始日期"
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
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="filterTableData()"
              >查询</v-btn
            >
            <v-btn color="red" class="mr-2" size="large" @click="resetFilter()">
              重置查询
            </v-btn>
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="resetAddDialog()"
              v-permission="
                `${router.currentRoute.value.fullPath}->addWorkOrder`
              "
            >
              新增工单
            </v-btn>
            <v-btn color="blue-darken-2" class="mr-2" size="large">导出</v-btn>
          </v-col>

          <v-col cols="12">
            <v-divider :thickness="3"></v-divider>

            <!-- 工单表头表格 -->
            <v-card style="overflow: auto; white-space: nowrap" height="610px">
              <v-list
                density="compact"
                v-for="(item, index) in tableData"
                :key="index"
                @click="showTicketDetail(item)"
                class="ma-2 elevation-2 rounded-lg"
              >
                <v-list-item>
                  <template v-slot:default>
                    <div class="d-flex">
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 30%"
                      >
                        产品描述：
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.product_description }}
                        </span>
                      </div>

                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 40%; font-weight: bold"
                      >
                        产品编码：
                        <span
                          class="text-black"
                          style="text-decoration: underline"
                        >
                          {{ item.product_id }}
                        </span>
                      </div>

                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 30%"
                      >
                        <div class="d-flex justify-end">
                          <v-icon
                            color="green"
                            size="small"
                            class="mr-3"
                            v-if="item.status === '新建未审核'"
                            @click.stop="
                              operatingTicket = { ...item };
                              auditDialog = true;
                            "
                            v-permission="
                              `${router.currentRoute.value.fullPath}->eyeWorkOrder`
                            "
                          >
                            fa-solid fa-eye
                          </v-icon>

                          <v-icon
                            color="blue"
                            size="small"
                            class="mr-3"
                            v-show="item.status === '新建未审核'"
                            @click.stop="
                              operatingTicket = { ...item };
                              editDialog = true;
                            "
                            v-permission="
                              `${router.currentRoute.value.fullPath}->updateWorkOrder`
                            "
                          >
                            fa-solid fa-pen
                          </v-icon>

                          <v-icon
                            color="red"
                            size="small"
                            v-show="item.status === '新建未审核'"
                            @click.stop="
                              operatingTicket = { ...item };
                              deleteDialog = true;
                            "
                            v-permission="
                              `${router.currentRoute.value.fullPath}->deleteWorkOrder`
                            "
                          >
                            fa-solid fa-trash
                          </v-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                </v-list-item>
                <v-list-item>
                  <template v-slot:default>
                    <div class="d-flex">
                      <div
                        class="text-body-3 text-blue-darken-1"
                        style="flex-basis: 25%"
                      >
                        计划开始:
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.scheduled_start_date }}
                        </span>
                      </div>
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 25%"
                      >
                        计划完成:
                        <span
                          style="text-decoration: underline"
                          :class="{
                            'text-red': isDatePast(
                              item.planned_completion_time
                            ),
                            'text-blue-grey-lighten-2': !isDatePast(
                              item.planned_completion_time
                            ),
                          }"
                        >
                          {{ item.planned_completion_time }}
                        </span>
                      </div>
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 25%"
                      >
                        实际开始：
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.start_date }}
                        </span>
                      </div>
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 25%"
                      >
                        实际完成:
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.finish_date }}
                        </span>
                      </div>
                    </div>
                  </template>
                </v-list-item>
                <v-list-item>
                  <template v-slot:default>
                    <div class="d-flex">
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 23%"
                      >
                        工单编号：
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.workorder_hid }}
                        </span>
                      </div>
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 15%"
                      >
                        类型：
                        <span
                          class=""
                          style="text-decoration: underline"
                          :class="{
                            'bg-purple text-white':
                              item.workorder_type === '机加',
                            'bg-light-green text-white':
                              item.workorder_type === '钣金',
                            'bg-grey text-white':
                              item.workorder_type === '电器装配',
                            'bg-light-blue text-white':
                              item.workorder_type === '模组装配',
                            'bg-black text-white':
                              item.workorder_type === '总装',
                            'bg-teal text-white':
                              item.workorder_type === '其他',
                          }"
                        >
                          {{ item.workorder_type }}
                        </span>
                      </div>
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 20%"
                      >
                        计划数量：
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.planned_quantity }} {{ item.unit }}
                        </span>
                      </div>

                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 25%"
                      >
                        审核日期:
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.approve_date }}
                        </span>
                      </div>
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 20%"
                      >
                        状态：
                        <span
                          class="text-blue-grey-lighten-1 font-weight-black"
                          style="text-decoration: underline"
                        >
                          {{ item.status }}
                        </span>
                      </div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
            <div class="text-center pt-2">
              <v-pagination
                v-model="tablePage"
                :length="tablePageCount"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- 右边明细表 -->
    <v-col cols="6">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6" v-if="detailName"
          >工单【{{ detailName }}】明细</v-toolbar
        >
        <v-toolbar class="text-h6 pl-6" v-else>工单明细</v-toolbar>
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
              color="blue-darken-2"
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
              color="blue-darken-2"
              class="mr-2"
              size="large"
              v-if="detailName && detailStatus !== '正常完工'"
              @click="resetAddDetailDialog()"
              v-permission="
                `${router.currentRoute.value.fullPath}->addWorkOrderDetail`
              "
              >新增明细</v-btn
            >
            <v-btn
              @click="batchWork()"
              class="mr-2"
              color="blue-darken-2"
              size="large"
              v-if="detailName && detailStatus !== '正常完工'"
              v-permission="
                `${router.currentRoute.value.fullPath}->batchWorkOrderDetail`
              "
              >批量工序维护</v-btn
            >
            <v-btn
              class="mr-2"
              color="blue-darken-2"
              size="large"
              v-if="detailName && detailStatus === '新建未审核'"
              @click="selectAll"
              >{{ selectName }}</v-btn
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
            <v-divider :thickness="3"></v-divider>
            <v-card style="overflow: auto; white-space: nowrap" height="610px">
              <v-list
                density="compact"
                v-for="(item, index) in tableDataDetail"
                :key="index"
                class="ma-2 elevation-3 rounded-lg d-flex align-center"
              >
                <v-checkbox
                  v-if="
                    (detailName &&
                      (detailStatus === '新建未审核' ||
                        detailStatus === '已审核待排产') &&
                      item.status === '新增未分配') ||
                    item.status === '已分配待排产'
                  "
                  style="max-width: 30px"
                  density="compact"
                  hide-details
                  color="blue"
                  class="ml-3"
                  v-model="selected"
                  :value="item"
                >
                </v-checkbox>
                <div class="w-100">
                  <v-list-item>
                    <template v-slot:default>
                      <div class="d-flex">
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 20%"
                        >
                          产出料：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.mdescription }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 40%; font-weight: bold"
                        >
                          图纸号：
                          <span
                            class="text-black"
                            style="text-decoration: underline"
                          >
                            {{ item.mcode }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 30%"
                        >
                          工单明细编号：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.workorder_did }}
                          </span>
                        </div>

                        <div class="text-body-2 text-blue-darken-1">
                          <div class="d-flex justify-end">
                            <v-icon
                              color="blue"
                              size="small"
                              class="mr-4"
                              v-show="
                                !item.mdescription.includes('已拆批') &&
                                !item.mdescription.includes('批次工单') &&
                                item.status !== '正常完工'
                              "
                              @click="
                                operatingTicketDetail = { ...item };
                                splitDetailDialog = true;
                              "
                              v-permission="
                                `${router.currentRoute.value.fullPath}->splitWorkOrderDetail`
                              "
                            >
                              fa-solid fa-network-wired
                            </v-icon>
                            <v-icon
                              color="blue"
                              size="small"
                              class="mr-4"
                              v-show="
                                item.status === '已分配待排产' ||
                                item.status === '新增未分配'
                              "
                              @click="
                                operatingTicketDetail = { ...item };
                                editDetailDialog = true;
                              "
                              v-permission="
                                `${router.currentRoute.value.fullPath}->updateWorkOrderDetail`
                              "
                            >
                              fa-solid fa-pen
                            </v-icon>

                            <v-icon
                              color="red"
                              size="small"
                              v-show="
                                item.status === '已分配待排产' ||
                                item.status === '新增未分配'
                              "
                              @click="
                                operatingTicketDetail = { ...item };
                                deleteDetailDialog = true;
                              "
                              v-permission="
                                `${router.currentRoute.value.fullPath}->deleteWorkOrderDetail`
                              "
                            >
                              fa-solid fa-trash
                            </v-icon>
                          </div>
                        </div>
                      </div>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:default>
                      <div class="d-flex">
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          项目号：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.project_code }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          状态：
                          <span
                            class="text-blue-grey-lighten-1 font-weight-black"
                            style="text-decoration: underline"
                          >
                            {{ item.status }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          预计交付：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.estimated_delivery_date }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          实际交付：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.actual_delivery_date }}
                          </span>
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:default>
                      <div class="d-flex">
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          计划数量：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.planned_quantity }}{{ item.unit }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          报工数量：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.reported_quantity }}{{ item.unit }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          标准工时：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.standard_time }}
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          实际工时：
                          <span
                            class="text-blue-grey-lighten-2"
                            style="text-decoration: underline"
                          >
                            {{ item.actual_time }}
                          </span>
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:default>
                      <div class="d-flex">
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          工序：
                          <span>
                            <v-btn
                              v-permission="
                                `${router.currentRoute.value.fullPath}->ProcessWorkOrderDetail`
                              "
                              :disabled="
                                item.status !== '已分配待排产' &&
                                item.status !== '新增未分配'
                              "
                              size="small"
                              @click="showProcessDialog(item)"
                              :color="item.procedure ? 'green' : 'grey'"
                              >{{ item.procedure ? "可维护" : "未维护" }}
                              <v-tooltip activator="parent" location="top">{{
                                item.procedure
                              }}</v-tooltip>
                            </v-btn>
                          </span>
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 25%"
                        >
                          BOM清单：
                          <span>
                            <v-btn
                              disabled
                              size="small"
                              @click="handleBomClick(item)"
                              color="grey"
                              >{{ item.bomdata ? "可维护" : "未维护" }}
                              <v-tooltip activator="parent" location="top">{{
                                item.bomdata
                              }}</v-tooltip>
                            </v-btn></span
                          >
                        </div>
                        <div
                          class="text-body-2 text-blue-darken-1"
                          style="flex-basis: 35%"
                        >
                          图纸号：
                          <span>
                            <v-btn
                              disabled
                              size="small"
                              @click="handleBlueprintClick(item)"
                              color="grey"
                              >{{ item.blueprint_id ? "可维护" : "未维护" }}
                              <v-tooltip activator="parent" location="top">{{
                                item.blueprint_id
                              }}</v-tooltip>
                            </v-btn>
                          </span>
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                </div>
              </v-list>
            </v-card>
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
          <v-btn @click="addDialog = false">
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
            :items="workType"
            multiple
            v-model="workOrderType"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.planned_quantity"
            label="计划数量"
            :rules="numberRule"
          ></v-text-field>

          <v-text-field
            label="计划开始日期"
            :rules="dateRule"
            v-model="operatingTicket.scheduled_start_date"
            type="date"
          />

          <v-text-field
            label="计划完成日期"
            :rules="dateRule"
            v-model="operatingTicket.planned_completion_time"
            type="date"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addTicket()"
          >
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
            :items="workType"
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

          <v-text-field
            v-model="operatingTicket.scheduled_start_date"
            :rules="dateRule"
            label="计划开始日期"
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
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editTicket()"
          >
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
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="deleteTicket()"
          >
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
      <v-form @submit.prevent>
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
              v-model="operatingTicketDetail.mdescription"
              label="产出料"
              :rules="rules"
              append-inner-icon="fa-regular fa-hand-pointer"
              @click:append-inner="showMcodeDialog"
            ></v-text-field>

            <v-text-field
              v-model="operatingTicketDetail.estimated_delivery_date"
              :rules="dateRule"
              label="预计交付时间"
              type="date"
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
          </v-card-text>

          <div class="d-flex justify-end mr-6 mb-4">
            <v-btn
              type="submit"
              color="blue-darken-2"
              size="large"
              class="mr-2"
            >
              确认新增
            </v-btn>
            <v-btn color="grey" size="large" @click="addDetailDialog = false">
              取消
            </v-btn>
          </div>
        </v-card>
      </v-form>
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
            color="blue-darken-2"
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
            color="blue-darken-2"
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
          <v-col cols="5">
            <v-card flat height="350px" style="overflow-y: auto">
              <v-card-subtitle>单工序</v-card-subtitle>
              <div class="d-flex flex-wrap">
                <v-chip
                  v-for="(item, index) in chips"
                  :key="index"
                  class="px-6 py-3 ma-1"
                  :class="{ 'list-item-active': clickIndex >= 0 }"
                  text-color="white"
                  @click="reduceProcedure(item)"
                >
                  {{ item.rsv2 }}
                </v-chip>
              </div>
            </v-card>
          </v-col>
          <v-col cols="7">
            <v-card height="350px" style="overflow-y: auto" flat>
              <v-card-subtitle>常用工序组合</v-card-subtitle>
              <v-list>
                <v-list-item
                  v-for="(item, index) in produceGroups"
                  :key="index"
                  class="text-h6 mx-auto"
                  @click="commonProduce(item)"
                >
                  {{ index + 1 }}. {{ item.rsv2 }}
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="d-flex justify-end mr-6 mb-4" v-if="clickIndex >= 0">
              <v-btn
                color="blue-darken-2"
                size="large"
                class="mr-2"
                @click="saveComUsedProduce()"
              >
                保存工序组
              </v-btn>
              <v-btn color="grey" size="large" @click="cancel()"> 取消 </v-btn>
            </div>
            <v-card height="350px" style="overflow-y: auto">
              <v-card-subtitle>已选的工艺路线</v-card-subtitle>

              <v-list>
                <v-list-item
                  v-for="(item, index) in droppedChips"
                  :key="index"
                  :class="{ 'list-item-active': clickIndex === index }"
                >
                  <v-list-item-title
                    ><template v-slot:default>
                      <div class="d-flex">
                        <div style="flex-basis: 30%">
                          {{ index + 1 + "." + item.rsv2 }}
                        </div>

                        <div style="flex-basis: 20%">
                          是否委外：
                          <v-switch
                            v-model="item.rsv1"
                            hide-details
                            color="red"
                            true-value="Y"
                            false-value="N"
                          ></v-switch>
                        </div>
                        <div style="flex-basis: 20%">
                          是否质检：
                          <v-switch
                            v-model="item.rsv3"
                            hide-details
                            color="red"
                            true-value="Y"
                            false-value="N"
                          ></v-switch>
                        </div>
                      </div> </template
                  ></v-list-item-title>
                  <v-divider :thickness="1"></v-divider>
                  <template v-slot:append>
                    <div class="d-flex">
                      <v-icon
                        v-if="item.config_type === '单工序'"
                        v-show="clickIndex < 0"
                        @click="addName(item, index)"
                        >fa-solid fa-pen-to-square
                      </v-icon>
                      <v-icon
                        v-show="clickIndex < 0"
                        @click="removeProceDureGroup(item)"
                        class="ml-2"
                      >
                        fa-solid fa-xmark
                      </v-icon>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="saveTicket()"
          >
            保存工艺路线
          </v-btn>
          <v-btn color="grey" size="large" @click="cancelProcess()">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 产品编号类型 -->
    <v-dialog v-model="productDialog" min-width="1400px" width="1000px">
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
            <v-col cols="4">
              <v-text-field
                label="项目号查询"
                variant="outlined"
                density="compact"
                v-model="searchProjectCode"
                hide-details
                clearable
                @keydown.enter="filterProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="查询所有信息"
                variant="outlined"
                density="compact"
                v-model="searchProduct"
                hide-details
                clearable
                @keydown.enter="filterProduct()"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
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
                color="blue-darken-2"
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
                :items="[10, 20]"
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
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="saveProduct()"
          >
            确定
          </v-btn>
          <v-btn color="grey" size="large" @click="productDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 工单明细产出料 -->
    <v-dialog v-model="mcodeDialog" min-width="1400px" width="1000px">
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
                v-model="searchProject"
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

            <v-col cols="3">
              <v-select
                variant="outlined"
                density="compact"
                label="当前产品类别"
                :items="['自制件', '标准外购件']"
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
              <v-btn color="red" class="mr-2" size="large" @click="clear()">
                清空选择
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
              <v-data-table
                hover
                :items-per-page="10"
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
          <v-btn color="grey" size="large" @click="mcodeDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 检查新建明细 -->
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
                label="产品名称"
                variant="outlined"
                density="compact"
                readonly
                v-model="item.partName"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="产品编码"
                readonly
                variant="outlined"
                density="compact"
                v-model="item.resultCode"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="数量"
                variant="outlined"
                density="compact"
                v-model="item.num"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="单位"
                variant="outlined"
                density="compact"
                v-model="item.unitName"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="交付日期"
                type="date"
                variant="outlined"
                density="compact"
                v-model="item.date"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="工时"
                variant="outlined"
                density="compact"
                v-model="item.hour"
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
            v-model="operatingTicket.scheduled_start_date"
            label="计划开始日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.planned_completion_time"
            label="计划完成日期"
            readonly
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="auditTicket()"
          >
            审核通过
          </v-btn>
          <v-btn color="grey" size="large" @click="auditDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 备用 -->
    <v-dialog v-model="dialog">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 备用 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <nuxt-page> </nuxt-page>
      </v-card>
    </v-dialog>
    <!-- 拆分明细数据 -->
    <v-dialog v-model="splitDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 拆分明细数据 </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon @click="splitDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="当前明细行总数量"
                readonly
                v-model="operatingTicketDetail.planned_quantity"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="oldData"
                label="拆分后明细行剩余数量"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="nowData"
                label="批次工单明细行数量"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="splitTicket()"
          >
            保存
          </v-btn>
          <v-btn color="grey" size="large" @click="splitDetailDialog = false">
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
.list-item-active {
  background-image: linear-gradient(25deg, #bbdefb, #bbdefb, #bbdefb, #bbdefb);
  color: black !important;
}
</style>
