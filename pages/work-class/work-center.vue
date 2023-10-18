<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "工作中心",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工作中心",
  // 该页面的描述
  description: "同日 MES 系统，工作中心",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，工作中心",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});

// 表格所有数据
let workCenterList = ref<any[]>([]);
// 表格当前页
let showingPage = ref<number>(1);
// 表格总页数
let totalPageCount = ref<number>(0);
// 表格总页数
const workCenterCount = computed(() => {
  return Math.ceil(totalPageCount.value / 15);
});
// 查询条件
let searchWorkCenterId = ref<string | undefined>(undefined);
let searchWorkCenterName = ref<string | undefined>(undefined);
let searchType = ref<string | undefined>(undefined);
let searchWorkCenterAddress = ref<string | undefined>(undefined);
let searchCreator = ref<string | undefined>(undefined);
let searchStartCreateTime = ref<string | undefined>(undefined);
let searchEndCreateTime = ref<string | undefined>(undefined);
let searchUpdatePerson = ref<string | undefined>(undefined);
let searchStartUpdateTime = ref<string | undefined>(undefined);
let searchEndUpdateTime = ref<string | undefined>(undefined);

// 定义工作中心表头字段
let headers = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心编号",
    key: "work_center_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心名称",
    key: "work_center_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心类型",
    key: "type",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心地址",
    key: "work_center_address",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否废弃",
    key: "isdelete",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建人",
    key: "creator",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建时间",
    key: "create_time",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新时间",
    key: "update_time",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新人",
    key: "update_person",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);
// 对话框
let dialogAdd = ref<boolean>(false);
let dialogUpdate = ref<boolean>(false);
let dialogDelete = ref<boolean>(false);

// 正在操作的表格数据行
let operateRow = ref<any>(null);
let workCenterId = ref<string>(""); //存储工作中心编号的字段
onMounted(function () {
  // 页面渲染完成时，加载表格所有数据
  getWorkCenterList();
  getMachineData();
  getWorkCenterDetail();
});
watch(showingPage, function () {
  getWorkCenterList();
});
//获取数据
async function getWorkCenterList() {
  const data = await useHttp(
    "/WorkCenter/M13WorkCenterList",
    "get",
    undefined,
    {
      work_center_id: searchWorkCenterId.value,
      work_center_name: searchWorkCenterName.value,
      type: searchType.value,
      work_center_address: searchWorkCenterAddress.value,
      start_date_create: searchStartCreateTime.value,
      end_date_create: searchEndCreateTime.value,
      start_date_update: searchStartUpdateTime.value,
      end_date_update: searchEndUpdateTime.value,
      creator: searchCreator.value,
      update_person: searchUpdatePerson.value,
      PageIndex: showingPage.value,
      PageSize: 15,
      SortedBy: "id",
      SortType: 0,
    }
  );
  workCenterList.value = data.data.pageList.map((item: any) => {
    item.create_time = item.create_time.substring(0, 10);
    item.update_time = item.update_time.substring(0, 10);
    if (item.isdelete) {
      item.isdelete = "是";
    } else {
      item.isdelete = "否";
    }
    return item;
  });
  totalPageCount.value = data.data.totalCount;
}
//按条件查询数据
function searchWorkCenterList() {
  showingPage.value = 1;
  getWorkCenterList();
}
// 重置搜索
function resetSearch() {
  searchWorkCenterId.value = undefined;
  searchWorkCenterName.value = undefined;
  searchType.value = undefined;
  searchWorkCenterAddress.value = undefined;
  searchCreator.value = undefined;
  searchStartCreateTime.value = undefined;
  searchEndCreateTime.value = undefined;
  searchStartUpdateTime.value = undefined;
  searchEndUpdateTime.value = undefined;
  searchUpdatePerson.value = undefined;
  workCenterId.value = "";
  getWorkCenterList();
}
// 重置正在操作的行数据
function resetRow() {
  operateRow.value = {
    work_center_id: undefined,
    type: undefined,
    work_center_name: undefined,
    work_center_address: undefined,
  };
}
// 添加工作中心
async function addWorkCenter() {
  await useHttp("/WorkCenter/M14AddWorkCenter", "post", {
    work_center_id: operateRow.value.work_center_id,
    type: operateRow.value.type,
    work_center_name: operateRow.value.work_center_name,
    work_center_address: operateRow.value.work_center_address,
  });
  // 重新渲染表格
  getWorkCenterList();
  // 关闭对话框
  dialogAdd.value = false;
}
// 修改工作中心
async function updateWorkCenter() {
  await useHttp("/WorkCenter/M15UpdateWorkCenter", "put", {
    id: operateRow.value.id,
    work_center_id: operateRow.value.work_center_id,
    type: operateRow.value.type,
    work_center_name: operateRow.value.work_center_name,
    work_center_address: operateRow.value.work_center_address,
  });
  // 重新渲染表格
  getWorkCenterList();
  // 关闭对话框
  dialogUpdate.value = false;
}
// 删除工作中心
async function deleteWorkCenter() {
  await useHttp("/WorkCenter/M25DeleteWorkCenter", "delete", undefined, {
    ids: operateRow.value.id,
  });
  // 重新渲染表格
  getWorkCenterList();
  // 关闭对话框
  dialogDelete.value = false;
}
//点击筛选当前工作中心的设备和工位
function getMachineList(item: any, obj: any) {
  workCenterId.value = obj.item.raw.work_center_id;
  asCode.value = "";
}
watch(workCenterId, function () {
  machinePage.value = 1;
  workCenterDetailPage.value = 1;
  getMachineData();
  getWorkCenterDetail();
});

