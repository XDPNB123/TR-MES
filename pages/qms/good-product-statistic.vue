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
//查询当前工单下的工单明细的良品统计
async function showProcess(item: any) {}
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
            <v-col cols="2" class="pr-2">
              <v-card height="85vh">
                <v-toolbar density="compact">
                  <v-toolbar-title class="ml-2 text-blue font-weight-bold">
                    工单号
                  </v-toolbar-title>
                </v-toolbar>
                <v-text-field
                  label="工单编号"
                  variant="outlined"
                  density="compact"
                  v-model="searchTicketNumber"
                  hide-details
                  class="ma-2"
                ></v-text-field>
                <v-list v-for="(item, index) in workOrderList" :key="index">
                  <v-list-item @click="showProcess(item)">
                    <template v-slot:default>
                      <div>
                        {{ item.workorder_hid }}
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                <div class="text-center pt-2">
                  <v-pagination
                    density="compact"
                    v-model="tablePage"
                    :length="tablePageCount"
                  ></v-pagination>
                </div>
              </v-card>
            </v-col>
            <v-col cols="10">
              <v-card>
                <v-toolbar density="compact">
                  <v-toolbar-title class="ml-2 text-blue font-weight-bold">
                    工单明细
                  </v-toolbar-title>
                </v-toolbar>
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
