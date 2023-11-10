<script setup lang="ts">
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
      projectCodeList: item,
    }
  );
  workDetailList.value = data.data;
  console.log(workDetailList.value);
}
let productList = ref<any[]>([]);
//获取排产数据
async function getProductList(item: any) {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M77Getprogress",
    "get",
    undefined,
    {
      workorderdid: item,
    }
  );
  productList.value = data.data;
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
                          <v-stepper model-value="2" vertical>
                            <v-stepper-header>
                              <v-stepper-item
                                complete
                                title="Select campaign settings"
                                value="1"
                              ></v-stepper-item>

                              <v-divider></v-divider>

                              <v-stepper-item
                                title="Create an ad group"
                                value="2"
                              ></v-stepper-item>

                              <v-divider></v-divider>

                              <v-stepper-item
                                title="Create an ad"
                                value="3"
                              ></v-stepper-item>
                            </v-stepper-header>
                          </v-stepper>
                          <v-list-item>
                            <template v-slot:prepend>
                              <div>派工单号：PD12300</div>
                              <div class="ml-4">工序：打磨</div>
                              <div class="ml-4">工作中心：下料工站</div>
                            </template>
                            <template v-slot:append>
                              <div>进度：100%</div>
                            </template>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <div>派工单号：PD12300</div>
                              <div class="ml-4">工序：打磨</div>
                              <div class="ml-4">工作中心：下料工站</div>
                            </template>
                            <template v-slot:append>
                              <div>进度：50%</div>
                            </template>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <div>派工单号：PD12300</div>
                              <div class="ml-4">工序：打磨</div>
                              <div class="ml-4">工作中心：下料工站</div>
                            </template>
                            <template v-slot:append>
                              <div>进度：0%</div>
                            </template>
                          </v-list-item>
                        </v-expansion-panel-text>
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
