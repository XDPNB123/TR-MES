<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "常用工序",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "常用工序",
  // 该页面的描述
  description: "同日 MES 系统，常用工序",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，常用工序",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
const router = useRouter();
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
let editDialog = ref(false);
let deleteDialog = ref(false);
let addDialog = ref(false);
let editDialog2 = ref(false);
let deleteDialog2 = ref(false);
let addDialog2 = ref(false);
//
let selectedRows = ref<any[]>([]);

// 工单搜索
let searchProcessName = ref<string>("");
// 操作的工序
let operateProcess = ref<any>(null);
let operate = ref();

let tableHeaders = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },

  {
    title: "工序名称",
    key: "rsv2",
    align: "center",
    sortable: false,
    filterable: true,
  },

  {
    title: "是否委外",
    key: "rsv1",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);

//表格显示数据
let tableData = ref<any[]>([]);

//获取工序数据
onMounted(() => {
  getWorkOrder();
  getProduceGroup();
});
//获取数据库数据
async function getWorkOrder() {
  try {
    const data: any = await useHttp(
      "/SysConfig/M47GetProcessBasisConfig",
      "get",
      undefined,
      {
        config_type: "单工序",
        rsv2: searchProcessName.value,
      }
    );
    tableData.value = data.data;
  } catch (error) {
    console.log(error);
  }
}
// 搜索过滤
async function filterTableData() {
  getWorkOrder();
}
// 重置搜索
function resetFilter() {
  searchProcessName.value = "";
  getWorkOrder();
}
// 新增工序前重置对话框
// 新增工单前重置新增对话框
function resetAddDialog() {
  // 清空文本框
  operateProcess.value = {
    config_code: "single_process",
    rsv2: "",
    rsv1: "N",
    rsv3: "Y",
  };
  addDialog.value = true;
}
// 新增工序
async function addProcess() {
  try {
    const data: any = await useHttp(
      "/SysConfig/M48AddProcessBasis",
      "post",
      operateProcess.value
    );
    getWorkOrder();
  } catch (error) {
    console.log(error);
  }
  addDialog.value = false;
}
// 修改工序
async function editProcess() {
  try {
    const data: any = await useHttp(
      "/SysConfig/M49UpdateProcessBasis",
      "put",
      operateProcess.value
    );
    getWorkOrder();
  } catch (error) {
    console.log(error);
  }
  editDialog.value = false;
}
// 删除工序
async function deleteProcess() {
  try {
    const data: any = await useHttp(
      "/SysConfig/M50DeleteProcessBasis",
      "delete",
      undefined,
      { config_code: operate.value.config_code }
    );
    getWorkOrder();
  } catch (error) {
    console.log(error);
  }
  deleteDialog.value = false;
}

//搜素
let searchGroupName = ref<any>(null);
//常用工序组
let produceGroup = ref<any[]>([]);
//获取工序组
async function getProduceGroup() {
  const data: any = await useHttp(
    "/SysConfig/M47GetProcessBasisConfig",
    "get",
    undefined,
    {
      config_type: "常用工序组合",
      rsv2: searchGroupName.value,
    }
  );
  produceGroup.value = data.data;
}
//搜素工序组、
function filterGroupData() {
  getProduceGroup();
}
//重置查询
function resetGroupFilter() {
  (searchGroupName.value = ""), getProduceGroup();
}
//工序组名称
let produceGroupInfo = ref<any>(null);
//新增工序组
function showAddDialog() {
  //清空内容
  produceGroupInfo.value = "";
  if (selectedRows.value.length < 2) {
    return setSnackbar("black", "最少选取两个工序");
  }
  produceGroupInfo.value = selectedRows.value
    .map((item: any) => item.rsv2)
    .join(",");

  const isSome = produceGroup.value.some(
    (item: any) => item.rsv2 === produceGroupInfo.value
  );
  if (isSome) {
    return setSnackbar("black", "您想要新建的工序组已存在");
  }
  addDialog2.value = true;
}
//确认添加
async function addProcessGroup() {
  //调用接口进行添加
  await useHttp("/SysConfig/M48AddProcessBasis", "post", {
    config_code: "process_basis",
    rsv2: produceGroupInfo.value,
    rsv1: "N",
    rsv3: "Y",
  });
  //添加成功后，清空selectedRows，更新工序组数据
  selectedRows.value = [];
  getProduceGroup();
  addDialog2.value = false;
}

//存储当前工序组对象
let produceGroupItem = ref<any>(null);
//确认修改工序组名称
async function editProduceGroup() {
  await useHttp(
    "/SysConfig/M49UpdateProcessBasis",
    "put",
    produceGroupItem.value
  );
  editDialog2.value = false;
  getProduceGroup();
}

