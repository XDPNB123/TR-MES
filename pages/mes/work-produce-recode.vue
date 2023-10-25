<script setup lang="ts">
import draggable from "vuedraggable";
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "工单排产",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工单排产",
  // 该页面的描述
  description: "同日 MES 系统，工单排产",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，工单排产",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});

// 页面缓存
definePageMeta({
  keepalive: true,
});
let detailName = ref<any>("");
let workOrderList = ref<any[]>([]);
//获取工单数据
async function getWorkOrder() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrder/M01GetWorkOrderList",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 10,
        SortType: 0,
        SortedBy: "id",
      }
    );
    workOrderList.value = data.data.pageList.filter(
      (item: any) => item.status === "已审核待排产"
    );
  } catch (error) {
    console.log(error);
  }
}
function showWorkOrderHid(item: any) {
  if (tabArr.value.length) {
    return alert("请你确认或者取消你当前的操作，才可以对其他的工单进行操作");
  }
  detailName.value = item.workorder_hid;
  getWorkOrderDetail();
}
//工单工序操作
let workDetailList = ref<any[]>([]);

//获取工单工序数据
async function getWorkOrderDetail() {
  try {
    const data: any = await useHttp(
      "/ProductionRecode/M21ProductionRecodeList",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 1000000,
        SortType: 0,
        SortedBy: "id",
        workorder_hid: detailName.value,
      }
    );
    workDetailList.value = data.data.pageList
      .map((item: any) => {
        item.planned_completion_time = item.planned_completion_time.substring(
          0,
          10
        );
        item.assignment_date = item.assignment_date.substring(0, 10);
        return item;
      })
      .filter(
        (_item: any) =>
          _item.work_center_id === null || _item.work_center_id === ""
      );
  } catch (error) {
    console.log(error);
  }
}

let tabArr = ref<any[]>([]);
let tabArr1 = ref<any[]>([]);

//将工序数据拖拽到工作中心
function onDragEnd(event: any, item: any) {
  // 获取鼠标的位置
  const x = event.clientX;
  const y = event.clientY;

  // 获取鼠标所在位置的元素
  let element: any = document.elementFromPoint(x, y);

  console.log(element);
  if (
    !element?.children ||
    !element?.children[1]?.innerText ||
    element.children[1].innerText !== "工作中心"
  )
    return;
  item.work_center_id = element.children[0].innerText;
  workDetailList.value.splice(workDetailList.value.indexOf(item), 1);
  tabArr.value.push(item);
  tabArr1.value.push(item);
}

//存储工作中心的集合
let workCenterList = ref<any[]>([]);
let workPage = ref<number>(1);
watch(workPage, function () {
  getWorkCenterList();
});
let workDetailCount = ref<number>(0);
//获取工作中心数据
async function getWorkCenterList() {
  const data = await useHttp(
    "/WorkCenter/M13WorkCenterList",
    "get",
    undefined,
    {
      PageIndex: workPage.value,
      PageSize: 4,
      SortedBy: "id",
      SortType: 0,
    }
  );
  workCenterList.value = data.data.pageList;
  workDetailCount.value = data.data.totalCount;
}
//工单工序的页数
let tableDetailPageCount = computed(() => {
  return Math.ceil(workDetailCount.value / 4);
});
onMounted(() => {
  getWorkOrder();
  getWorkCenterList();
});

//用显示来工作中心的数据
let tempTabArr = ref<any[]>([]);
//存储工作中心编号
let workCenterId = ref("");
let workCenterName = ref("");
//点击工作中心查看工作中心的任务
function showCenterDetail(item: any) {
  workCenterId.value = item.work_center_id;
  workCenterName.value = item.work_center_name;
  getCenterDetail();
}
//获取工作中心的内容
async function getCenterDetail() {
  const data: any = await useHttp(
    "/ProductionRecode/M21ProductionRecodeList",
    "get",
    undefined,
    {
      PageIndex: 1,
      PageSize: 10,
      SortType: 1,
      SortedBy: "id",
      work_center_id: workCenterId.value,
    }
  );
  tabArr.value = tabArr1.value;
  tabArr.value = [...tabArr.value, ...data.data.pageList];
  tempTabArr.value = tabArr.value.filter(
    (_item: any) => _item.work_center_id === workCenterId.value
  );
}

