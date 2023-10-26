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

// 正在选中的 tab 页
let showingTab = ref<any>(null);
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

//删除工作中心的任务
let deleteDialog = ref<boolean>(false);
let workCenterInFo = ref<any>(null);
//打开删除框
function showDeleteCenter(item: any) {
  workCenterInFo.value = item;
  deleteDialog.value = true;
}
//确认删除
async function deleteCenter() {
  //在当前工作中心中删除这一项任务
  tempTabArr.value.splice(tempTabArr.value.indexOf(workCenterInFo.value), 1);
  tabArr.value.splice(tabArr.value.indexOf(workCenterInFo.value), 1);
  tabArr1.value.splice(tabArr1.value.indexOf(workCenterInFo.value), 1);
  //修改工单工序的工作中心编号
  workCenterInFo.value.work_center_id = null;
  //修改后的数据，通过接口修改数据库中内容
  await useHttp("/ProductionRecode/M23UpdateProductionRecode", "put", [
    workCenterInFo.value,
  ]);
  //判断在这个工作中心删除的这个数据的工单编号的工单的状态是什么
  //拿到当前工单工序的工单编号
  const workHid = workCenterInFo.value.workorder_hid;
  //拿到这个工单编号的工单数据
  const data: any = await useHttp(
    "/MesWorkOrder/M01GetWorkOrderList",
    "get",
    undefined,
    {
      workorder_hid: workHid,
      PageIndex: 1,
      PageSize: 10,
      SortedBy: "id",
      SortType: 0,
    }
  );
  const workOrderInFo = data.data.pageList[0];

  //如果工单状态是"已排产生产中"，调用接口更改为"已审核待排产"。
  if (workOrderInFo.status === "已排产生产中") {
    workOrderInFo.status = "已审核待排产";
    await useHttp("/MesWorkOrder/M03PartiallyUpdateWorkOrder", "put", [
      workOrderInFo,
    ]);
    getWorkOrder();
  } else {
    //判断当前有无选择工单数据（selected）
    if (selected.value.length) {
      //当前选择的有工单编号
      //判断当前删除的这个数据的工单编号是否属于当前选择的这些工单编号
      if (selected.value.includes(workHid)) {
        workDetailList.value.push(workCenterInFo.value);
      }
    } else {
      //当前没有选择数据（selected这个数组为空）
    }
  }
  setSnackbar(
    "green",
    "你成功从工作中心" +
      workCenterName.value +
      "撤销工单编号为" +
      workHid +
      "的这项任务"
  );
  deleteDialog.value = false;
}
</script>

