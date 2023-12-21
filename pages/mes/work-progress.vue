<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "工单进度",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工单进度",
  // 该页面的描述
  description: "同日 MES 系统，工单进度",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，工单进度",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});

// 页面缓存
definePageMeta({
  keepalive: true,
});
//工单类型
let workTypeList = ref<any[]>([]);
let workTypeInFo = ref<string>("机加,钣金,电器装配,模组装配,总装,其他");
let tab1 = ref<any>(null);
let tab2 = ref<any>(null);

let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);
let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 1);
let startDate = ref<any>(null);
let endDate = ref<any>(null);
onMounted(() => {
  startDate.value = nowDate.toISOString().substring(0, 10);

  endDate.value = oldDate.toISOString().substring(0, 10);
  getProjectCode();
});
//项目号搜素
let projectCode = ref<any>(null);
watch(projectCode, function () {
  getProjectCode();
});
//获取项目号
let projectCodeList = ref<any[]>([]);
async function getProjectCode() {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M75GetProjectCode",
    "get",
    undefined,
    {
      code: projectCode.value,
      start_time: startDate.value,
      end_time: endDate.value,
    }
  );
  projectCodeList.value = data.data;
}
//搜索项目号
function filter() {
  getProjectCode();
}
//重置搜索
function resetFilter() {
  (projectCode.value = ""),
    (startDate.value = nowDate.toISOString().substring(0, 10));
  endDate.value = oldDate.toISOString().substring(0, 10);
  getProjectCode();
}
//获取工单明细数据
async function getWorkDetail() {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M76Getprogress",
    "get",
    undefined,
    {
      type: workType.value,
      projectCode: workProject.value,
    }
  );
  workDetailList.value = data.data
    .map((item: any) => {
      item.mes_workorderdetaildata.estimated_delivery_date =
        item.mes_workorderdetaildata.estimated_delivery_date.substring(0, 10);
      return item;
    })
    .sort((a: any, b: any) => {
      if (
        a.mes_workorderdetaildata.status === "正常完工" &&
        b.mes_workorderdetaildata.status !== "正常完工"
      ) {
        return 1;
      }
      if (
        a.mes_workorderdetaildata.status !== "正常完工" &&
        b.mes_workorderdetaildata.status === "正常完工"
      ) {
        return -1;
      }
      return 0;
    });
}
//点击项目号获取当前项目进度
//暂存项目号
let workProject = ref<any>(null);
//暂存工单类型
let workType = ref<any>(null);
//获取当前项目号下的工单类型和明细
async function showProgress(item: any) {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M77GetWorkOrderType",
    "get",
    undefined,
    {
      typeList: workTypeInFo.value,
      projectCode: item,
    }
  );
  workTypeList.value = data.data;
  workProject.value = item;
  workType.value = workTypeList.value[0].typename;
  tab2.value = 0;
  getWorkDetail();
}

//存储工单明细数据
let workDetailList = ref<any[]>([]);

//获取工单明细数据
async function showWorkDetail(item: any, _item: any) {
  (workProject.value = item), (workType.value = _item.typename);
  getWorkDetail();
}
let productList = ref<any[]>([]);
//获取排产数据
async function getProductList(item: any) {
  const data: any = await useHttp(
    "/ProductionRecode/M21ProductionRecodeList",
    "get",
    undefined,
    {
      workorder_did: item.mes_workorderdetaildata.workorder_did,
      PageIndex: 1,
      PageSize: 100000,
      SortedBy: "id",
      SortType: 0,
    }
  );
  productList.value = data.data.pageList.map((item: any) => {
    item.planned_completion_time = item.planned_completion_time.substring(
      0,
      10
    );
    return item;
  });
}
</script>

