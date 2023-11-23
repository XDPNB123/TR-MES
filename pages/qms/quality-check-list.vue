<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "质检单",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "质检单",
  // 该页面的描述
  description: "同日 MES 系统，质检单",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，质检单",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
//搜索
let searchName = ref<any>(null);
let searchProjectCode = ref<any>(null);
let searchDO = ref<any>(null);

let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);

let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 1);

let searchStartDate = ref<any>(null);
let searchEndDate = ref<any>(null);
let searchType = ref<any>(null);
let searchWorkCenter = ref<any>(null);
let searchResult = ref<any>(null);
let searchStatus = ref<any>("待质检");
watch(searchWorkCenter, function () {
  tablePerPage.value = 1;
  getQaData();
});
watch(searchResult, function () {
  tablePerPage.value = 1;
  getQaData();
});
watch(searchStatus, function () {
  tablePerPage.value = 1;
  getQaData();
});

let qaDialog = ref<boolean>(false);
//存储质检单数据
let qaList = ref<any[]>([]);
//质检数据对象
let qaInfo = ref<any>(null);

// 质检表每页条数
let tablePerPage = ref<number>(1);
watch(tablePerPage, function () {
  getQaData();
});
//一共有多少行质检表
let tableDataLength = ref<number>(0);
// 质检表有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableDataLength.value / 10);
});
//获取质检单的数据
async function getQaData() {
  const data: any = await useHttp(
    "/QaQatask/M39GetQaQataskList",
    "get",
    undefined,
    {
      start_time: searchStartDate.value,
      end_time: searchEndDate.value,
      inspection_type: searchType.value,
      work_center_name: searchWorkCenter.value,
      material_name: searchName.value,
      inspection_status: searchStatus.value,
      project_code: searchProjectCode.value,
      scan_result: searchResult.value,
      dispatch_order: searchDO.value,
      PageIndex: tablePerPage.value,
      PageSize: 10,
      SortedBy: "id",
      SortType: 0,
    }
  );
  tableDataLength.value = data.data.totalCount;
  qaList.value = data.data.pageList
    .map((item: any) => {
      if (item.create_time)
        item.create_time = item.create_time.substring(0, 10);
      return item;
    })
    .sort((a: any, b: any) => {
      if (
        a.inspection_status === "待质检" &&
        b.inspection_status !== "待质检"
      ) {
        return -1;
      }
      if (
        a.inspection_status !== "待质检" &&
        b.inspection_status === "待质检"
      ) {
        return 1;
      }
      return 0;
    });
}
//重置搜索
function resetFilter() {
  (searchWorkCenter.value = ""),
    (searchName.value = ""),
    (searchDO.value = ""),
    (searchType.value = ""),
    (tablePerPage.value = 1);
  (searchStartDate.value = nowDate.toISOString().substring(0, 10)),
    (searchEndDate.value = oldDate.toISOString().substring(0, 10)),
    (searchResult.value = ""),
    (searchWorkCenter.value = "");
  getQaData();
}
//搜素
async function filter() {
  tablePerPage.value = 1;
  await getQaData();
}
onMounted(() => {
  searchStartDate.value = nowDate.toISOString().substring(0, 10);
  searchEndDate.value = oldDate.toISOString().substring(0, 10);
  getQaData();
  getWorkCenterData();
});
let workCenterList = ref<any[]>([]);
//获取工作中心名称
async function getWorkCenterData() {
  const data: any = await useHttp(
    "/WorkCenter/M13WorkCenterList",
    "get",
    undefined,
    { PageIndex: 1, PageSize: 10000, SortedBy: "id", SortType: 1 }
  );
  workCenterList.value = data.data.pageList.map(
    (item: any) => item.work_center_name
  );
}
//不合格原因的数据
let items = ref([
  "尺寸不合格",
  "焊接不合格",
  "打孔不合格",
  "折弯不合格",
  "切割不合格",
  "打磨不合格",
  "装配不合格",
]);
//打开显示框
function showQaInfo(item: any) {
  if (item.inspection_status !== "待质检") {
    return;
  }
  qaInfo.value = { ...item };
  if (qaInfo.value.cause_nonconformity) {
    qaInfo.value.cause_nonconformity =
      qaInfo.value.cause_nonconformity.split(",");
  } else {
    qaInfo.value.cause_nonconformity = null;
  }
  qaDialog.value = true;
}
//保存质检修改
async function saveQaInfo() {
  if (
    Number(qaInfo.value.qualified_quantity) +
      Number(qaInfo.value.non_conforming_quantity) !==
    qaInfo.value.inspection_quantity
  ) {
    return setSnackbar("black", "您输入的数量相加不正确");
  }

  if (qaInfo.value.non_conforming_quantity) {
    if (!qaInfo.value.cause_nonconformity) {
      return setSnackbar("black", "请您填写不合格的原因");
    }
  } else {
    qaInfo.value.non_conforming_quantity = 0;
    qaInfo.value.cause_nonconformity = [];
  }

  if (qaInfo.value.cause_nonconformity)
    qaInfo.value.cause_nonconformity =
      qaInfo.value.cause_nonconformity.join(",");
  qaInfo.value.scan_time = new Date().toISOString().substring(0, 10);

  await useHttp("/QaQatask/M41UpdateQaQatask", "put", qaInfo.value);
  getQaData();
  qaDialog.value = false;
  setSnackbar("green", "质检完成");
}
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-text-field
        label="最早创建日期"
        v-model="searchStartDate"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        type="date"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="最晚创建日期"
        v-model="searchEndDate"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        type="date"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="质检类型"
        v-model="searchType"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="派工单号"
        v-model="searchDO"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="物料名称"
        v-model="searchName"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      ></v-text-field>
    </v-col>

    <v-col cols="3">
      <v-select
        label="质检状态"
        variant="outlined"
        density="compact"
        v-model="searchStatus"
        :items="['待质检', '已处理', '已作废']"
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="3">
      <v-select
        label="质检结果"
        variant="outlined"
        v-model="searchResult"
        :items="['合格', '部分合格', '不合格']"
        density="compact"
        hide-details
        clearable
      ></v-select>
    </v-col>
    <v-col cols="3">
      <v-select
        label="工作中心名称"
        variant="outlined"
        density="compact"
        :items="workCenterList"
        v-model="searchWorkCenter"
        hide-details
        clearable
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-btn color="blue-darken-2" class="mr-2" size="large" @click="filter"
        >查询</v-btn
      >
      <v-btn color="red" class="mr-2" size="large" @click="resetFilter">
        重置查询
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-card style="overflow: auto; white-space: nowrap" height="610px">
        <v-list
          density="compact"
          class="ma-2 elevation-2 rounded-lg"
          v-if="qaList.length"
          v-for="(item, index) in qaList"
          :key="index"
          @click="showQaInfo(item)"
        >
          <div class="d-flex ma-2">
            <!-- 1 -->
            <div class="flex-grow-0">
              <div
                class="text-body-1 text-blue-darken-1"
                style="flex-basis: 12%"
              >
                派工单号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.dispatch_order }}
                </span>
              </div>

              <div
                style="flex-basis: 12%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                质检状态：
                <span
                  class=""
                  style="text-decoration: underline"
                  :class="{
                    'text-red': item.inspection_status === '待质检',
                    'text-green': item.inspection_status === '已处理',
                    'text-black': item.inspection_status === '已作废',
                  }"
                >
                  {{ item.inspection_status }}
                </span>
              </div>
              <div
                style="flex-basis: 12%"
                class="text-body-1 text-blue-darken-1"
              >
                报工人：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.creator }}
                </span>
              </div>
            </div>
            <!-- 2 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 11%"
                class="text-body-1 text-blue-darken-1"
              >
                检验类型：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.inspection_type }}
                </span>
              </div>

              <div
                style="flex-basis: 11%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                质检结果：
                <span
                  class=""
                  style="text-decoration: underline"
                  :class="{
                    'text-red': item.scan_result === '部分合格',
                    'text-green': item.scan_result === '合格',
                    'text-black': item.scan_result === '不合格',
                  }"
                >
                  {{ item.scan_result }}
                </span>
              </div>
              <div
                style="flex-basis: 11%"
                class="text-body-1 text-blue-darken-1"
              >
                质检数量：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.inspection_quantity }}{{ item.unit }}
                </span>
              </div>
            </div>
            <!-- 3 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 15%"
                class="text-body-1 text-blue-darken-1"
              >
                工序：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.procedure_description }}
                </span>
              </div>

              <div
                style="flex-basis: 15%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                创建时间：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.create_time }}
                </span>
              </div>
              <div
                style="flex-basis: 15%"
                class="text-body-1 text-blue-darken-1"
              >
                合格数量：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.qualified_quantity }}{{ item.unit }}
                </span>
              </div>
            </div>
            <!-- 4 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 20%"
                class="text-body-1 text-blue-darken-1"
              >
                项目号:
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.project_code }}
                </span>
              </div>

              <div
                style="flex-basis: 22%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                托盘号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.pallet_no }}
                </span>
              </div>
              <div
                style="flex-basis: 22%"
                class="text-body-1 text-blue-darken-1"
              >
                不合格数量：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.non_conforming_quantity }}{{ item.unit }}
                </span>
              </div>
            </div>
            <!-- 5 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 10%"
                class="text-body-1 text-blue-darken-1"
              >
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  @{{ item.work_center_name }}
                </span>
              </div>

              <div
                style="flex-basis: 20%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                货位号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.warehouse_location }}
                </span>
              </div>

              <div
                style="flex-basis: 20%"
                class="text-body-1 text-blue-darken-1"
              >
                检验编号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.inspection_id }}
                </span>
              </div>
            </div>
            <!-- 6 -->
            <div class="flex-grow-1 ml-8 pl-8">
              <div
                style="flex-basis: 20%"
                class="text-body-1 text-blue-darken-1"
              >
                物料名称：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.material_name }}
                </span>
              </div>
              <div
                style="flex-basis: 22%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                物料编号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.material_id }}
                </span>
              </div>

              <div
                style="flex-basis: 40%"
                class="text-body-1 text-blue-darken-1"
              >
                不合格原因：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.cause_nonconformity }}
                </span>
              </div>
            </div>
          </div>
        </v-list>
        <v-list v-else>
          <div class="text-center text-h6 my-3 text-grey">当前类型数据为空</div>
        </v-list>
      </v-card>
      <div class="text-center pt-2">
        <v-pagination
          v-model="tablePerPage"
          :length="tablePageCount"
        ></v-pagination>
      </div>
    </v-col>
    <!-- 质检页面 -->
    <v-dialog v-model="qaDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 质检 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="qaDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="qaInfo.inspection_quantity"
                label="待质检数量"
                readonly
                density="compact"
              ></v-text-field
            ></v-col>
            <v-col cols="6">
              <v-text-field
                v-model="qaInfo.qualified_quantity"
                label="合格数量"
                density="compact"
                hint="输入合格的数量,与不合格数量相加等于待质检数量"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="qaInfo.non_conforming_quantity"
                label="不合格数量"
                density="compact"
                hint="输入不合格的数量,与合格数量相加等于待质检数量"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-if="
                  qaInfo.non_conforming_quantity &&
                  qaInfo.non_conforming_quantity !== '0'
                "
                v-model="qaInfo.cause_nonconformity"
                :items="items"
                density="compact"
                multiple
                clearable
                label="不合格原因"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="qaInfo.material_name"
                label="物料名称"
                readonly
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="qaInfo.procedure_description"
                label="工序描述"
                readonly
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="qaInfo.work_center_name"
                label="工作中心名称"
                readonly
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="qaInfo.creator"
                label="提交人"
                readonly
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="saveQaInfo"
          >
            保存
          </v-btn>
          <v-btn color="grey" size="large" @click="qaDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>
