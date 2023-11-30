<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "良品统计",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "良品统计",
  // 该页面的描述
  description: "同日 MES 系统，良品统计",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，良品统计",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
let showingTab = ref<any>(null);
//搜索
let searchTicketNumber = ref<any>(null);
let searchName = ref<any>(null);
let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);
let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 1);
let nowDate2 = new Date();
nowDate2.setDate(nowDate2.getDate() - 7);
let oldDate2 = new Date();
oldDate2.setDate(oldDate2.getDate() + 7);

let startDate = ref<any>(null);
let endDate = ref<any>(null);
let startDateInfo = ref<any>(null);
let endDateInfo = ref<any>(null);
watch(searchTicketNumber, function () {
  getWorkOrder();
});

//工单编号
let workOrderList = ref<any[]>([]);
let tablePage = ref<number>(1);
watch(tablePage, function () {
  getWorkOrder();
});
//一共有多少行工单数据
let tableDataLength = ref<number>(0);
// 工单表格有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableDataLength.value / 10);
});
async function getWorkOrder() {
  const data: any = await useHttp(
    "/MesWorkOrder/M01GetWorkOrderList",
    "get",
    undefined,
    {
      start_date: startDate.value,
      end_date: endDate.value,
      workorder_hid: searchTicketNumber.value,
      PageIndex: tablePage.value,
      PageSize: 10,
      SortType: 1,
      SortedBy: "id",
    }
  );
  workOrderList.value = data.data.pageList;
  tableDataLength.value = data.data.totalCount;
}

//搜索项目号
function filter() {
  tablePage.value = 1;
  getWorkOrder();
}