//确认删除
async function delProduceGroup() {
  await useHttp("/SysConfig/M50DeleteProcessBasis", "delete", undefined, {
    config_code: produceGroupItem.value.config_code,
  });
  deleteDialog2.value = false;
  getProduceGroup();
}
</script>
<template>
  <v-row class="ma-2" style="height: 90vh">
    <v-col cols="6" class="h-100">
      <v-card class="h-100">
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-3 text-blue font-weight-bold"
            >常用工序</v-toolbar-title
          >
        </v-toolbar>
        <v-row class="pa-3">
          <v-col cols="12">
            <v-text-field
              label="工序名称"
              variant="outlined"
              density="compact"
              v-model="searchProcessName"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="filterTableData()"
              >查询</v-btn
            >
            <v-btn color="red" class="mr-2" size="large" @click="resetFilter()">
              重置
            </v-btn>
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="resetAddDialog"
              v-permission="
              `${router.currentRoute.value.fullPath}->addProcedure`
            "
            >
              新增工序
            </v-btn>
          </v-col>
          <v-col cols="12" style="height: calc(90vh - 200px); overflow-y: auto">
            <v-divider></v-divider>
            <v-data-table
              :headers="tableHeaders"
              :items="tableData"
              :items-per-page="10"
              v-model="selectedRows"
              return-object
              show-select
            >
              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="
                    operateProcess = { ...item.raw };
                    editDialog = true;
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->updateProcedure`
                "
                >
                  fa-solid fa-pen
                </v-icon>

                <v-icon
                  color="red"
                  size="small"
                  @click.stop="
                    operate = { ...item.raw };
                    deleteDialog = true;
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->deleteProcedure`
                "
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="6" class="h-100">
      <v-card class="h-100">
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-3 text-blue font-weight-bold"
            >常用工序组</v-toolbar-title
          >
        </v-toolbar>
        <v-row class="pa-3">
          <v-col cols="12">
            <v-text-field
              label="工序组名称"
              variant="outlined"
              density="compact"
              v-model="searchGroupName"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="filterGroupData()"
              >查询</v-btn
            >
            <v-btn
              color="red"
              class="mr-2"
              size="large"
              @click="resetGroupFilter()"
            >
              重置
            </v-btn>
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="showAddDialog"
              v-permission="
              `${router.currentRoute.value.fullPath}->addGroup`
            "
            >
              新增工序组
            </v-btn>
          </v-col>
        </v-row>
        <div
          style="
            height: calc(90vh - 150px);
            overflow-y: auto;
            border-top: solid 0.6px rgb(128, 128, 128, 0.3);
          "
        >
          <v-list v-for="(item, index) in produceGroup" :key="index">
            <v-list-item :title="item.rsv2">
              <template v-slot:append>
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="
                    produceGroupItem = { ...item };
                    editDialog2 = true;
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->updateGroup`
                "
                >
                  fa-solid fa-pen
                </v-icon>

                <v-icon
                  color="red"
                  size="small"
                  @click.stop="
                    produceGroupItem = { ...item };
                    deleteDialog2 = true;
                  "
                  v-permission="
                  `${router.currentRoute.value.fullPath}->deleteGroup`
                "
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <!-- 新增工序 -->
  <v-dialog v-model="addDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增工序 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-text-field
          v-model="operateProcess.rsv2"
          label="工序名称"
        ></v-text-field>
        <v-select
          label="是否委外"
          :items="['Y', 'N']"
          v-model="operateProcess.rsv1"
        ></v-select>
        <v-select
          label="是否质检"
          :items="['Y', 'N']"
          v-model="operateProcess.rsv3"
        ></v-select>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="addProcess()"
        >
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="addDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改工序 -->
  <v-dialog v-model="editDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 修改工序 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-text-field
          v-model="operateProcess.rsv2"
          label="工序名称"
        ></v-text-field>
        <v-select
          label="是否委外"
          :items="['Y', 'N']"
          v-model="operateProcess.rsv1"
        ></v-select>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="editProcess()"
        >
          确认修改
        </v-btn>
        <v-btn color="grey" size="large" @click="editDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除工序 -->
  <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 删除工序 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="deleteDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4 text-center text-red text-h6">
        您确认要删除这条工序吗？
      </v-card-text>

      <div class="d-flex justify-end mr-6 my-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="deleteProcess()"
        >
          确认删除
        </v-btn>
        <v-btn color="grey" size="large" @click="deleteDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 新增工序组 -->
  <v-dialog v-model="addDialog2" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增工序组 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addDialog2 = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        您确定要新增工序组【{{ produceGroupInfo }}】 ？
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="addProcessGroup()"
        >
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="addDialog2 = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改工序 -->
  <v-dialog v-model="editDialog2" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 修改工序组 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editDialog2 = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-text-field
          v-model="produceGroupItem.rsv2"
          label="工序组名称"
        ></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="editProduceGroup()"
        >
          确认修改
        </v-btn>
        <v-btn color="grey" size="large" @click="editDialog2 = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除工序组 -->
  <v-dialog v-model="deleteDialog2" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 删除工序组 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="deleteDialog2 = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4 text-center text-red text-h6">
        您确认要删除这条工序组吗？
      </v-card-text>

      <div class="d-flex justify-end mr-6 my-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="delProduceGroup()"
        >
          确认删除
        </v-btn>
        <v-btn color="grey" size="large" @click="deleteDialog2 = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>