<template>
  <v-row no-gutters style="height: calc(100vh - 84px)">
    <!-- v-col 默认站整个 row 高度 -->
    <v-col cols="1" class="pa-3">
      <!-- h-100 表示占 col 的整个内容区高度 -->
      <v-card class="h-100 rounded-lg elevation-3">
        <v-toolbar density="compact" color="blue-darken-2" title="页面">
        </v-toolbar>
        <v-tabs color="blue" direction="vertical" v-model="showingTab">
          <v-tab value="工单排产"> 工单排产 </v-tab>
          <v-tab value="产能视图"> 产能视图 </v-tab>
        </v-tabs>
      </v-card>
    </v-col>

    <v-col cols="11" class="py-3 pr-3">
      <v-window v-model="showingTab">
        <v-window-item value="工单排产">
          <v-row no-gutters>
            <v-col cols="2">
              <v-card class="rounded-lg elevation-3 ml-1">
                <v-toolbar
                  density="compact"
                  color="blue-darken-2"
                  title="未排产工单"
                >
                </v-toolbar>
                <div
                  style="height: calc(100vh - 158px)"
                  class="overflow-y-auto"
                >
                  <v-list
                    density="compact"
                    :lines="false"
                    class="ma-2 elevation-3 rounded-lg"
                    v-for="(item, index) in workOrderList"
                    :key="index"
                    v-if="workOrderList.length"
                  >
                    <v-checkbox
                      density="compact"
                      hide-details
                      color="blue-darken-2"
                      class="ml-3"
                      v-model="selected"
                      :value="item.workorder_hid"
                      :disabled="onDisabled"
                    ></v-checkbox>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工单编号：
                          <span class="text-grey font-weight-medium">
                            {{ item.workorder_hid }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          完成日期：
                          <span class="text-grey font-weight-medium">
                            {{ item.finish_date }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          数量：
                          <span class="text-grey font-weight-medium">
                            {{ item.planned_quantity }}{{ item.unit }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                  <div class="font-weight-bold text-h6" v-else>
                    当前没有未排产的工单
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="10" class="px-3">
              <v-card class="mb-3 elevation-3 rounded-lg">
                <v-toolbar density="compact" color="blue-darken-2">
                  <v-toolbar-title v-if="detailName"
                    >({{ detailName }})工单工序</v-toolbar-title
                  >
                  <v-toolbar-title v-else>工单工序</v-toolbar-title>
                </v-toolbar>

                <!-- cols="10" 确定了宽度，此处的 w-100 百分比就生效了 -->
                <div class="overflow-x-auto w-100" style="white-space: nowrap">
                  <v-list
                    class="mx-2 mt-3 mb-1 elevation-3 rounded-lg"
                    style="display: inline-block"
                    :lines="false"
                    density="compact"
                    draggable="true"
                    @dragend="onDragEnd($event, element)"
                    v-for="(element, index) in workDetailList"
                    :key="index"
                    v-if="workDetailList.length"
                  >
                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序顺序：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_order_id }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序名称：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_name }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          是否委外：
                          <span class="text-grey font-weight-medium">
                            {{ element.defaul_outsource }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          产出料：
                          <span class="text-grey font-weight-medium">
                            {{ element.material_name }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          数量：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_quantity }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          交付日期：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_completion_time }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>

                  <div v-else class="text-center text-h6 my-3 text-grey">
                    工单工序已分配完成
                  </div>
                </div>
              </v-card>

              <!-- 工作中心 -->
              <v-card class="mb-3 elevation-3 rounded-lg">
                <v-toolbar
                  density="compact"
                  color="blue-darken-2"
                  title="工作中心"
                >
                  <template v-slot:append>
                    <v-select
                      variant="solo"
                      density="compact"
                      hide-details
                      prefix="工作中心类型："
                      v-model="searchType"
                      :items="['机加工', '装配']"
                    ></v-select>
                  </template>
                </v-toolbar>

                <div class="overflow-x-auto w-100" style="white-space: nowrap">
                  <v-card
                    class="mx-2 mt-3 mb-1 elevation-3 rounded-lg"
                    width="240"
                    style="display: inline-block"
                    @click="showCenterDetail(item)"
                    v-for="(item, index) in workCenterList"
                    :key="index"
                  >
                    <v-img src="/工作中心.jpg">
                      <v-card-title class="text-blue-darken-2">{{
                        item.work_center_name
                      }}</v-card-title>
                      <v-card-subtitle>类型：{{ item.type }}</v-card-subtitle>
                      <v-card-subtitle
                        >位置：{{ item.work_center_address }}</v-card-subtitle
                      >
                      <v-card-subtitle>
                        编号：{{ item.work_center_id }}
                      </v-card-subtitle>
                    </v-img>
                  </v-card>

                  <div
                    v-if="!workCenterList.length"
                    class="text-center text-h6 my-3 text-grey"
                  >
                    工作中心为空，可能是网络断开了
                  </div>
                </div>

                <div class="text-right my-3">
                  <v-btn
                    class="mr-2"
                    color="blue-darken-2"
                    @click="updateCenterId()"
                  >
                    保存信息
                  </v-btn>
                  <v-btn class="mr-2" color="grey" @click="cancel">
                    取消
                  </v-btn>
                </div>
              </v-card>

              <!-- 工作详情 -->
              <v-card class="elevation-3 rounded-lg">
                <v-toolbar density="compact" color="blue-darken-2">
                  <v-toolbar-title v-if="workCenterName"
                    >({{ workCenterName }})工作中心详情</v-toolbar-title
                  >
                  <v-toolbar-title v-else>工作中心详情</v-toolbar-title>
                </v-toolbar>

                <div class="overflow-x-auto w-100" style="white-space: nowrap">
                  <v-list
                    class="mx-2 mt-3 mb-1 elevation-3 rounded-lg"
                    style="display: inline-block"
                    :lines="false"
                    density="compact"
                    v-for="(element, index) in tempTabArr"
                    :key="index"
                  >
                    <div style="position: relative">
                      <v-btn
                        icon="fa-solid fa-x"
                        variant="plain"
                        size="x-small"
                        style="
                          position: absolute;
                          right: 5px;
                          top: -3px;
                          z-index: 1000;
                        "
                        @click="showDeleteCenter(element)"
                      >
                      </v-btn>
                    </div>
                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序顺序：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_order_id }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          工序名称：
                          <span class="text-grey font-weight-medium">
                            {{ element.procedure_name }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          是否委外：
                          <span class="text-grey font-weight-medium">
                            {{ element.defaul_outsource }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          产出料：
                          <span class="text-grey font-weight-medium">
                            {{ element.material_name }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          数量：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_quantity }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:default>
                        <div class="text-body-2">
                          交付日期：
                          <span class="text-grey font-weight-medium">
                            {{ element.planned_completion_time }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                  <div
                    v-show="!tempTabArr.length"
                    class="text-center text-h6 my-3 text-grey"
                  >
                    当前工作中心没有任务
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="产能视图"> 这里是产能视图 </v-window-item>
      </v-window>
    </v-col>
  </v-row>
  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
  <!-- 删除工作中心中任务 -->
  <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 删除常用工序流程 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="deleteDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4 text-center text-red text-h6">
        您确认要删除这条数据吗？
      </v-card-text>
      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="deleteCenter()"
        >
          确认删除
        </v-btn>
        <v-btn color="grey" size="large" @click="deleteDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped></style>
