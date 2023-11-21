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
let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);

let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 1);

let searchStartDate = nowDate.toISOString().substring(0, 10);
let searchEndDate = oldDate.toISOString().substring(0, 10);
let searchDO = ref<any>(null);
let searchName = ref<any>(null);
//存储质检状态为已处理质检单数据
let qaList = ref<any[]>([]);
//获取质检单的数据
async function getQaData() {
  const data: any = await useHttp(
    "/QaQatask/M39GetQaQataskList",
    "get",
    undefined,
    {
      dispatch_order: searchDO.value,
      material_name: searchName.value,
      start_time: searchStartDate,
      end_time: searchEndDate,
      inspection_status: "已处理",
      scan_result: "部分合格,不合格",
      PageIndex: 1,
      PageSize: 100000,
      SortedBy: "dispatch_order",
      SortType: 0,
    }
  );

  qaList.value = data.data.pageList.map((item: any) => {
    if (item.create_time) item.create_time = item.create_time.substring(0, 10);
    return item;
  });
  let grouped = qaList.value.reduce((acc: any, cur: any) => {
    if (
      !acc[cur.dispatch_order] ||
      acc[cur.dispatch_order].non_conforming_quantity <
        cur.non_conforming_quantity
    ) {
      acc[cur.dispatch_order] = cur;
    }
    return acc;
  }, {});

  qaList.value = Object.values(grouped);
}

//重置搜索
function resetFilter() {
  (searchName.value = ""),
    (searchDO.value = ""),
    (searchStartDate = nowDate.toISOString().substring(0, 10)),
    (searchEndDate = oldDate.toISOString().substring(0, 10)),
    getQaData();
}
//搜素
async function filter() {
  getQaData();
}

onMounted(() => {
  getQaData();
});
</script>

<template>
  <v-row no-gutters style="height: calc(100vh - 84px)">
    <v-col cols="1" class="py-3 pl-3 pr-2">
      <v-card height="85vh">
        <v-toolbar density="compact">
          <v-toolbar-title class="text-center ml-0 text-blue font-weight-bold"
            >页面</v-toolbar-title
          >
        </v-toolbar>
        <v-tabs color="blue" direction="vertical" v-model="showingTab">
          <v-tab value="派工单统计">派工单统计</v-tab>
          <v-tab value="工序统计">工序统计</v-tab>
        </v-tabs>
      </v-card>
    </v-col>
    <v-col cols="11" class="py-3 pr-3">
      <v-window v-model="showingTab">
        <v-window-item value="派工单统计">
          <v-card elevation="2" height="85vh">
            <v-toolbar density="compact">
              <v-toolbar-title class="ml-2 text-blue font-weight-bold">
                派工单良品统计
              </v-toolbar-title>
            </v-toolbar>
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
              <v-col cols="12">
                <v-btn
                  color="blue-darken-2"
                  class="mr-2"
                  size="large"
                  @click="filter"
                  >查询</v-btn
                >
                <v-btn
                  color="red"
                  class="mr-2"
                  size="large"
                  @click="resetFilter"
                >
                  重置查询
                </v-btn>
              </v-col>
              <v-col cols="12">
                <div class="overflow-y-auto" style="height: 63vh">
                  <v-list
                    v-for="(item, index) in qaList"
                    :key="index"
                    density="compact"
                    class="ma-2 elevation-2 rounded-lg"
                  >
                    <v-list-item>
                      <template v-slot:default>
                        <div class="d-flex">
                          <div style="flex-basis: 12%">
                            不良品率：
                            <v-progress-circular
                              :rotate="90"
                              :size="60"
                              :width="10"
                              color="red"
                              :model-value="
                                Math.round(
                                  (item.non_conforming_quantity /
                                    item.inspection_quantity) *
                                    100
                                ) + '%'
                              "
                            >
                              {{
                                Math.round(
                                  (item.non_conforming_quantity /
                                    item.inspection_quantity) *
                                    100
                                ) + "%"
                              }}
                            </v-progress-circular>
                          </div>
                          <div style="flex-basis: 15%" class="mt-4">
                            派工单号：{{ item.dispatch_order }}
                          </div>
                          <div style="flex-basis: 15%" class="mt-4">
                            创建时间：{{ item.create_time }}
                          </div>
                          <div style="flex-basis: 10%" class="mt-4">
                            质检数量：{{ item.inspection_quantity }}
                          </div>
                          <div style="flex-basis: 10%" class="mt-4">
                            不良品：{{ item.non_conforming_quantity }}
                          </div>
                          <div style="flex-basis: 20%" class="mt-4">
                            工序：[{{ item.procedure_description }}]
                          </div>
                          <div style="flex-basis: 25%" class="mt-4">
                            物料名称：{{ item.material_name }}
                          </div>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
          </v-card>
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
