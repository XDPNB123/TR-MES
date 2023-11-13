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
let workTypeList = ref<any[]>([
  "机加",
  "钣金",
  "电器装配",
  "单机装配",
  "总装",
  "其他",
]);
let tab1 = ref<any>(null);
let tab2 = ref<any>(null);
onMounted(() => {
  getProjectCode();
});
//获取项目号
let projectCodeList = ref<any[]>([]);
async function getProjectCode() {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M75GetProjectCode",
    "get",
    undefined
  );
  projectCodeList.value = data.data;
}
//存储工单明细数据
let workDetailList = ref<any[]>([]);

//获取工单明细数据
async function getWorkDetail(item: any, _item: any) {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M76Getprogress",
    "get",
    undefined,
    {
      type: _item,
      projectCode: item,
    }
  );
  workDetailList.value = data.data;
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
  productList.value = data.data.pageList;
  console.log(productList.value);
}
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="12">
      <v-card>
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-2 text-blue font-weight-bold"
            >项目号</v-toolbar-title
          >
        </v-toolbar>

        <v-tabs v-model="tab1" grow color="primary" show-arrows>
          <v-tab
            v-for="(item, index) in projectCodeList"
            :key="index"
            :value="item"
            border
            >{{ item }}</v-tab
          >
        </v-tabs>
        <v-card-text>
          <!-- 每个tab对应相应的value -->
          <v-window v-model="tab1">
            <v-window-item
              v-for="(item, index) in projectCodeList"
              :key="index"
              :value="item"
            >
              <!-- 工单类型 -->
              <v-tabs v-model="tab2" grow color="primary">
                <v-tab
                  v-for="(_item, index) in workTypeList"
                  :key="index"
                  :value="_item"
                  @click="getWorkDetail(item, _item)"
                  >{{ _item }}</v-tab
                >
              </v-tabs>
              <div>
                <v-window v-model="tab2">
                  <v-window-item
                    v-for="(_item, index) in workTypeList"
                    :key="index"
                    :value="_item"
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
                          <div>
                            工单明细编号：
                            {{ element.mes_workorderdetaildata.workorder_did }}
                          </div>
                          <!-- 产出料 -->
                          <div class="ml-6">
                            产出料：{{ element.mes_workorderdetaildata.mcode }}
                          </div>

                          <!-- 计划产出料数量 -->
                          <div class="ml-6">
                            计划数量：
                            {{
                              element.mes_workorderdetaildata.planned_quantity
                            }}
                          </div>
                          <!-- 进度 -->
                          <div class="ml-6">
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
                            <template v-slot:prepend>
                              <div class="d-flex justify-space-around">
                                <div v-if="item_.dispatch_order">
                                  派工单号：{{ item_.dispatch_order }}
                                </div>
                                <div v-else>派工单号：任务未派工</div>
                                <div class="ml-4">
                                  工序描述：{{ item_.procedure_description }}
                                </div>
                                <div class="ml-4">
                                  工序顺序：{{ item_.procedure_order_id }}
                                </div>
                                <div class="ml-4" v-show="item_.dispatch_order">
                                  工作中心：{{ item_.work_center_name }}
                                </div>
                              </div>
                            </template>
                            <template v-slot:append>
                              <div>
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
