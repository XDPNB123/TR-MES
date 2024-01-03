<script setup lang="ts">
useSeoMeta({
  // 该页面的标题
  title: "工时统计",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工时统计",
  // 该页面的描述
  description: "同日 MES 系统，工时统计",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，工时统计",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
let headers = ref<any[]>([
  {
    title: "项目号",
    align: "true",
    key: "project_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "工单编号",
    align: "center",
    key: "workorder_hid",
    sortable: true,
    filterable: true,
  },
  {
    title: "明细编号",
    align: "center",
    key: "workorder_did",
    sortable: true,
    filterable: true,
  },
  {
    title: "派工单号",
    align: "center",
    key: "dispatch_order",
    sortable: true,
    filterable: true,
  },
  {
    title: "工作中心",
    align: "center",
    key: "work_center_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作人数",
    align: "center",
    key: "employee_number",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作时间",
    align: "center",
    key: "temporal_interval",
    sortable: true,
    filterable: true,
  },
  {
    title: "工时",
    align: "center",
    key: "work_time",
    sortable: true,
    filterable: true,
  },
]);
let showDialog = ref<boolean>(false);
let showDetailDialog = ref<boolean>(false);
//获取数据库数据
let hourList = ref<any[]>([]);
//搜索
let searchProject = ref<any>("");
let searchWorkHid = ref<any>("");
let searchWorkDid = ref<any>("");
let searchOrder = ref<any>("");
let searchCenterName = ref<any>("");
let searchStartTime = ref<any>(null);
let searchEndTime = ref<any>(null);

//调用接口
async function getHourDate() {
  const data: any = await useHttp(
    "/MesProcessScanRecord/M87CountManHour",
    "get",
    undefined,
    {
      project_code: searchProject.value,
      workorder_hid: searchWorkHid.value,
      workorder_did: searchWorkDid.value,
      dispatch_order: searchOrder.value,
      work_center_name: searchCenterName.value,
      start_time: searchStartTime.value,
      end_time: searchEndTime.value,
    }
  );
  hourList.value = data.data;
}
onMounted(() => {
  getHourDate();
});
async function filter() {
  await getHourDate();
  addHour();
}
function resetFilter() {
  (searchProject.value = ""),
    (searchWorkHid.value = ""),
    (searchWorkDid.value = ""),
    (searchOrder.value = ""),
    (searchCenterName.value = ""),
    (searchStartTime.value = null),
    (searchEndTime.value = null);
  hour.value = 0;
  getHourDate();
}
function showSum() {
  showDialog.value = true;
}
let hour = ref<number>(0);
function addHour() {
  hour.value = 0;
  hourList.value.forEach((item: any) => {
    hour.value += Math.round(item.work_time * 100);
  });
  hour.value /= 100;
}
let expanded = ref<any>(null);
function showDetail(item: any, obj: any) {
  expanded.value = obj.item.raw;
  showDetailDialog.value = true;
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-text-field
        label="项目号"
        v-model="searchProject"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="工单表头"
        v-model="searchWorkHid"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="工单明细"
        v-model="searchWorkDid"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="派工单号"
        v-model="searchOrder"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="工作中心"
        v-model="searchCenterName"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="开始时间"
        v-model="searchStartTime"
        type="date"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="截止时间"
        v-model="searchEndTime"
        type="date"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-row>
        <v-col cols="9">
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
            @click="showSum"
          >
            工时统计
          </v-btn>
        </v-col>
        <v-col cols="3">
          <div
            class="text-blue-darken-2 font-weight-bold text-h6 text-center"
            v-show="hour"
          >
            工时：<span
              style="border: 3px rgb(170, 65, 65) solid; padding: 8px 10px"
              >{{ hour }}</span
            >
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-data-table
        hover
        :items-per-page="10"
        :headers="headers"
        :items="hourList"
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
        @click:row="showDetail"
      >
      </v-data-table>
    </v-col>
    <v-dialog v-model="showDialog" min-width="400px" width="560px">
      <v-card>
        <v-card-text class="mt-4">
          <div v-if="searchProject">项目号:{{ searchProject }}</div>
          <div v-if="searchWorkHid">工单表头:{{ searchWorkHid }}</div>
          <div v-if="searchWorkDid">明细编号:{{ searchWorkDid }}</div>
          <div v-if="searchOrder">派工单号:{{ searchOrder }}</div>
          <div v-if="searchCenterName">工作中心:{{ searchCenterName }}</div>
          工时为:{{ hour }}
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="grey" size="large" @click="showDialog = false">
            关闭
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDetailDialog" min-width="1000px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工时详情 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-stepper>
            <v-stepper-header>
              <v-stepper-item complete value="1">
                <div class="d-flex flex-column">
                  <div>状态：{{ expanded.scan_action }}</div>
                  <div>员工姓名: {{ expanded.employee_name }}</div>
                  <div>时间: {{ expanded.scan_time }}</div>
                </div>
              </v-stepper-item>

              <div class="d-flex flex-column w-100">
                <div class="text-center">
                  产出料：{{ expanded.material_name }}
                </div>
                <v-divider :thickness="3"></v-divider>
              </div>
              <v-stepper-item complete value="2">
                <div class="d-flex flex-column">
                  <div>状态：结束</div>
                  <div>员工姓名: {{ expanded.employee_name }}</div>
                  <div>时间: {{ expanded.temporal_interval.slice(-19) }}</div>
                </div>
              </v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
