<script setup lang="ts">
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
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
//通过改变选择的对象的工单编号来更改工单工序数据
watch(selected, () => {
  detailName.value = selected.value.join(",");
  getWorkProduce();
});
let onDisabled = ref<boolean>(false);

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

//存储工单工序数据
let workDetailList = ref<any[]>([]);

//根据工单编号来查询到工单工序数据
async function getWorkProduce() {
  try {
    if (!detailName.value) {
      return (workDetailList.value = []);
    }
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

//存储拖拽到工作中心的数据
let tabArr = ref<any[]>([]);
let tabArr1 = ref<any[]>([]);

//将工序数据拖拽到工作中心
function onDragEnd(event: any, item: any) {
  // 获取鼠标的位置
  const x = event.clientX;
  const y = event.clientY;

  // 获取鼠标所在位置的元素
  let element: any = document.elementFromPoint(x, y);

  // 获取离该元素最近的 card 元素
  let cardElement = element.closest(".v-responsive__content");

  // 如果没有拖到工作中心容器内，则拖动无效
  if (!cardElement || cardElement.children.length !== 4) return;

  // 获取 card 元素的所有子元素
  const cardChildren = cardElement.children;

  item.work_center_id = cardChildren[3].innerText.substring(3);
  workCenterId.value = cardChildren[3].innerText.substring(3);
  workCenterName.value = cardChildren[0].innerText;

  item.assignment_date = new Date().toISOString().split("T")[0];
  workDetailList.value.splice(workDetailList.value.indexOf(item), 1);
  console.log(workDetailList.value);
  tabArr.value.push(item);
  tabArr1.value.push(item);
  getCenterProduce();
}

//存储工作中心的集合
let workCenterList = ref<any[]>([]);

//搜素
let searchType = ref<string>("机加工");

//通过更改searchType的值来筛选工作中心
watch(searchType, function () {
  getWorkCenterList();
});

//获取工作中心数据
async function getWorkCenterList() {
  const data = await useHttp(
    "/WorkCenter/M13WorkCenterList",
    "get",
    undefined,
    {
      type: searchType.value,
      PageIndex: 1,
      PageSize: 1000000,
      SortedBy: "id",
      SortType: 0,
    }
  );
  workCenterList.value = data.data.pageList;
}

onMounted(() => {
  getWorkOrder();
  getWorkCenterList();
});

//用显示来工作中心中任务的数据
let tempTabArr = ref<any[]>([]);
//对工作中心的工单工序数据进行排序
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
//根据工作中心编号来查找工单工序数据
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
  //添加工作中心编号
  await useHttp(
    "/ProductionRecode/M23UpdateProductionRecode",
    "put",
    tabArr.value
  );

  await getWorkProduce();
  let filteredSelected = selected.value.filter(
    (selItem: any) =>
      !workDetailList.value.some(
        (workItem) => workItem.workorder_hid === selItem
      )
  );
  let overWorkOrder = filteredSelected.join(",");
  const workOrderDate = filteredSelected.map((item: any) => {
    // 找到对应的工单
    const workOrder = workOrderList.value.find(
      (_item: any) => _item.workorder_hid === item
    );
    // 如果找到了工单，更新它的状态并返回
    if (workOrder) {
      return { ...workOrder, status: "已排产生产中" };
    }
    // 如果没有找到工单，返回null或者其他默认值
    return null;
  });
  //修改当前工单的状态;
  await useHttp(
    "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
    "put",
    workOrderDate
  );

  getWorkOrder();
  detailName.value = "";
  tabArr1.value = [];
  if (overWorkOrder) {
    setSnackbar(
      "green",
      "工单编号为" + overWorkOrder + "的工单工序数据排产完成"
    );
  }
}

//取消添加工作中心
function cancel() {
  if (!tabArr1.value.length) {
    return;
  }
  tabArr1.value = [];
  tabArr.value = [];
  getWorkProduce();
}

//通过监听tabArr1的内容来更改工作中心详情的内容
watch(
  tabArr1,
  function () {
    if (tabArr1.value.length) {
      onDisabled.value = true;
    } else {
      onDisabled.value = false;
    }
    getCenterProduce();
  },
  { deep: true }
);
</script>
<template>
  <v-row no-gutters class="ma-3">
    <v-col cols="1" class="bg-light-blue-lighten-5">
      <v-tabs direction="vertical">
        <v-tab color="green"> 工单排产 </v-tab>
        <v-tab color="green"> 产能视图 </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="1" class="bg-light-blue-lighten-5">
      <div>
        <div class="text-h6 text-center mt-2 font-weight-bold">未排产工单</div>
        <div
          v-for="(item, index) in workOrderList"
          :key="index"
          class="w-100 mt-5"
          v-if="workOrderList.length"
        >
          <v-divider :thickness="4"></v-divider>
          <div>
            <v-checkbox
              v-model="selected"
              :value="item.workorder_hid"
              density="compact"
              :disabled="onDisabled"
              hide-details
              class="ml-1"
            ></v-checkbox>
            <div class="mx-2 py-1 text-body-2">
              工单编号：{{ item.workorder_hid }}
            </div>
            <div class="mx-2 py-1 text-body-2">
              完成日期： {{ item.finish_date }}
            </div>
            <div class="mx-2 py-1 text-body-2">
              数量：{{ item.planned_quantity }}{{ item.unit }}
            </div>
          </div>
        </div>
        <div v-else class="text-center mt-5 text-captions">
          (当前没有未排产的工单)
        </div>
      </div>
    </v-col>
    <v-col cols="10">
      <v-card class="bg-light-blue-lighten-5 w-100" min-height="200px" flat>
        <v-card-title v-if="detailName" class="font-weight-bold"
          >({{ detailName }})工单工序</v-card-title
        >
        <v-card-title v-else class="font-weight-bold">工单工序</v-card-title>
        <div class="overflow-x-auto w-100" style="white-space: nowrap">
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
            <div v-show="!element.work_center_id">
              <div class="px-2 py-1 text-body-2">
                工序顺序：{{ element.procedure_order_id }}
              </div>

              <div class="px-2 py-1 text-body-2">
                工序名称：{{ element.procedure_name }}
              </div>

              <div class="px-2 py-1 text-body-2">
                是否委外：{{ element.defaul_outsource }}
              </div>

              <div class="px-2 py-1 text-body-2">
                产出料：{{ element.material_name }}
              </div>

              <div class="px-2 py-1 text-body-2">
                数量：{{ element.planned_quantity }}
              </div>

              <div class="px-2 py-1 text-body-2">
                交付日期：{{ element.planned_completion_time }}
              </div>
            </div>
          </v-card>
          <div v-else class="text-center text-caption">
            (工单工序已分配完成)
          </div>
        </div>
      </v-card>
      <!-- 工作中心 -->
      <v-card class="bg-light-blue-lighten-5 mt-2" min-height="300px" flat>
        <div class="d-flex justify-space-between my-3">
          <div>
            <v-card-title class="font-weight-bold">工作中心</v-card-title>
          </div>
          <div class="mr-2">
            <v-select
              label="工作中心类型"
              v-model="searchType"
              :items="['机加工', '装配']"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </div>
        </div>
        <div class="overflow-x-auto w-100 mt-4" style="white-space: nowrap">
          <div
            v-for="(item, index) in workCenterList"
            v-if="workCenterList.length"
            style="display: inline-block"
          >
            <v-card
              class="mx-2"
              @click="showCenterDetail(item)"
              width="170"
              height="170"
            >
              <v-img src="/工作中心.jpg" class="align-end">
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
          </div>
          <div v-else class="text-center text-caption">
            (工作中心为空，可能是网络断开了)
          </div>
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
      <v-card class="bg-blue-lighten-5 mt-2" min-height="200px" flat>
        <v-card-title v-if="workCenterName" class="font-weight-bold">
          ({{ workCenterName }})工作中心详情
        </v-card-title>
        <v-card-title v-else class="font-weight-bold"
          >工作中心详情</v-card-title
        >
        <div class="overflow-x-auto" style="white-space: nowrap">
          <v-card
            class="mx-2"
            style="display: inline-block"
            :border="true"
            v-for="(element, index) in tempTabArr"
            :key="index"
            v-if="tempTabArr.length"
          >
            <div>
              <div class="mx-2 py-1 text-body-2">
                工序顺序：{{ element.procedure_order_id }}
              </div>

              <div class="mx-2 py-1 text-body-2">
                工序名称：{{ element.procedure_name }}
              </div>

              <div class="mx-2 py-1 text-body-2">
                是否委外：{{ element.defaul_outsource }}
              </div>

              <div class="mx-2 py-1 text-body-2">
                产出料：{{ element.material_name }}
              </div>

              <div class="mx-2 py-1 text-body-2">
                数量：{{ element.planned_quantity }}
              </div>

              <div class="mx-2 py-1 text-body-2">
                交付日期：{{ element.planned_completion_time }}
              </div>
            </div>
          </v-card>
          <div v-else class="text-center text-caption">
            (当前工作中心没有任务)
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>
<style scoped>
.inline-card {
  display: inline-flex;
}
.v-col {
  border-right: 1px solid #0c476f;
}
</style>