//设备信息
// 设备表格所有数据
let machineList = ref<any[]>([]);
//存储行政编码的字段
let asCode = ref<string>("");
//设备对象
let operateMachine = ref<any>();
// 表格当前页
let machinePage = ref<number>(1);
watch(machinePage, function () {
  getMachineData();
});
// 数据库一共有多少条数据
let machineTotalPageCount = ref<number>(0);
// 表格总页数
const machineTablePageCount = computed(() => {
  return Math.ceil(machineTotalPageCount.value / 10);
});
//定义设备信息的表头
let machineHeaders = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "行政编码",
    key: "administrative_code",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "固定资产名称",
    key: "machine_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "使用部门",
    key: "user_department",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "使用人",
    key: "user",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "购入日期",
    key: "purchase_date",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "规格型号",
    key: "equipment_type",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "领用时间",
    key: "receive_time",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "放置位置",
    key: "machine_site",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);
//获取数据
async function getMachineData() {
  try {
    const data: any = await useHttp(
      "/MesMachine/M35GetMesMachine",
      "get",
      undefined,
      {
        work_center_id: workCenterId.value,
        administrative_code: codeSearch.value,
        machine_name: machineNameSearch.value,
        user: userNameSearch.value,
        PageIndex: machinePage.value,
        PageSize: 10,
        SortedBy: "id",
        SortType: 1,
      }
    );
    machineList.value = data.data.pageList.map((item: any) => {
      item.purchase_date = item.purchase_date.substring(0, 10);
      item.receive_time = item.receive_time.substring(0, 10);
      return item;
    });
    machineTotalPageCount.value = data.data.totalCount;
  } catch (error) {
    console.log(error);
  }
}

//搜素操作
let codeSearch = ref("");
let machineNameSearch = ref("");
let userNameSearch = ref("");
//搜素操作
function getMachineSearch() {
  machinePage.value = 1;
  getMachineData();
}
//重置搜素
function resetMachineSearch() {
  machinePage.value = 1;
  asCode.value = "";
  (codeSearch.value = ""),
    (machineNameSearch.value = ""),
    (userNameSearch.value = "");
  getMachineData();
}
let dialogAddMachine = ref<boolean>(false);
let dialogUpdateMachine = ref<boolean>(false);
let dialogDeleteMachine = ref<boolean>(false);
//新增设备
//重置新增文本框
function showAddMachineDialog() {
  operateMachine.value = {
    user: "",
    purchase_date: "",
    user_department: "",
    administrative_code: "",
    work_center_id: workCenterId.value,
    machine_name: "",
    machine_site: "",
    equipment_type: "",
    receive_time: "",
  };
}
//确认新增
async function addMachine() {
  try {
    const data: any = await useHttp(
      "/MesMachine/M36AddMesMachine",
      "post",
      operateMachine.value
    );
    getMachineData();
  } catch (error) {
    console.log(error);
  }
  dialogAddMachine.value = false;
}
//修改设备信息
async function upDateMachine() {
  try {
    const data: any = await useHttp(
      "/MesMachine/M37UpdateMesMachine",
      "put",
      operateMachine.value
    );
    getMachineData();
  } catch (error) {
    console.log(error);
  }
  dialogUpdateMachine.value = false;
}
//删除设备信息
async function deleteMachine() {
  try {
    const data: any = await useHttp(
      "/MesMachine/M38DeleteMesMachine",
      "delete",
      undefined,
      {
        workorder_ids: operateMachine.value.id,
      }
    );
    getMachineData();
  } catch (error) {
    console.log(error);
  }
  dialogDeleteMachine.value = false;
}
//点击获取行政编码
function getWorkCenterDetailList(item: any, obj: any) {
  asCode.value = obj.item.raw.administrative_code;
}
watch(asCode, function () {
  workCenterDetailPage.value = 1;
  getWorkCenterDetail();
});

