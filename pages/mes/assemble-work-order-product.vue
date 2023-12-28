<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "装配工单",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "装配工单",
  // 该页面的描述
  description: "同日 MES 系统，装配工单",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，装配工单",
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
let units = ref<any[]>([
  { id: "1", name: "PCS" },
  { id: "2", name: "米" },
  { id: "3", name: "毫米" },
  { id: "4", name: "张" },
  { id: "5", name: "KG" },
  { id: "6", name: "瓶（桶）" },
  { id: "7", name: "盒（包）" },
  { id: "8", name: "双（对）" },
  { id: "9", name: "平方米" },
  { id: "10", name: "卷" },
  { id: "11", name: "台" },
  { id: "12", name: "套" },
  { id: "13", name: "件" },
  { id: "14", name: "根" },
  { id: "15", name: "个" },
  { id: "16", name: "袋" },
  { id: "17", name: "立方" },
  { id: "18", name: "升" },
  { id: "19", name: "支" },
  { id: "20", name: "箱" },
  { id: "21", name: "盒" },
  { id: "22", name: "节" },
  { id: "23", name: "把" },
  { id: "24", name: "片" },
  { id: "25", name: "公斤" },
  { id: "26", name: "千公斤" },
  { id: "27", name: "包" },
  { id: "28", name: "本" },
]);
//工单类型
let workType = ref<any[]>(["电器装配", "模组装配", "总装", "其他"]);

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
let productDialog = ref(false);
let auditDialog = ref(false);
let processDialog = ref(false);
let addHomeDialog = ref<boolean>(false);
// 工单搜索
let searchTicketNumber = ref<string>("");

let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);
let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 2);
let startDate = ref<any>(null);
let endDate = ref<any>(null);

let searchTicketStatus = ref<string>("");
let searchTicketType = ref("总装");
watch(searchTicketType, function () {
  getWorkOrder();
});
let searchProduct = ref<string>("");
let searchProjectCode = ref<string>("");

// 正在操作的工单
let operatingTicket = ref<any>(null);
//正在操作的工单明细
let operatingTicketDetail = ref<any>(null);
//工单表按照开始时间进行降序排序
// 展示的工单表格数据
let tableData = ref<any[]>([]);
//工单明细表格展示的数据

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
  { title: "部门", align: "start", key: "projectCompany" },
  { title: "类型", align: "start", key: "projectType" },
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
    let tabArr2 = ref<any[]>([]);
    innerTableSelectData.value.forEach((item) => {
      tabArr2.value.push({
        id: item.did,
        bomdata: item.bomdata,
        estimated_delivery_date: item.estimated_delivery_date,
        mcode: item.mcode,
        mdescription: item.mdescription,
        blueprint_id: item.blueprint_id,
        standard_time: item.standard_time,
        actual_time: item.actual_time,
        procedure: item.procedure,
        planned_quantity: item.planned_quantity,
        reported_quantity: item.reported_quantity,
        unit: item.unit,
        project_code: item.project_code,
        workorder_hid: item.workorder_hid,
        workorder_did: item.workorder_did,
        actual_delivery_date: item.actual_delivery_date,
        status: item.status,
      });
    });

    await useHttp(
      "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
      "put",
      tabArr2.value
    );

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
  searchTicketType.value = "总装";
  startDate.value = nowDate.toISOString().substring(0, 10);
  endDate.value = oldDate.toISOString().substring(0, 10);

  tablePage.value = 1;
  getWorkOrder();
}

//页面加载时获取数据
onMounted(async () => {
  startDate.value = nowDate.toISOString().substring(0, 10);
  endDate.value = oldDate.toISOString().substring(0, 10);
  getWorkOrder();
});

//获取工单数据
async function getWorkOrder() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M88GetWorkOrderList",
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

//通过监听当前操作的工单编号是否改变，来显示右边的工单明细数据

// 新增工单前重置新增对话框
function resetAddDialog() {
  operatingTicket.value = {
    workorder_type: "总装",
    product_id: "",
    planned_quantity: 1,
    product_description: "",
    scheduled_start_date: new Date().toISOString().slice(0, 10),
    planned_completion_time: "",
    unit: "套",
    status: "新建未审核",
  };
  operatingTicketDetail.value = {
    estimated_delivery_date: null,
    mcode: "",
    mdescription: "",
    blueprint_id: "",
    standard_time: 0,
    actual_time: 0,
    procedure: null,
    planned_quantity: 0,
    reported_quantity: 0,
    unit: "",
    project_code: "",
    workorder_hid: "",
    actual_delivery_date: null,
    status: "新增未分配",
  };
  addDialog.value = true;
}

