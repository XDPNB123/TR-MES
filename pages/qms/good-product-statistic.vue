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

let searchTicketNumber = ref<any>(null);
let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);
let startDate = nowDate.toISOString().substring(0, 10);

let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 1);
let endDate = oldDate.toISOString().substring(0, 10);

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
  getWorkOrder();
}
//重置搜索
function resetFilter() {
  startDate = nowDate.toISOString().substring(0, 10);
  endDate = oldDate.toISOString().substring(0, 10);
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
  console.log(workOrderDetailList.value);
}
onMounted(() => {
  getWorkOrder();
});
</script>

<template>
  <v-row no-gutters style="height: calc(100vh - 84px)">
    <v-col cols="1" class="py-3 pl-3 pr-2">
      <v-card height="85vh">
        <v-toolbar density="compact">
          <v-toolbar-title class="text-center ml-0 text-blue font-weight-bold">
            页面
          </v-toolbar-title>
        </v-toolbar>
        <v-tabs color="blue" direction="vertical" v-model="showingTab">
          <v-tab value="工单统计">工单统计</v-tab>
          <v-tab value="工序统计">工序统计</v-tab>
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
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="最早计划 开始日期"
                      variant="outlined"
                      density="compact"
                      v-model="startDate"
                      type="date"
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
                      class="mr-1 mt-2"
                      size="default"
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
              <v-card height="85vh" class="overflow-y-auto">
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
                <v-list
                  v-for="(item, index) in workOrderDetailList"
                  :key="index"
                >
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
                                (item.qualified_quantity /
                                  item.planned_quantity) *
                                  100
                              ) + '%'
                            "
                            :color="
                              Math.round(
                                (item.qualified_quantity /
                                  item.planned_quantity) *
                                  100
                              ) >= 80
                                ? 'green'
                                : 'red'
                            "
                          >
                            {{
                              Math.round(
                                (item.qualified_quantity /
                                  item.planned_quantity) *
                                  100
                              ) + "%"
                            }}
                          </v-progress-circular>
                        </div>
                        <div style="flex-basis: 20%" class="mt-4">
                          工单明细号：
                          {{ item.workorder_did }}
                        </div>
                        <div style="flex-basis: 12%" class="mt-4">
                          计划数量：
                          {{ item.planned_quantity }}
                        </div>
                        <div style="flex-basis: 12%" class="mt-4">
                          良品数量：
                          {{ item.qualified_quantity }}
                        </div>
                        <div style="flex-basis: 15%" class="mt-4">
                          状态：
                          {{ item.status }}
                        </div>
                        <div style="flex-basis: 25%" class="mt-4">
                          产出料：
                          {{ item.mdescription }}
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="工序统计">
          <v-card>
            <v-toolbar density="compact">
              <v-toolbar-title class="ml-2 text-blue font-weight-bold">
                工序良品统计
              </v-toolbar-title>
            </v-toolbar>
          </v-card>
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>