//存储工单明细的信息
let workOrderDetailList = ref<any[]>([]);
//存储工单编号
let workOrder = ref<any>(null);
//查询当前工单下的工单明细的良品统计
async function showProcess(item: any) {
  workOrder.value = item.workorder_hid;
  const data: any = await useHttp(
    "/MesWorkOrder/M79ProductStatistics",
    "get",
    undefined,
    {
      workorder_hid: item.workorder_hid,
    }
  );
  workOrderDetailList.value = data.data;
}
onMounted(() => {
  startDate.value = nowDate.toISOString().substring(0, 10);
  endDate.value = oldDate.toISOString().substring(0, 10);
  startDateInfo.value = nowDate2.toISOString().substring(0, 10);
  endDateInfo.value = oldDate2.toISOString().substring(0, 10);
  getWorkOrder();
});
//存储工序中的良品统计
let produceList = ref<any[]>([]);
//获取工序数据
async function getProduceData() {
  const data: any = await useHttp(
    "/MesWorkProcess/M80ProcedureProductStatistics",
    "get",
    undefined,
    {
      procedure_id: "",
      procedure_name: searchName.value,
      start_time: startDateInfo.value,
      end_time: endDateInfo.value,
    }
  );
  produceList.value = data.data;
}
//搜素
function filterData() {
  getProduceData();
}
//重置搜索
function resetFilterData() {
  (searchName.value = ""),
    (startDateInfo.value = nowDate2.toISOString().substring(0, 10));
  endDateInfo.value = oldDate2.toISOString().substring(0, 10);
  getProduceData();
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="1" class="py-3 pl-3 pr-2">
      <v-card height="85vh">
        <v-toolbar density="compact">
          <v-toolbar-title class="text-center ml-0 text-blue font-weight-bold">
            页面
          </v-toolbar-title>
        </v-toolbar>
        <v-tabs color="blue" direction="vertical" v-model="showingTab">
          <v-tab value="工单统计">工单统计</v-tab>
          <v-tab value="工序统计" @click="getProduceData">工序统计</v-tab>
        </v-tabs>
      </v-card>
    </v-col>
    <v-col cols="11" class="py-3 pr-3">
      <v-window v-model="showingTab">
        <v-window-item value="工单统计">
          <v-row no-gutters>
            <v-col cols="3" class="pr-2">
              <v-card height="85vh">
                <v-toolbar density="compact">
                  <v-toolbar-title class="ml-2 text-blue font-weight-bold">
                    工单号
                  </v-toolbar-title>
                </v-toolbar>
                <v-row class="ma-1">
                  <v-col cols="6">
                    <v-text-field
                      label="最早计划开始日期"
                      variant="outlined"
                      density="compact"
                      v-model="startDate"
                      type="date"
                      class="mt-2"
                      hide-details
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
                      class="mt-2"
                      hide-details
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="工单编号"
                      variant="outlined"
                      density="compact"
                      v-model="searchTicketNumber"
                      hide-details
                    ></v-text-field
                  ></v-col>
                  <v-col cols="6">
                    <v-btn
                      color="blue-darken-2"
                      class="mr-1"
                      size="large"
                      @click="filter"
                      >搜索</v-btn
                    >
                  </v-col>
                </v-row>

                <div style="height: 58vh" class="overflow-y-auto">
                  <v-list v-for="(item, index) in workOrderList" :key="index">
                    <v-list-item @click="showProcess(item)">
                      <template v-slot:default>
                        <div>
                          {{ item.workorder_hid }}
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </div>
                <div class="text-center pt-2">
                  <v-pagination
                    density="compact"
                    v-model="tablePage"
                    :length="tablePageCount"
                  ></v-pagination>
                </div>
              </v-card>
            </v-col>
            <v-col cols="9">
              <v-card height="85vh">
                <v-toolbar density="compact">
                  <v-toolbar-title
                    class="ml-2 text-blue font-weight-bold"
                    v-if="workOrder"
                  >
                    【{{ workOrder }}】 工单明细
                  </v-toolbar-title>
                  <v-toolbar-title
                    class="ml-2 text-blue font-weight-bold"
                    v-else
                  >
                    工单明细
                  </v-toolbar-title>
                </v-toolbar>
                <div style="height: 80vh" class="overflow-y-auto">
                  <v-expansion-panels variant="accordion" class="my-4">
                    <v-expansion-panel
                      v-for="(item, index) in workOrderDetailList"
                      :key="index"
                    >
                      <v-expansion-panel-title>
                        <div style="flex-basis: 20%">
                          工单明细：
                          <span class="text-subtitle-2">
                            {{ item.workorder_did }}
                          </span>
                        </div>
                        <div style="flex-basis: 15%">
                          计划数量:
                          <span class="text-subtitle-2">
                            {{ item.planned_quantity }}{{ item.unit }}
                          </span>
                        </div>
                        <div style="flex-basis: 16%">
                          状态:
                          <span class="text-subtitle-2">
                            {{ item.status }}
                          </span>
                        </div>
                        <div style="flex-basis: 25%">
                          产出料:
                          <span class="text-subtitle-2">
                            {{ item.mdescription }}
                          </span>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-list
                          v-for="(item_, index_) in item.production_recodelist"
                          :key="index_"
                        >
                          <v-list-item>
                            <template v-slot:default>
                              <div class="d-flex">
                                <div style="flex-basis: 20%">
                                  良品统计：
                                  <v-progress-circular
                                    :rotate="360"
                                    :size="60"
                                    :width="10"
                                    :model-value="
                                      item_.planned_quantity === 0
                                        ? 0 + '%'
                                        : Math.round(
                                            ((item_.planned_quantity -
                                              item_.non_conforming_quantity) /
                                              item_.planned_quantity) *
                                              100
                                          ) + '%'
                                    "
                                    :color="
                                      Math.round(
                                        ((item_.planned_quantity -
                                          item_.non_conforming_quantity) /
                                          item_.planned_quantity) *
                                          100
                                      ) >= 80
                                        ? 'green'
                                        : 'red'
                                    "
                                  >
                                    {{
                                      item_.planned_quantity === 0
                                        ? 0 + "%"
                                        : Math.round(
                                            ((item_.planned_quantity -
                                              item_.non_conforming_quantity) /
                                              item_.planned_quantity) *
                                              100
                                          ) + "%"
                                    }}
                                  </v-progress-circular>
                                </div>
                                <div style="flex-basis: 20%" class="mt-4">
                                  派工单号：
                                  <span class="text-subtitle-2">
                                    {{ item_.dispatch_order }}
                                  </span>
                                </div>
                                <div style="flex-basis: 12%" class="mt-4">
                                  工序：
                                  <span class="text-subtitle-2">
                                    {{ item_.procedure_name }}
                                  </span>
                                </div>
                                <div style="flex-basis: 12%" class="mt-4">
                                  不良品数量：
                                  <span class="text-subtitle-2">
                                    {{
                                      item_.non_conforming_quantity === null
                                        ? 0
                                        : item_.non_conforming_quantity
                                    }}
                                  </span>
                                </div>
                              </div>
                            </template>
                          </v-list-item>
                          <v-divider :thickness="3" color="info"></v-divider>
                        </v-list>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="工序统计">
          <v-row no-gutters>
            <v-col cols="12">
              <v-card height="85vh">
                <v-toolbar density="compact">
                  <v-toolbar-title class="ml-2 text-blue font-weight-bold">
                    良品统计
                  </v-toolbar-title>
                </v-toolbar>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      label="最早计划开始日期"
                      variant="outlined"
                      density="compact"
                      v-model="startDateInfo"
                      type="date"
                      class="mt-2"
                      hide-details
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="最晚计划开始日期"
                      type="date"
                      variant="outlined"
                      density="compact"
                      v-model="endDateInfo"
                      class="mt-2"
                      hide-details
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="工序名称"
                      variant="outlined"
                      density="compact"
                      v-model="searchName"
                      class="mt-2"
                      hide-details
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="blue-darken-2"
                      class="mr-2 mt-2"
                      size="default"
                      @click="filterData"
                      >搜索</v-btn
                    >
                    <v-btn
                      color="red"
                      class="mr-2 mt-2"
                      size="default"
                      @click="resetFilterData"
                      >重置搜索</v-btn
                    >
                  </v-col>
                  <v-col cols="12">
                    <div style="height: 60vh" class="overflow-y-auto">
                      <v-list v-for="(item, index) in produceList" :key="index">
                        <v-list-item>
                          <template v-slot:default>
                            <div class="d-flex">
                              <div style="flex-basis: 15%">
                                良品统计：
                                <v-progress-circular
                                  :rotate="360"
                                  :size="60"
                                  :width="10"
                                  :model-value="
                                    Math.round(
                                      (item.total_qualified /
                                        item.total_inspection_quantity) *
                                        100
                                    ) + '%'
                                  "
                                  :color="
                                    Math.round(
                                      (item.total_qualified /
                                        item.total_inspection_quantity) *
                                        100
                                    ) >= 80
                                      ? 'green'
                                      : 'red'
                                  "
                                >
                                  {{
                                    Math.round(
                                      (item.total_qualified /
                                        item.total_inspection_quantity) *
                                        100
                                    ) + "%"
                                  }}
                                </v-progress-circular>
                              </div>
                              <div style="flex-basis: 15%" class="mt-4">
                                [{{ item.procedure_name }}]
                              </div>
                              <div style="flex-basis: 15%" class="mt-4">
                                质检数量：{{ item.total_inspection_quantity }}
                              </div>
                              <div style="flex-basis: 15%" class="mt-4">
                                良品数量：{{ item.total_qualified }}
                              </div>
                              <div style="flex-basis: 15%" class="mt-4">
                                不良品数量：{{ item.totalnon_conforming }}
                              </div>
                            </div>
                          </template>
                        </v-list-item>
                        <v-divider :thickness="3" color="info"></v-divider>
                      </v-list>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>
