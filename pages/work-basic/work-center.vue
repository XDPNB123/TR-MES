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
const router = useRouter();
let workCenterType = ref<any[]>(["钣金", "机加工", "装配", "其他"]);
// 表格所有数据
let workCenterList = ref<any[]>([]);
// 表格当前页
let showingPage = ref<number>(1);
watch(showingPage, function () {
  getWorkCenterList();
});
// 表格总页数
let totalPageCount = ref<number>(0);
// 表格总页数
const workCenterCount = computed(() => {
  return Math.ceil(totalPageCount.value / 12);
});
// 对话框
let dialogAdd = ref<boolean>(false);
let dialogUpdate = ref<boolean>(false);
let dialogDelete = ref<boolean>(false);
let dialogShow = ref<boolean>(false);
//工作中心对象
let operateRow = ref<any>();
//用来存储工作中心编号
let workCenterId = ref<string>("");
//存储工作中心名称
let workCenterName = ref<string>("");
let searchWorkCenterName = ref<string>("");
let searchType = ref<string>("");
let searchWorkCenterAddress = ref<string>("");

//获取数据
async function getWorkCenterList() {
  const data = await useHttp(
    "/WorkCenter/M13WorkCenterList",
    "get",
    undefined,
    {
      work_center_address: searchWorkCenterAddress.value,
      work_center_name: searchWorkCenterName.value,
      type: searchType.value,
      PageIndex: showingPage.value,
      PageSize: 12,
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
onMounted(function () {
  // 页面渲染完成时，加载表格所有数据
  getWorkCenterList();
});

//按条件搜素工作中心
function searchWorkCenterList() {
  showingPage.value = 1;
  getWorkCenterList();
}
//重置搜素
function resetSearch() {
  showingPage.value = 1;
  searchWorkCenterName.value = "";
  searchType.value = "";
  searchWorkCenterAddress.value = "";
  getWorkCenterList();
}
// 重置正在操作的行数据
function resetRow() {
  operateRow.value = {
    work_center_id: "",
    type: "",
    work_center_name: "",
    work_center_address: "",
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
let chineData = ref(true);
let stationData = ref(false);
//点击查看工作中心中的设备信息和工位信息
function showWorkCenter(item: any) {
  workCenterId.value = item.work_center_id;
  workCenterName.value = item.work_center_name;
  getMachineData();
  getWorkCenterDetail();
  chineData.value = true;
  stationData.value = false;
  dialogShow.value = true;
}

//设备信息
// 设备表格所有数据
let machineList = ref<any[]>([]);

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
  return Math.ceil(machineTotalPageCount.value / 4);
});
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
        PageSize: 4,
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
        ids: operateMachine.value.id,
      }
    );
    getMachineData();
  } catch (error) {
    console.log(error);
  }
  dialogDeleteMachine.value = false;
}

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
  return Math.ceil(workCenterDetailCount.value / 8);
});
//获取数据
async function getWorkCenterDetail() {
  try {
    const data: any = await useHttp(
      "/WorkCenterDetail/M54WorkCenterDetailList",
      "get",
      undefined,
      {
        work_center_id: workCenterId.value,
        administrative_code: "",
        station_name: stationNameSearch.value,
        employee_name: employeeNameSearch.value,
        PageIndex: workCenterDetailPage.value,
        PageSize: 8,
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
    administrative_code: "",
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

//显示设备信息
function showChine() {
  getMachineData();
  chineData.value = true;
  stationData.value = false;
}
//显示工位信息
function showStation() {
  getWorkCenterDetail();
  chineData.value = false;
  stationData.value = true;
}
//关闭工作中心信息
function cancelDialog() {
  chineData.value = true;
  stationData.value = false;
  dialogShow.value = false;
}
</script>
<template>
  <v-row class="ma-3">
    <v-col cols="6">
      <v-text-field
        label="工作中心名称"
        v-model="searchWorkCenterName"
        variant="outlined"
        density="compact"
        class="mt-3"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-select
        label="工作中心类型"
        v-model="searchType"
        :items="workCenterType"
        variant="outlined"
        density="compact"
        class="mt-3"
        clearable
        hide-details
      ></v-select>
    </v-col>

    <v-col cols="12" class="mt-3">
      <v-btn
        size="large"
        color="blue-darken-2"
        class="mr-3"
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
        color="blue-darken-2"
        class="mr-3"
        prepend-icon="fa-solid fa-add"
        @click="
          dialogAdd = true;
          resetRow();
        "
        v-permission="`${router.currentRoute.value.fullPath}->addWorkCenter`"
        >新增工作中心</v-btn
      >
    </v-col>

    <v-col
      cols="2"
      v-for="(item, index) in workCenterList"
      :key="index"
      class="mt-4"
    >
      <v-card rounded="lg" @click="showWorkCenter(item)">
        <div cover class="align-end" style="background: #cfd8dc; height: 80px">
          <div class="d-flex justify-space-between">
            <v-card-title class="text-blue text-h6">{{
              item.work_center_name
            }}</v-card-title>
            <div class="align-self-center" style="opacity: 0.8">
              <v-icon
                size="small"
                color="blue"
                class="mr-3"
                @click.stop="
                  dialogUpdate = true;
                  operateRow = { ...item };
                "
                v-permission="
                  `${router.currentRoute.value.fullPath}->updateWorkCenter`
                "
                >fa-solid fa-pen</v-icon
              >
              <v-icon
                size="small"
                color="blue"
                class="mr-3"
                @click.stop="
                  dialogDelete = true;
                  operateRow = { ...item };
                "
                v-permission="
                  `${router.currentRoute.value.fullPath}->deleteWorkCenter`
                "
                >fa-solid fa-trash</v-icon
              >
            </div>
          </div>
        </div>
        <v-list class="w-100">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon class="mr-5">fa-solid fa-hashtag</v-icon>
              <div>
                编号：
                <span class="text-body-2 text-grey-darken-2">{{
                  item.work_center_id
                }}</span>
              </div>
            </template>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon class="mr-5">fa-solid fa-layer-group</v-icon>
              <div>
                类型：
                <span class="text-body-2 text-grey-darken-2">{{
                  item.type
                }}</span>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
  <div class="text-center">
    <v-pagination
      v-model="showingPage"
      :length="workCenterCount"
    ></v-pagination>
  </div>
  <!-- 工作中心内容 -->
  <v-dialog v-model="dialogShow" class="my-dialog" max-width="90vw">
    <v-card>
      <v-toolbar
        style="position: sticky; top: 0; z-index: 1000"
        class="text-h6"
        color="blue-darken-2"
      >
        <v-toolbar-title class="text-h5 font-weight-medium"
          >工作中心【{{ workCenterName }}】的设备与工位信息</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-icon size="x-large" @click="cancelDialog" class="mr-2"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <div>
        <v-tabs fixed-tabs>
          <v-tab @click="showChine" class="text-h6 font-weight-bold">
            设备({{ machineTotalPageCount }})
          </v-tab>
          <v-tab @click="showStation" class="text-h6 font-weight-bold">
            工位({{ workCenterDetailCount }})
          </v-tab>
        </v-tabs>
      </div>
      <!-- 设备信息 -->
      <v-row class="ma-3" v-if="chineData">
        <v-col cols="4">
          <v-text-field
            label="设备编号"
            v-model="codeSearch"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="设备名称"
            v-model="machineNameSearch"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="使用人"
            v-model="userNameSearch"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            size="large"
            color="blue-darken-2"
            class="mr-3"
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
            color="blue-darken-2"
            class="mr-3"
            prepend-icon="fa-solid fa-add"
            @click="
              dialogAddMachine = true;
              showAddMachineDialog();
            "
            v-permission="
              `${router.currentRoute.value.fullPath}->addMachine`
            "
            >新增设备</v-btn
          >
        </v-col>
        <v-col
          cols="3"
          v-for="(item, index) in machineList"
          :key="index"
          v-if="machineList.length"
        >
          <v-card>
            <v-img src="/设备.png" height="100px" class="align-end">
              <div class="d-flex justify-end mb-2" style="opacity: 0.8">
                <v-icon
                  size="small"
                  color="blue"
                  class="mr-3"
                  @click="
                    dialogUpdateMachine = true;
                    operateMachine = { ...item };
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->updateMachine`
                "
                  >fa-solid fa-pen</v-icon
                >
                <v-icon
                  size="small"
                  color="red"
                  class="mr-3"
                  @click="
                    dialogDeleteMachine = true;
                    operateMachine = { ...item };
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->deleteMachine`
                "
                  >fa-solid fa-trash</v-icon
                >
              </div>
            </v-img>

            <v-list class="w-100">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-solid fa-file-signature</v-icon>
                  <div>
                    名称：<span class="text-body-2 text-grey-darken-2">{{
                      item.machine_name
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-solid fa-hashtag</v-icon>
                  <div>
                    型号：<span class="text-body-2 text-grey-darken-2">{{
                      item.equipment_type
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-regular fa-calendar-plus</v-icon>
                  <div>
                    购入日期：<span class="text-body-2 text-grey-darken-2">{{
                      item.purchase_date
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-regular fa-calendar-check</v-icon>
                  <div>
                    领用日期：<span class="text-body-2 text-grey-darken-2">{{
                      item.receive_time
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-solid fa-layer-group</v-icon>
                  <div>
                    部门：<span class="text-body-2 text-grey-darken-2">{{
                      item.user_department
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-solid fa-chalkboard-user</v-icon>
                  <div>
                    负责人：<span class="text-body-2 text-grey-darken-2">{{
                      item.user
                    }}</span>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col v-else>
          <div class="text-center text-h5 text-grey">当前工作中心没有设备</div>
        </v-col>
        <v-col cols="12">
          <div class="text-center">
            <v-pagination
              v-model="machinePage"
              :length="machineTablePageCount"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>

      <!--工位信息 -->
      <v-row class="ma-3" v-if="stationData">
        <v-col cols="6">
          <v-text-field
            label="工位名称"
            v-model="stationNameSearch"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="员工名称"
            v-model="employeeNameSearch"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            size="large"
            color="blue-darken-2"
            class="mr-3"
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
            color="blue-darken-2"
            class="mr-3"
            v-if="workCenterId"
            prepend-icon="fa-solid fa-add"
            @click="
              dialogAddDetail = true;
              resetCenterDetail();
            "
            v-permission="
            `${router.currentRoute.value.fullPath}->addStation`
          "
            >新增工位</v-btn
          >
        </v-col>
        <v-col
          cols="3"
          v-for="(item, index) in workCenterDetailList"
          :key="index"
          v-if="workCenterDetailList.length"
        >
          <v-card class="rounded-pill">
            <v-img src="/工位.png" height="100px" class="align-end">
              <div class="d-flex justify-end mb-2" style="opacity: 0.8">
                <v-icon
                  size="small"
                  color="blue"
                  class="mr-3"
                  @click="
                    dialogUpdateDetail = true;
                    operateWorkCenterDetail = { ...item };
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->updateStation`
                "
                  >fa-solid fa-pen</v-icon
                >
                <v-icon
                  size="small"
                  color="red"
                  class="mr-3"
                  @click="
                    dialogDeleteDetail = true;
                    operateWorkCenterDetail = { ...item };
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->deleteStation`
                "
                  >fa-solid fa-trash</v-icon
                >
              </div>
            </v-img>

            <v-list class="w-100">
              <v-list-item class="d-flex justify-center">
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-solid fa-layer-group</v-icon>
                  <div>
                    名称：
                    <span class="text-body-2 text-grey-darken-2">{{
                      item.station_name
                    }}</span>
                  </div>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="d-flex justify-center">
                <template v-slot:prepend>
                  <v-icon class="mr-5">fa-solid fa-circle-user</v-icon>
                  <div>
                    员工：
                    <span class="text-body-2 text-grey-darken-2">{{
                      item.employee_name
                    }}</span>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col v-else>
          <div class="text-center text-h5 text-grey">
            当前工作中心没有设置工位
          </div>
        </v-col>
        <v-col cols="12">
          <div class="text-center">
            <v-pagination
              v-model="workCenterDetailPage"
              :length="workCenterDetailPageCount"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
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

        <v-select
          label="工作中心类型"
          v-model="operateRow.type"
          :items="workCenterType"
          variant="outlined"
          clearable
        ></v-select>
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
        <v-btn color="blue-darken-2" class="mr-3" @click="addWorkCenter()"
          >确认</v-btn
        >
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
        <v-select
          label="工作中心类型"
          v-model="operateRow.type"
          :items="workCenterType"
          variant="outlined"
          clearable
        ></v-select>
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
        <v-btn color="blue-darken-2" class="mr-3" @click="updateWorkCenter()"
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
        您确认要删除"{{ operateRow.work_center_name }}"这条工作中心吗？
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="blue-darken-2" class="mr-3" @click="deleteWorkCenter()"
          >确认</v-btn
        >
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
        <v-btn color="blue-darken-2" class="mr-3" @click="addMachine()"
          >确认</v-btn
        >
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
        <v-btn color="blue-darken-2" class="mr-3" @click="upDateMachine()"
          >确认</v-btn
        >
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
        <v-btn color="blue-darken-2" class="mr-3" @click="deleteMachine()"
          >确认</v-btn
        >
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
        <v-btn color="blue-darken-2" class="mr-3" @click="addCenterDetail()"
          >确认</v-btn
        >
        <v-btn color="grey" class="mr-3" @click="dialogAddDetail = false"
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
        <v-btn color="blue-darken-2" class="mr-3" @click="updateCenterDetail()"
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
        <v-btn color="blue-darken-2" class="mr-3" @click="deleteCenterDetail()"
          >确认</v-btn
        >
        <v-btn color="grey" class="mr-3" @click="dialogDeleteDetail = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped>
@keyframes my-animation {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.my-dialog {
  animation: my-animation 0.5s ease-out;
}
.dialog-right-top-icon {
  z-index: 1;
  position: fixed;
  right: 1.3vw;
  top: 1vh;
}
</style>
