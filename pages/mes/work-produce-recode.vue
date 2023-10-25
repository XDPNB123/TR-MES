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
//多选
let selected = ref<any[]>([]);
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
    workOrderList.value = data.data.pageList
      .filter((item: any) => item.status === "已审核待排产")
      .map((item: any) => {
        item.finish_date = item.finish_date.substring(0, 10);
        return item;
      });
  } catch (error) {
    console.log(error);
  }
}
watch(selected, () => {
  detailName.value = selected.value.join(",");
  if (tabArr1.value.length) {
    return alert("请你保存或者取消你当前的操作，才可以对其他的工单进行操作");
  }
  getWorkProduce();
});

//工单工序操作
let workDetailList = ref<any[]>([]);

//获取工单工序数据
async function getWorkProduce() {
  try {
    const data: any = await useHttp(
      "/ProductionRecode/M21ProductionRecodeList",
      "get",
      undefined,
      {
        PageIndex: 1,
        PageSize: 1000000,
        SortType: 1,
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
      )
      .sort((a: any, b: any) => {
        if (a.procedure_order_id < b.procedure_order_id) {
          return -1;
        }
        if (a.procedure_order_id > b.procedure_order_id) {
          return 1;
        }
        return 0;
      });
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

  // 获取离该元素最近的 card 元素
  let cardElement = element.closest(".v-responsive__content");

  // 如果没有拖到工作中心容器内，则拖动无效
  if (!cardElement || cardElement.children.length !== 4) return;

  // 获取 card 元素的所有子元素
  const cardChildren = cardElement.children;

  item.work_center_id = cardChildren[3].innerText.substring(3);
  workCenterId.value = cardChildren[3].innerText.substring(3);
  workCenterName.value = cardChildren[0].innerText.substring(3);

  item.assignment_date = new Date().toISOString().split("T")[0];
  workDetailList.value.splice(workDetailList.value.indexOf(item), 1);
  tabArr.value.push(item);
  tabArr1.value.push(item);
  getCenterProduce();

  console.log(tabArr.value);
}

//存储工作中心的集合
let workCenterList = ref<any[]>([]);
let workPage = ref<number>(1);
watch(workPage, function () {
  getWorkCenterList();
});

//搜素
let searchWorkCenterName = ref<string>("");
let searchType = ref<string>("");
let searchWorkCenterAddress = ref<string>("");

let workDetailCount = ref<number>(0);
//获取工作中心数据
async function getWorkCenterList() {
  const data = await useHttp(
    "/WorkCenter/M13WorkCenterList",
    "get",
    undefined,
    {
      work_center_address: searchWorkCenterAddress.value,
      work_center_name: searchWorkCenterName.value,
      type: searchType.value,
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
//按条件搜素工作中心
function searchWorkCenterList() {
  workPage.value = 1;
  getWorkCenterList();
}
//重置搜素
function resetSearch() {
  workPage.value = 1;
  searchWorkCenterName.value = "";
  searchType.value = "";
  searchWorkCenterAddress.value = "";
  getWorkCenterList();
}

onMounted(() => {
  getWorkOrder();
  getWorkCenterList();
});

//用显示来工作中心中任务的数据
let tempTabArr = ref<any[]>([]);
watch(tempTabArr, () => {
  tempTabArr.value.sort((a, b) => {
    if (a.procedure_order_id < b.procedure_order_id) {
      return -1;
    }
    if (a.procedure_order_id > b.procedure_order_id) {
      return 1;
    }
    return 0;
  });
});

//存储工作中心编号
let workCenterId = ref("");
let workCenterName = ref("");
//点击工作中心查看工作中心的任务
function showCenterDetail(item: any) {
  workCenterId.value = item.work_center_id;
  workCenterName.value = item.work_center_name;
  getCenterProduce();
}
//获取工作中心的工单工序内容
async function getCenterProduce() {
  const data: any = await useHttp(
    "/ProductionRecode/M21ProductionRecodeList",
    "get",
    undefined,
    {
      PageIndex: 1,
      PageSize: 10000,
      SortType: 0,
      SortedBy: "id",
      work_center_id: workCenterId.value,
    }
  );
  tabArr.value = tabArr1.value;
  tabArr.value = [...tabArr.value, ...data.data.pageList];
  console.log(workCenterId.value);
  tempTabArr.value = tabArr.value
    .filter(
      (_item: any) =>
        (_item.work_center_id !== "" || _item.work_center_id !== null) &&
        _item.work_center_id === workCenterId.value
    )
    .map((item: any) => {
      item.planned_completion_time = item.planned_completion_time.substring(
        0,
        10
      );
      return item;
    });
}

//确定保存
async function updateCenterId() {
  if (!tabArr1.value.length) {
    return alert("你没有拖拽工单工序到对应的工作中心当中");
  }
  await useHttp(
    "/ProductionRecode/M23UpdateProductionRecode",
    "put",
    tabArr.value
  );
  //判断是否更改工单状态
  if (detailName.value !== "" && workDetailList.value.length === 0) {
    const workOrder = workOrderList.value.find(
      (item: any) => item.workorder_hid === detailName.value
    );
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
  if (!tabArr1.value.length) {
    return;
  }
  tabArr1.value = [];
  tabArr.value = [];
}
//通过监听tabArr1的内容来更改工作中心详情的内容
watch(tabArr1, async function () {
  await getCenterProduce();
  await getWorkProduce();
});
</script>
<template>
  <v-row no-gutters class="ma-2">
    <v-col cols="1" class="bg-light-blue-lighten-5 mr-2">
      <v-tabs direction="vertical">
        <v-tab color="green"> 工单排产 </v-tab>
        <v-tab color="green"> 产能视图 </v-tab>
      </v-tabs>
    </v-col>
    <v-col>
      <v-card>
        <v-row>
          <v-col cols="2" class="bg-light-blue-lighten-5">
            <v-card flat border title="未排产工单">
              <v-list
                v-for="(item, index) in workOrderList"
                :key="index"
                class="w-100"
              >
                <v-divider :thickness="4"></v-divider>
                <div class="bg-light-blue-lighten-5">
                  <v-checkbox
                    v-model="selected"
                    :label="item.workorder_hid"
                    :value="item.workorder_hid"
                  ></v-checkbox>
                  <v-list-item>
                    <template v-slot:prepend>
                      <div>完成日期：{{ item.finish_date }}</div>
                    </template>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <div>
                        数量：{{ item.planned_quantity }}{{ item.unit }}
                      </div>
                    </template>
                  </v-list-item>
                </div>
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
              <v-row mx-2>
                <v-col cols="4">
                  <v-text-field
                    label="工作中心名称"
                    v-model="searchWorkCenterName"
                    variant="outlined"
                    density="compact"
                    class="mt-3"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="工作中心类型"
                    v-model="searchType"
                    variant="outlined"
                    density="compact"
                    class="mt-3"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="工作中心地址"
                    v-model="searchWorkCenterAddress"
                    variant="outlined"
                    density="compact"
                    class="mt-3"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-3">
                  <v-btn
                    size="large"
                    color="blue-darken-2"
                    class="mr-3"
                    prepend-icon="fa-solid fa-search"
                    @click="searchWorkCenterList()"
                    >条件查询</v-btn
                  >
                  <v-btn
                    size="large"
                    color="red"
                    class="mr-3"
                    prepend-icon="fa-solid fa-hourglass-start"
                    @click="resetSearch()"
                    >重置查询</v-btn
                  >
                </v-col>
                <v-col cols="3" v-for="(item, index) in workCenterList">
                  <v-card class="mx-2" @click="showCenterDetail(item)">
                    <v-img src="/工作中心.jpg">
                      <v-card-title>{{ item.work_center_name }}</v-card-title>
                      <v-card-subtitle>类型：{{ item.type }}</v-card-subtitle>
                      <v-card-subtitle
                        >位置：{{ item.work_center_address }}</v-card-subtitle
                      >
                      <v-card-subtitle>
                        编号：{{ item.work_center_id }}
                      </v-card-subtitle>
                    </v-img>
                  </v-card>
                  <!-- <div
                    
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
                  </div> -->
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
</style>
