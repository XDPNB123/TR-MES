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
onMounted(() => {
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
    }
  );
  projectCodeList.value = data.data;
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
  workDetailList.value = data.data.map((item: any) => {
    item.mes_workorderdetaildata.estimated_delivery_date =
      item.mes_workorderdetaildata.estimated_delivery_date.substring(0, 10);
    return item;
  });
  console.log(workDetailList.value);
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
    <v-col cols="2">
      <v-card height="85vh" elevation="2">
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-2">项目号</v-toolbar-title>
        </v-toolbar>
        <v-text-field
          label="项目号搜索"
          variant="outlined"
          density="compact"
          hide-details
          v-model="projectCode"
        ></v-text-field>
        <v-tabs
          v-model="tab1"
          grow
          color="blue"
          direction="vertical"
          show-arrows
        >
          <v-tab
            v-for="(item, index) in projectCodeList"
            :key="index"
            :value="index"
            @click="showProgress(item)"
            >{{ item }}</v-tab
          >
        </v-tabs>
      </v-card>
    </v-col>
    <!-- 右侧的工单进度 -->
    <v-col cols="10" height="85vh" elevation="2">
      <v-card>
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-2">工单进度</v-toolbar-title>
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
                  >{{ _item.typename }}({{ _item.totalcount }})</v-tab
                >
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
                          <div style="flex-basis: 20%">
                            工单明细编号：
                            {{ element.mes_workorderdetaildata.workorder_did }}
                          </div>
                          <!-- 产出料 -->
                          <div style="flex-basis: 20%">
                            产出料：{{
                              element.mes_workorderdetaildata.mdescription
                            }}
                          </div>

                          <!-- 计划产出料数量 -->
                          <div style="flex-basis: 10%">
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
                          <div style="flex-basis: 10%">
                            当前进度:
                            <v-progress-circular
                              :model-value="
                                Math.round(
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
                                  Math.round(
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
                          <v-list-item v-for="(item_, index_) in productList">
                            <template v-slot:default>
                              <div class="d-flex align-center">
                                <div style="flex-basis: 7%">
                                  进度：<v-progress-circular
                                    :model-value="
                                      Math.round(
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
                                        Math.round(
                                          (item_.reported_quantity /
                                            item_.planned_quantity) *
                                            100
                                        ) + "%"
                                      }}</span
                                    >
                                  </v-progress-circular>
                                </div>

                                <div
                                  style="flex-basis: 13%"
                                  v-if="item_.dispatch_order"
                                >
                                  派工单号：{{ item_.dispatch_order }}
                                </div>
                                <div style="flex-basis: 13%" v-else>
                                  派工单号：任务未派工
                                </div>
                                <div style="flex-basis: 10%">
                                  工序顺序：{{ item_.procedure_order_id }}
                                </div>
                                <div style="flex-basis: 15%">
                                  计划日期：{{ item_.planned_completion_time }}
                                </div>
                                <div style="flex-basis: 20%">
                                  工序：[{{ item_.procedure_description }}]
                                </div>
                                <div style="flex-basis: 10%">
                                  是否委外：{{
                                    item_.defaul_outsource === "N" ? "否" : "是"
                                  }}
                                </div>
                                <div style="flex-basis: 10%">
                                  计划数量：{{ item_.planned_quantity }}
                                </div>
                                <div style="flex-basis: 10%">
                                  报工数量：{{ item_.reported_quantity }}
                                </div>
                                <div
                                  style="flex-basis: 10%"
                                  v-if="item_.work_center_name"
                                >
                                  @{{ item_.work_center_name }}
                                </div>
                                <div style="flex-basis: 13%" v-else>
                                  工作中心：未分配工作中心
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