//确定保存
async function updateCenterId() {
  await useHttp(
    "/ProductionRecode/M23UpdateProductionRecode",
    "put",
    tabArr.value
  );
  if (detailName.value !== "" && workDetailList.value.length === 0) {
    const workOrder = workOrderList.value.find(
      (item: any) => item.workorder_hid === detailName.value
    );
    console.log(workOrder);
    workOrder.status = "已排产生产中";
    //修改当前工单的状态
    await useHttp(
      "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
      "put",
      workOrder
    );
    getWorkOrder();
    detailName.value = "";
  }

  tabArr.value = [];
  tabArr1.value = [];
}
//取消添加工作中心
function cancel() {
  tabArr1.value = [];
  tabArr.value = [];
  getWorkOrderDetail();
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="1" class="bg-light-blue-lighten-5">
      <v-tabs direction="vertical">
        <v-tab color="green"> 工单排产 </v-tab>
        <v-tab color="green"> 产能视图 </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="11">
      <v-card>
        <v-row>
          <v-col cols="2" class="bg-light-blue-lighten-5">
            <v-card flat border>
              <v-list
                v-for="(item, index) in workOrderList"
                :key="index"
                class="w-100"
              >
                <v-list-item
                  :title="item.workorder_hid"
                  :subtitle="item.workorder_type"
                  @click="showWorkOrderHid(item)"
                >
                  <template v-slot:append>
                    <div>{{ item.planned_quantity }}{{ item.unit }}</div>
                  </template>
                </v-list-item>
                <v-divider :thickness="4"></v-divider>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="10">
            <v-card class="bg-light-blue-lighten-5">
              <v-card-title v-if="detailName"
                >({{ detailName }})工单工序</v-card-title
              >
              <v-card-title v-else>工单工序</v-card-title>
              <div class="overflow-x-auto" style="white-space: nowrap">
                <v-card
                  draggable="true"
                  @dragend="onDragEnd($event, element)"
                  class="mx-2"
                  style="display: inline-block"
                  :border="true"
                  v-for="(element, index) in workDetailList"
                  :key="index"
                  v-if="workDetailList.length"
                >
                  <v-list v-show="!element.work_center_id" density="compact">
                    <v-list-item>
                      <template v-slot:default>
                        <div>工序顺序：{{ element.procedure_order_id }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>工序名称：{{ element.procedure_name }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>是否委外：{{ element.defaul_outsource }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>产出料：{{ element.material_name }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>数量：{{ element.planned_quantity }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>
                          交付日期：{{ element.planned_completion_time }}
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
                <div v-else class="text-center">工单工序已分配完成</div>
              </div>
            </v-card>
            <!-- 工作中心 -->
            <v-card class="bg-light-blue-lighten-5 mt-2" title="工作中心">
              <v-row>
                <v-col cols="3" v-for="(item, index) in workCenterList">
                  <div
                    class="work-center-container mx-2"
                    @click="showCenterDetail(item)"
                  >
                    {{ item.work_center_name }}
                    <span v-show="false">{{ item.work_center_id }}</span>
                    <span v-show="false">工作中心</span>
                    <div class="text-bottom">
                      <span class="text-subtitle-1">{{ item.type }}</span>
                      <span class="text-subtitle-1">{{
                        item.work_center_address
                      }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <div class="text-center pt-2">
                <v-pagination
                  v-model="workPage"
                  :length="tableDetailPageCount"
                ></v-pagination>
              </div>
              <div class="d-flex justify-end mr-6 my-4">
                <v-btn
                  color="blue-darken-2"
                  size="large"
                  class="mr-2"
                  @click="updateCenterId()"
                >
                  保存信息
                </v-btn>
                <v-btn color="grey" size="large" @click="cancel"> 取消 </v-btn>
              </div>
            </v-card>

            <!-- 工作详情 -->
            <v-card class="bg-blue-lighten-5 mt-2">
              <v-card-title v-if="workCenterName">
                ({{ workCenterName }})工作中心详情
              </v-card-title>
              <v-card-title v-else>工作中心详情</v-card-title>
              <div class="overflow-x-auto" style="white-space: nowrap">
                <v-card
                  class="mx-2"
                  style="display: inline-block"
                  :border="true"
                  v-for="(element, index) in tempTabArr"
                  :key="index"
                  v-if="tempTabArr.length"
                >
                  <v-list>
                    <v-list-item>
                      <template v-slot:default>
                        <div>工序顺序：{{ element.procedure_order_id }}</div>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:default>
                        <div>工序名称：{{ element.procedure_name }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>是否委外：{{ element.defaul_outsource }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>产出料：{{ element.material_name }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>数量：{{ element.planned_quantity }}</div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div>
                          交付日期：{{ element.planned_completion_time }}
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
                <div v-else class="text-center">当前工作中心没有任务</div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<style scoped>
.inline-card {
  display: inline-flex;
}
.work-center-container {
  background-image: url("/工作中心.jpg");
  background-size: cover;
  font-size: 36px;
  color: black;
  font-weight: 700;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