// 新增工单
async function addTicket() {
  try {
    if (!operatingTicket.value.product_description) {
      return setSnackbar("black", "请您输入产品描述");
    }
    if (!operatingTicket.value.planned_completion_time) {
      return setSnackbar("black", "请您选择计划完成时间");
    }

    const data: any = await useHttp("/MesWorkOrder/M02AddWorkOrder", "post", [
      operatingTicket.value,
    ]);
    //给工单明细对象赋值
    operatingTicketDetail.value = {
      mcode: operatingTicket.value.product_id,
      mdescription: operatingTicket.value.product_description,
      project_code: operatingTicket.value.product_id.slice(-9),
      estimated_delivery_date: operatingTicket.value.planned_completion_time,
      blueprint_id: "",
      standard_time: operatingTicketDetail.value.standard_time,
      actual_time: "0",
      procedure: null,
      planned_quantity: operatingTicket.value.planned_quantity,
      reported_quantity: "0",
      unit: operatingTicket.value.unit,
      workorder_hid: data.data[0],
      actual_delivery_date: null,
      status: "新增未分配",
    };
    const data2: any = await useHttp(
      "/MesWorkOrderDetail/M06AddWorkOrderDetails",
      "post",
      [operatingTicketDetail.value]
    );
    if (data.code === 200 && data2.code === 200) {
      setSnackbar("green", "新增成功");
      addDialog.value = false;
      await getWorkOrder();
    } else {
      setSnackbar("black", "新增失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "新增失败");
  }
}
//修改前的对话框
function showEdit(item: any) {
  operatingTicket.value = {
    id: item.id,
    workorder_hid: item.workorder_hid,
    workorder_type: item.workorder_type,
    product_id: item.product_id,
    planned_quantity: item.planned_quantity,
    product_description: item.product_description,
    scheduled_start_date: item.scheduled_start_date,
    planned_completion_time: item.planned_completion_time,
    unit: item.unit,
    status: item.status,
  };
  operatingTicketDetail.value = {
    id: item.did,
    bomdata: item.bomdata,
    estimated_delivery_date: item.estimated_delivery_date.substring(0, 10),
    mcode: item.mcode,
    mdescription: item.mdescription,
    blueprint_id: item.blueprint_id,
    standard_time: item.standard_time,
    actual_time: item.actual_time,
    procedure: item.procedure,
    planned_quantity: item.planned_quantity,
    reported_quantity: item.reported_quantity,
    unit: item.unit,
    project_code: item.project_code,
    workorder_hid: item.workorder_hid,
    workorder_did: item.workorder_did,
    actual_delivery_date: item.actual_delivery_date,
    status: item.status,
  };

  editDialog.value = true;
}

// 修改工单
async function editTicket() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
      "put",
      [operatingTicket.value]
    );
    operatingTicketDetail.value = {
      id: operatingTicketDetail.value.id,
      workorder_did: operatingTicketDetail.value.workorder_did,
      workorder_hid: operatingTicketDetail.value.workorder_hid,
      bomdata: operatingTicketDetail.value.bomdata,
      mcode: operatingTicketDetail.value.mcode,
      project_code: operatingTicketDetail.value.project_code,
      mdescription: operatingTicketDetail.value.mdescription,
      estimated_delivery_date: operatingTicket.value.planned_completion_time,
      blueprint_id: operatingTicketDetail.blueprint_id,
      standard_time: operatingTicketDetail.value.standard_time,
      actual_time: operatingTicketDetail.value.actual_time,
      procedure: operatingTicketDetail.value.procedure,
      planned_quantity: operatingTicket.value.planned_quantity,
      reported_quantity: operatingTicketDetail.value.reported_quantity,
      unit: operatingTicket.value.unit,
      actual_delivery_date: operatingTicketDetail.value.actual_delivery_date,
      status: operatingTicketDetail.value.status,
    };
    const data2: any = await useHttp(
      "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
      "put",
      [operatingTicketDetail.value]
    );
    if (data.code === 200 && data2.code === 200) {
      setSnackbar("green", "修改成功");
      editDialog.value = false;
      getWorkOrder();
    } else {
      setSnackbar("black", "修改失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "修改失败");
  }
}
//打开审核弹框
function showAudit(item: any) {
  operatingTicket.value = {
    id: item.id,
    finish_date: item.finish_date,
    workorder_hid: item.workorder_hid,
    workorder_type: item.workorder_type,
    product_id: item.product_id,
    planned_quantity: item.planned_quantity,
    product_description: item.product_description,
    scheduled_start_date: item.scheduled_start_date,
    planned_completion_time: item.planned_completion_time,
    unit: item.unit,
    status: item.status,
  };
  auditDialog.value = true;
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
    searchProduct.value = "";
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
  searchProduct.value = "";
  searchProjectCode.value = "";
  productTablePage.value = 1;
  if (productTypeName.value === "自制件") {
    getHomeData();
  }
  if (productTypeName.value === "标准外购件") {
    getMaterialData();
  }
}
//自制件对象
let homeInfo = ref<any>(null);
let projectCompany = ref<any[]>([
  "自动化",
  "孚鼎泰",
  "机器人",
  "AGV",
  "研究院",
  "云联",
  "安徽",
]);
let projectType = ref<any[]>([
  "智能制造",
  "输送分拣",
  "研发",
  "售后",
  "内部委托",
]);
function addHome() {
  homeInfo.value = {
    partCode: "88.88.88.88A",
    partName: "",
    projectCode: "",
    projectCompany: "云联",
    projectType: "智能制造",
    resultCode: "",
    totalCode: "",
    totalName: "",
    unitCode: "",
    unitName: { id: "12", name: "套" },
  };
  addHomeDialog.value = true;
}

//调用接口新增自制件
async function addHomeInfo() {
  homeInfo.value = {
    partCode: homeInfo.value.partCode,
    partName: homeInfo.value.totalName,
    projectCode: homeInfo.value.projectCode,
    projectCompany: homeInfo.value.projectCompany,
    projectType: homeInfo.value.projectType,
    resultCode: "",
    totalCode: "",
    totalName: homeInfo.value.totalName,
    unitCode: homeInfo.value.unitName.id,
    unitName: homeInfo.value.unitName.name,
  };
  const data: any = await useHttp(
    "/MaterialForm/M89InsertHomemadeForm",
    "post",
    homeInfo.value
  );
  if (data.code === 200) {
    setSnackbar("green", "新增成功");
    addHomeDialog.value = false;
    getHomeData();
  } else {
    setSnackbar("black", "新增失败");
  }
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
    <!--工单表格 -->
    <v-col cols="12">
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
                `${router.currentRoute.value.fullPath}->addWorkOrder2`
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
                class="ma-2 elevation-2 rounded-lg"
              >
                <v-list-item>
                  <template v-slot:default>
                    <div class="d-flex">
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 20%"
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
                        style="flex-basis: 30%; font-weight: bold"
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
                            @click.stop="showAudit(item)"
                            v-permission="
                              `${router.currentRoute.value.fullPath}->eyeWorkOrder2`
                            "
                          >
                            fa-solid fa-eye
                          </v-icon>

                          <v-icon
                            color="blue"
                            size="small"
                            class="mr-3"
                            v-show="item.status === '新建未审核'"
                            @click.stop="showEdit(item)"
                            v-permission="
                              `${router.currentRoute.value.fullPath}->updateWorkOrder2`
                            "
                          >
                            fa-solid fa-pen
                          </v-icon>

                          <v-icon
                            color="red"
                            size="small"
                            @click.stop="
                              operatingTicket = { ...item };
                              deleteDialog = true;
                            "
                            v-show="item.status === '新建未审核'"
                            v-permission="
                              `${router.currentRoute.value.fullPath}->deleteWorkOrder2`
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
                        style="flex-basis: 15%"
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
                        style="flex-basis: 15%"
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
                        style="flex-basis: 15%"
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
                        style="flex-basis: 15%"
                      >
                        实际完成:
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.finish_date }}
                        </span>
                      </div>

                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 15%"
                      >
                        审核日期:
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.approve_date }}
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
                        style="flex-basis: 15%"
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
                        style="flex-basis: 15%"
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
                        style="flex-basis: 15%"
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
                        style="flex-basis: 15%"
                      >
                        实际工时：
                        <span
                          class="text-blue-grey-lighten-2"
                          style="text-decoration: underline"
                        >
                          {{ item.actual_time }}
                        </span>
                      </div>

                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 15%"
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
                <v-list-item>
                  <template v-slot:default>
                    <div class="d-flex">
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 15%"
                      >
                        工序：
                        <span>
                          <v-btn
                            :disabled="
                              item.status !== '已审核待排产' &&
                              item.status !== '新建未审核'
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
                        style="flex-basis: 15%"
                      >
                        BOM清单：
                        <span>
                          <v-btn disabled size="small" color="grey"
                            >{{ item.bomdata ? "可维护" : "未维护" }}
                            <v-tooltip activator="parent" location="top">{{
                              item.bomdata
                            }}</v-tooltip>
                          </v-btn></span
                        >
                      </div>
                      <div
                        class="text-body-2 text-blue-darken-1"
                        style="flex-basis: 15%"
                      >
                        图纸号：
                        <span>
                          <v-btn disabled size="small" color="grey"
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
            item-title="name"
          ></v-select>
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

          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
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
          <v-select
            label="单位"
            :items="units"
            v-model="operatingTicket.unit"
            item-title="name"
          ></v-select>
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
          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
          ></v-text-field>
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
              <v-btn
                color="blue-darken-2"
                class="mr-2"
                size="large"
                @click="addHome()"
              >
                新增自制件
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
    <!-- 新增自制件弹框 -->
    <v-dialog v-model="addHomeDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增自制件 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addHomeDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            label="总装物料名"
            v-model="homeInfo.totalName"
          ></v-text-field>
          <v-select
            label="单位"
            v-model="homeInfo.unitName"
            :items="units"
            item-title="name"
            return-object
          ></v-select>
          <v-text-field
            v-model="homeInfo.projectCode"
            label="项目号"
          ></v-text-field>
          <v-select
            v-model="homeInfo.projectCompany"
            label="部门"
            :items="projectCompany"
          ></v-select>
          <v-select
            v-model="homeInfo.projectType"
            label="类型"
            :items="projectType"
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addHomeInfo()"
          >
            确定新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addHomeDialog = false">
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