//工位信息
//工位表格的所有数据
let workCenterDetailList = ref<any[]>([]);
//工位对象
let operateWorkCenterDetail = ref<any>(null);
//当前页数
let workCenterDetailPage = ref<number>(1);
watch(workCenterDetailPage, function () {
  getWorkCenterDetail();
});
//数据库里面的全部数据条数
let workCenterDetailCount = ref<number>(0);
//数据一共有多少页
const workCenterDetailPageCount = computed(() => {
  return Math.ceil(workCenterDetailCount.value / 10);
});
//定义工位表头
let workCenterDetailHeaders = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心编号",
    key: "work_center_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "行政编码",
    key: "administrative_code",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工位编号",
    key: "station_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工位名称",
    key: "station_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "员工编号",
    key: "employee_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "员工名称",
    key: "employee_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    filterable: true,
  },
]);
//获取数据
//获取数据
async function getWorkCenterDetail() {
  try {
    const data: any = await useHttp(
      "/WorkCenterDetail/M54WorkCenterDetailList",
      "get",
      undefined,
      {
        work_center_id: workCenterId.value,
        administrative_code: asCode.value,
        station_name: stationNameSearch.value,
        employee_name: employeeNameSearch.value,
        PageIndex: workCenterDetailPage.value,
        PageSize: 10,
        SortedBy: "id",
        SortType: 1,
      }
    );
    workCenterDetailList.value = data.data.pageList;
    workCenterDetailCount.value = data.data.totalCount;
  } catch (error) {
    console.log(error);
  }
}

//搜素操作
let stationNameSearch = ref<string>("");
let employeeNameSearch = ref<string>("");
//搜素操作
function searchWorkCenterDetail() {
  workCenterDetailPage.value = 1;
  getWorkCenterDetail();
}
//重置搜素
function resetSearchWorkCenterDetail() {
  stationNameSearch.value = "";
  employeeNameSearch.value = "";
  workCenterDetailPage.value = 1;
  getWorkCenterDetail();
}
let dialogAddDetail = ref<boolean>(false);
let dialogUpdateDetail = ref<boolean>(false);
let dialogDeleteDetail = ref<boolean>(false);
//新增工位
//重置新增文本框
function resetCenterDetail() {
  operateWorkCenterDetail.value = {
    station_id: "",
    administrative_code: asCode.value,
    employee_name: "",
    work_center_id: workCenterId.value,
    station_name: "",
    employee_id: "",
  };
}
//确认新增
async function addCenterDetail() {
  try {
    const data: any = await useHttp(
      "/WorkCenterDetail/M55AddWorkCenterDetail",
      "post",
      operateWorkCenterDetail.value
    );
    getWorkCenterDetail();
  } catch (error) {
    console.log(error);
  }
  dialogAddDetail.value = false;
}
//修改工位信息
async function updateCenterDetail() {
  const data: any = await useHttp(
    "/WorkCenterDetail/M56UpdateWorkCenterDetail",
    "put",
    operateWorkCenterDetail.value
  );
  getWorkCenterDetail();
  dialogUpdateDetail.value = false;
}
//删除工位信息
async function deleteCenterDetail() {
  const data: any = await useHttp(
    "/WorkCenterDetail/M57DeleteWorkCenterDetail",
    "delete",
    undefined,
    {
      ids: operateWorkCenterDetail.value.id,
    }
  );
  getWorkCenterDetail();
  dialogDeleteDetail.value = false;
}
</script>