<template>
  <v-row class="ma-2">
    <!-- 左侧的项目号 -->
    <v-col cols="3">
      <v-card height="85vh" class="overflow-y-auto" elevation="2">
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-2">项目号</v-toolbar-title>
        </v-toolbar>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="最晚日期搜索"
              variant="outlined"
              density="compact"
              hide-details
              type="date"
              class="mt-2"
              v-model="startDate"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="最早日期搜索"
              variant="outlined"
              density="compact"
              hide-details
              type="date"
              class="mt-2"
              v-model="endDate"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="项目号搜索"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
              v-model="projectCode"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="filter"
              >搜索</v-btn
            >
            <v-btn
              color="red"
              class="mr-2 mt-2"
              size="default"
              @click="resetFilter"
              >重置搜索</v-btn
            >
          </v-col>
        </v-row>

        <v-tabs
          v-model="tab1"
          grow
          color="blue"
          direction="vertical"
          next-icon="fa-solid fa-angle-down"
          prev-icon="fa-solid fa-angle-up"
          show-arrows
          style="height: 65vh"
        >
          <v-tab
            v-for="(item, index) in projectCodeList"
            :key="index"
            :value="index"
            @click="showProgress(item)"
            >{{ item }}
          </v-tab>
        </v-tabs>
      </v-card>
    </v-col>
    <!-- 右侧的工单进度 -->
    <v-col cols="9">
      <v-card height="85vh" elevation="2" class="overflow-y-auto">
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-2" v-if="workProject">
            项目号【{{ workProject }}】的工单进度
          </v-toolbar-title>
          <v-toolbar-title class="ml-2" v-else>工单进度</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <!-- 每个tab对应相应的value -->
          <v-window v-model="tab1">
            <v-window-item
              v-for="(item, index) in projectCodeList"
              :key="index"
              :value="index"
            >
              <!-- 工单类型 -->
              <v-tabs v-model="tab2" grow color="blue">
                <v-tab
                  v-for="(_item, index) in workTypeList"
                  :key="index"
                  :value="index"
                  @click="showWorkDetail(item, _item)"
                  >{{ _item.typename
                  }}({{ _item.completed }}/{{
                    _item.totalcount
                  }})
                </v-tab>
              </v-tabs>
              <div>
                <v-window v-model="tab2">
                  <v-window-item
                    v-for="(_item, index) in workTypeList"
                    :key="index"
                    :value="index"
                  >
                    <v-expansion-panels>
                      <v-expansion-panel
                        v-for="(element, index) in workDetailList"
                        :key="index"
                        @click="getProductList(element)"
                        v-if="workDetailList.length"
                      >
                        <v-expansion-panel-title>
                          <!-- 工单明细编号 -->
                          <div style="flex-basis: 22%">
                            工单明细编号：
                            {{ element.mes_workorderdetaildata.workorder_did }}
                          </div>
                          <!-- 产出料 -->
                          <div style="flex-basis: 30%">
                            <div>
                              产出料：{{
                                element.mes_workorderdetaildata.mdescription
                              }}
                            </div>
                            <div class="mt-2">
                              图纸号：{{
                                element.mes_workorderdetaildata.mcode
                              }}
                            </div>
                          </div>

                          <!-- 计划产出料数量 -->
                          <div style="flex-basis: 13%">
                            计划数量：
                            {{
                              element.mes_workorderdetaildata.planned_quantity
                            }}
                          </div>
                          <!-- 计划交付日期 -->
                          <div style="flex-basis: 20%">
                            计划交付：
                            {{
                              element.mes_workorderdetaildata
                                .estimated_delivery_date
                            }}
                          </div>
                          <!-- 进度 -->
                          <div style="flex-basis: 15%">
                            当前进度:
                            <v-progress-circular
                              :model-value="
                                element.planned_total_quantity === 0
                                  ? '0%'
                                  : element.reported_quantity >
                                    element.planned_total_quantity
                                  ? '100%'
                                  : Math.round(
                                      (element.reported_quantity /
                                        element.planned_total_quantity) *
                                        100
                                    ) + '%'
                              "
                              :size="38"
                              color="deep-orange-lighten-2"
                            >
                              <span style="font-size: 12px">
                                {{
                                  element.planned_total_quantity === 0
                                    ? 0 + "%"
                                    : element.reported_quantity >
                                      element.planned_total_quantity
                                    ? "100%"
                                    : Math.round(
                                        (element.reported_quantity /
                                          element.planned_total_quantity) *
                                          100
                                      ) + "%"
                                }}</span
                              >
                            </v-progress-circular>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-list-item
                            v-for="(item_, index_) in productList"
                            :key="index_"
                          >
                            <template v-slot:default>
                              <div class="d-flex align-center">
                                <div style="flex-basis: 10%">
                                  进度：<v-progress-circular
                                    :model-value="
                                      item_.reported_quantity >
                                      item_.planned_quantity
                                        ? '100%'
                                        : Math.round(
                                            (item_.reported_quantity /
                                              item_.planned_quantity) *
                                              100
                                          ) + '%'
                                    "
                                    :size="38"
                                    color="deep-orange-lighten-2"
                                  >
                                    <span style="font-size: 12px">
                                      {{
                                        item_.reported_quantity >
                                        item_.planned_quantity
                                          ? "100%"
                                          : Math.round(
                                              (item_.reported_quantity /
                                                item_.planned_quantity) *
                                                100
                                            ) + "%"
                                      }}</span
                                    >
                                  </v-progress-circular>
                                </div>

                                <div
                                  style="flex-basis: 15%"
                                  v-if="item_.dispatch_order"
                                >
                                  派工单号：{{ item_.dispatch_order }}
                                </div>
                                <div style="flex-basis: 15%" v-else>
                                  派工单号：任务未派工
                                </div>
                                <div style="flex-basis: 10%">
                                  工序顺序：{{ item_.procedure_order_id }}
                                </div>
                                <div style="flex-basis: 22%">
                                  计划日期：{{ item_.planned_completion_time }}
                                </div>
                                <div style="flex-basis: 22%">
                                  工序：[{{ item_.procedure_description }}]
                                </div>
                                <div style="flex-basis: 10%">
                                  委外：{{
                                    item_.defaul_outsource === "N" ? "否" : "是"
                                  }}
                                </div>
                                <div style="flex-basis: 12%">
                                  计划数量：{{ item_.planned_quantity }}
                                </div>
                                <div style="flex-basis: 12%">
                                  报工数量：{{ item_.reported_quantity }}
                                </div>
                                <div
                                  style="flex-basis: 10%"
                                  v-if="item_.work_center_name"
                                >
                                  @{{ item_.work_center_name }}
                                </div>
                                <div style="flex-basis: 10%" v-else>
                                  未分配工作中心
                                </div>
                              </div>
                            </template>
                          </v-list-item>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel v-else>
                        <div class="text-center text-h6 ml-3 text-grey">
                          当前工作类型下，没有任务
                        </div>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-window-item>
                </v-window>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