<template>
  <v-row class="ma-2">
    <!-- 左边的工作中心表 -->
    <v-col cols="6">
      <v-card class="ma-3">
        <v-toolbar class="text-h6 pl-6">工作中心</v-toolbar>
        <v-data-table
          :items-per-page="15"
          :headers="headers"
          :items="workCenterList"
          style="overflow-x: auto; white-space: nowrap"
          fixed-footer
          fixed-header
          height="846px"
          no-data-text="没有找到符合的数据"
          hover
          @click:row="getMachineList"
        >
          <template v-slot:item.id="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              size="small"
              color="blue"
              class="mr-3"
              @click="
                dialogUpdate = true;
                operateRow = { ...item.raw };
              "
              >fa-solid fa-pen</v-icon
            >
            <v-icon
              size="small"
              color="red"
              @click="
                dialogDelete = true;
                operateRow = { ...item.raw };
              "
              >fa-solid fa-trash</v-icon
            >
          </template>

          <template v-slot:top>
            <v-row no-gutters>
              <v-col cols="3">
                <v-text-field
                  label="工作中心编号"
                  v-model="searchWorkCenterId"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="工作中心名称"
                  v-model="searchWorkCenterName"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="工作中心类型"
                  v-model="searchType"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="工作中心地址"
                  v-model="searchWorkCenterAddress"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  label="创建人"
                  v-model="searchCreator"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="创建时间（起始）"
                  v-model="searchStartCreateTime"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="创建时间（结束）"
                  v-model="searchEndCreateTime"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  label="更新人"
                  v-model="searchUpdatePerson"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="更新时间（起始）"
                  v-model="searchStartUpdateTime"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="更新时间（结束）"
                  v-model="searchEndUpdateTime"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-3">
                <v-btn
                  size="large"
                  color="black"
                  class="mx-3"
                  prepend-icon="fa-solid fa-search"
                  @click="searchWorkCenterList()"
                  >条件查询</v-btn
                >
                <v-btn
                  size="large"
                  color="red"
                  class="mr-3"
                  prepend-icon="fa-solid fa-hourglass-start"
                  @click="resetSearch()"
                  >重置查询</v-btn
                >
                <v-btn
                  size="large"
                  color="teal"
                  class="mr-3"
                  prepend-icon="fa-solid fa-add"
                  @click="
                    dialogAdd = true;
                    resetRow();
                  "
                  >新增工作中心</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="mt-3"></v-divider>
          </template>

          <template v-slot:bottom>
            <v-pagination
              v-model="showingPage"
              :length="workCenterCount"
            ></v-pagination>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <!-- 右边的俩个表 -->
    <v-col cols="6">
      <v-card class="ma-3">
        <v-toolbar v-if="workCenterId" class="text-h6 pl-6"
          >工作中心编号{{ workCenterId }}=>设备信息</v-toolbar
        >
        <v-toolbar v-else class="text-h6 pl-6">设备信息</v-toolbar>
        <v-data-table
          :headers="machineHeaders"
          :items="machineList"
          style="overflow-x: auto; white-space: nowrap"
          fixed-footer
          fixed-header
          height="350px"
          no-data-text="没有找到符合的数据"
          hover
          @click:row="getWorkCenterDetailList"
        >
          <template v-slot:item.id="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              size="small"
              color="blue"
              class="mr-3"
              @click="
                dialogUpdateMachine = true;
                operateMachine = { ...item.raw };
              "
              >fa-solid fa-pen</v-icon
            >
            <v-icon
              size="small"
              color="red"
              @click="
                dialogDeleteMachine = true;
                operateMachine = { ...item.raw };
              "
              >fa-solid fa-trash</v-icon
            >
          </template>

          <template v-slot:top>
            <v-row no-gutters>
              <v-col cols="4">
                <v-text-field
                  label="行政编码"
                  v-model="codeSearch"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="固定资产名称"
                  v-model="machineNameSearch"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="使用人"
                  v-model="userNameSearch"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-3">
                <v-btn
                  size="large"
                  color="black"
                  class="mx-3"
                  prepend-icon="fa-solid fa-search"
                  @click="getMachineSearch()"
                  >条件查询</v-btn
                >
                <v-btn
                  size="large"
                  color="red"
                  class="mr-3"
                  prepend-icon="fa-solid fa-hourglass-start"
                  @click="resetMachineSearch()"
                  >重置查询</v-btn
                >
                <v-btn
                  size="large"
                  color="teal"
                  class="mr-3"
                  v-if="workCenterId"
                  prepend-icon="fa-solid fa-add"
                  @click="
                    dialogAddMachine = true;
                    showAddMachineDialog();
                  "
                  >新增设备</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="mt-3"></v-divider>
          </template>

          <template v-slot:bottom>
            <v-pagination
              v-model="machinePage"
              :length="machineTablePageCount"
            ></v-pagination>
          </template>
        </v-data-table>
      </v-card>

      <v-card class="ma-3">
        <v-toolbar class="text-h6 pl-6" v-if="workCenterId && asCode"
          >工作中心编号{{ workCenterId }}=>行政编码{{
            asCode
          }}=>工位信息</v-toolbar
        >
        <v-toolbar class="text-h6 pl-6" v-else-if="workCenterId"
          >工作中心编号{{ workCenterId }}=>工位信息</v-toolbar
        >
        <v-toolbar class="text-h6 pl-6" v-else-if="asCode"
          >行政编码{{ asCode }}=>工位信息</v-toolbar
        >
        <v-toolbar class="text-h6 pl-6" v-else>工位信息</v-toolbar>
        <v-data-table
          :headers="workCenterDetailHeaders"
          :items="workCenterDetailList"
          :items-per-page="10"
          style="overflow-x: auto; white-space: nowrap"
          fixed-footer
          fixed-header
          height="350px"
          no-data-text="没有找到符合的数据"
          hover
        >
          <template v-slot:item.id="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              size="small"
              color="blue"
              class="mr-3"
              @click="
                dialogUpdateDetail = true;
                operateWorkCenterDetail = { ...item.raw };
              "
              >fa-solid fa-pen</v-icon
            >
            <v-icon
              size="small"
              color="red"
              @click="
                dialogDeleteDetail = true;
                operateWorkCenterDetail = { ...item.raw };
              "
              >fa-solid fa-trash</v-icon
            >
          </template>

          <template v-slot:top>
            <v-row no-gutters>
              <v-col cols="6">
                <v-text-field
                  label="工位名称"
                  v-model="stationNameSearch"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="员工名称"
                  v-model="employeeNameSearch"
                  variant="outlined"
                  density="compact"
                  class="mt-3 ml-3"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-3">
                <v-btn
                  size="large"
                  color="black"
                  class="mx-3"
                  prepend-icon="fa-solid fa-search"
                  @click="searchWorkCenterDetail()"
                  >条件查询</v-btn
                >
                <v-btn
                  size="large"
                  color="red"
                  class="mr-3"
                  prepend-icon="fa-solid fa-hourglass-start"
                  @click="resetSearchWorkCenterDetail()"
                  >重置查询</v-btn
                >
                <v-btn
                  size="large"
                  color="teal"
                  class="mr-3"
                  v-if="workCenterId"
                  prepend-icon="fa-solid fa-add"
                  @click="
                    dialogAddDetail = true;
                    resetCenterDetail();
                  "
                  >新增工位</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="mt-3"></v-divider>
          </template>

          <template v-slot:bottom>
            <v-pagination
              v-model="workCenterDetailPage"
              :length="workCenterDetailPageCount"
            ></v-pagination>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
  <!-- 新增工作中心 -->
  <v-dialog v-model="dialogAdd" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>新增工作中心</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogAdd = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateRow.work_center_id"
          label="工作中心编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.type"
          label="工作中心类型"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_name"
          label="工作中心名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_address"
          label="工作中心地址"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="green" class="mr-3" @click="addWorkCenter()">确认</v-btn>
        <v-btn color="grey" class="mr-3" @click="dialogAdd = false">取消</v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改工作中心信息 -->
  <v-dialog v-model="dialogUpdate" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>更新工作中心</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogUpdate = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateRow.work_center_id"
          label="工作中心编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.type"
          label="工作中心类型"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_name"
          label="工作中心名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_address"
          label="工作中心地址"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="blue" class="mr-3" @click="updateWorkCenter()"
          >确认</v-btn
        >
        <v-btn color="grey" class="mr-3" @click="dialogUpdate = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除工作中心 -->
  <v-dialog v-model="dialogDelete" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>删除工作中心</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogDelete = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text class="my-6 text-h6 text-red font-weight-medium text-center">
        您确认要删除吗？
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="red" class="mr-3" @click="deleteWorkCenter()">确认</v-btn>
        <v-btn color="grey" class="mr-3" @click="dialogDelete = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>

  <!-- 新增设备信息 -->
  <v-dialog v-model="dialogAddMachine" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>新增设备信息</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogAddMachine = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateMachine.user"
          label="使用人"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.purchase_date"
          label="购入日期"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.user_department"
          label="使用部门"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.administrative_code"
          label="行政编码"
        ></v-text-field>

        <v-text-field
          variant="outlined"
          v-model="operateMachine.machine_name"
          label="固定资产名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.machine_site"
          label="放置位置"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.equipment_type"
          label="规格型号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.receive_time"
          label="领用时间"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="green" class="mr-3" @click="addMachine()">确认</v-btn>
        <v-btn color="grey" class="mr-3" @click="dialogAddMachine = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改设备信息 -->
  <v-dialog v-model="dialogUpdateMachine" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>修改设备信息</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogUpdateMachine = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateMachine.user"
          label="使用人"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.purchase_date"
          label="购入日期"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.user_department"
          label="使用部门"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.administrative_code"
          label="行政编码"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.work_center_id"
          label="工作中心编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.machine_name"
          label="固定资产名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.machine_site"
          label="放置位置"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.equipment_type"
          label="规格型号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateMachine.receive_time"
          label="领用时间"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="green" class="mr-3" @click="upDateMachine()">确认</v-btn>
        <v-btn color="grey" class="mr-3" @click="dialogUpdateMachine = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除设备信息 -->
  <v-dialog v-model="dialogDeleteMachine" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>删除设备信息</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogDeleteMachine = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text class="my-6 text-h6 text-red font-weight-medium text-center">
        您确认要删除"{{ operateMachine.machine_name }}"这台设备的信息吗？
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="red" class="mr-3" @click="deleteMachine()">确认</v-btn>
        <v-btn color="grey" class="mr-3" @click="dialogDeleteMachine = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>

  <!-- 新增工位信息 -->
  <v-dialog v-model="dialogAddDetail" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>新增工位信息</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogAddDetail = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateWorkCenterDetail.station_id"
          label="工位编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.station_name"
          label="工位名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.employee_id"
          label="员工编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.employee_name"
          label="员工姓名"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="green" class="mr-3" @click="addCenterDetail()"
          >确认</v-btn
        >
        <v-btn color="grey" class="mr-3" @click="dialogAddMachine = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改设备信息 -->
  <v-dialog v-model="dialogUpdateDetail" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>修改工位信息</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogUpdateDetail = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateWorkCenterDetail.station_id"
          label="工位编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.station_name"
          label="工位名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.administrative_code"
          label="行政编码"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.employee_id"
          label="员工编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.employee_name"
          label="员工姓名"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateWorkCenterDetail.work_center_id"
          label="工作中心编号"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="green" class="mr-3" @click="updateCenterDetail()"
          >确认</v-btn
        >
        <v-btn color="grey" class="mr-3" @click="dialogUpdateDetail = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除工位信息 -->
  <v-dialog v-model="dialogDeleteDetail" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>删除工位信息</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogDeleteDetail = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text class="my-6 text-h6 text-red font-weight-medium text-center">
        您确认要删除工位名称为"{{
          operateWorkCenterDetail.station_name
        }}"的这个工位的信息吗？
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="red" class="mr-3" @click="deleteCenterDetail()"
          >确认</v-btn
        >
        <v-btn color="grey" class="mr-3" @click="dialogDeleteDetail = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>
