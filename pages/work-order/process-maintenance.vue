<template>
  <v-card>
    <v-row class="ma-2">
      <v-col cols="6">
        <v-text-field
          label="工序编号"
          variant="outlined"
          density="compact"
          v-model="searchProcessNumber"
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="6">
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
          color="black"
          class="mr-2"
          size="large"
          @click="filterTableData()"
          >查询</v-btn
        >
        <v-btn color="red" class="mr-2" size="large" @click="resetFilter()">
          重置
        </v-btn>
        <v-btn color="green" class="mr-2" size="large" @click="resetAddDialog">
          新增工序
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
        <v-data-table
          v-model:page="tablePage"
          :headers="tableHeaders"
          :items="tableData"
          :items-per-page="tablePerPage"
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
            >
              fa-solid fa-pen
            </v-icon>

            <v-icon
              color="red"
              size="small"
              @click.stop="
                operateProcess = { ...item.raw };
                deleteDialog = true;
              "
            >
              fa-solid fa-trash
            </v-icon>
          </template>

          <template v-slot:bottom>
            <div class="text-center pt-2">
              <v-pagination
                v-model="tablePage"
                :length="tablePageCount"
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
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
            v-model="operateProcess.procedure_id"
            label="工序编号"
          ></v-text-field>
          <v-text-field
            v-model="operateProcess.procedure_name"
            label="工序名称"
          ></v-text-field>
          <v-text-field
            v-model="operateProcess.procedure_description"
            label="工序说明"
          ></v-text-field>
          <v-select
            label="是否委外"
            :items="['Y', 'N']"
            v-model="operateProcess.defaul_outsource"
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="addProcess()">
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
            v-model="operateProcess.procedure_id"
            label="工序编号"
          ></v-text-field>
          <v-text-field
            v-model="operateProcess.procedure_name"
            label="工序名称"
          ></v-text-field>
          <v-text-field
            v-model="operateProcess.procedure_description"
            label="工序说明"
          ></v-text-field>
          <v-select
            label="是否委外"
            :items="['Y', 'N']"
            v-model="operateProcess.defaul_outsource"
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="editProcess()">
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

          <v-list>
            <v-list-item
              v-for="(value, key, index) in operateProcess"
              :key="index"
            >
              <template #prepend> {{ getChineseKey(key) }}:</template>
              <template #append>
                {{ value }}
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <div class="d-flex justify-end mr-6 my-4">
          <v-btn color="red" size="large" class="mr-2" @click="deleteProcess()">
            确认删除
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script setup lang="ts">
let editDialog = ref(false);
let deleteDialog = ref(false);
let addDialog = ref(false);
// 工单搜索
let searchProcessNumber = ref<string>("");
let searchProcessName = ref<string>("");
// 操作的工序
let operateProcess = ref({
  procedure_id: "",
  procedure_name: "",
  procedure_description: "",
  defaul_outsource: "",
});
let keyToChinese = ref<any>({
  procedure_id: "工序编号",
  procedure_name: "工序名称",
  procedure_description: "工序说明",
  defaul_outsource: "是否委外",
});
let getChineseKey = (key: any) => keyToChinese.value[key] || key;
// 表格初始页
let tablePage = ref<number>(1);
// 表格每页条数
let tablePerPage = ref<number>(10);
let tableHeaders = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工序编号",
    key: "procedure_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工序名称",
    key: "procedure_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工序说明",
    key: "procedure_description",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否委外",
    key: "defaul_outsource",
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
// 表格有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableData.value.length / tablePerPage.value);
});
//拿取登录页面存储的token
const token = useCookie("token");
//获取工序数据
onMounted(() => {
  getWorkOrder();
});
async function getWorkOrder() {
  const data: any = await useHttp(
    "/MesWorkProcess/M09GetProcedureData",
    "get",
    undefined,
    {
      SortedBy: "id",
      PageIndex: 1,
      SortType: 0,
      procedure_name: "",
      procedure_id: "",
      PageSize: 20,
    }
  );

  tableData.value = data.data;
}
// 搜索过滤
async function filterTableData() {
  const data: any = await useHttp(
    "/MesWorkProcess/M09GetProcedureData",
    "get",
    undefined,
    {
      SortedBy: "id",
      PageIndex: 1,
      SortType: 0,
      procedure_name: searchProcessName.value,
      procedure_id: searchProcessNumber.value,
      PageSize: 20,
    }
  );
  tableData.value = data.data;
}

// 重置搜索
function resetFilter() {
  searchProcessName.value = "";
  searchProcessNumber.value = "";
  getWorkOrder();
}
// 新增工序前重置对话框
// 新增工单前重置新增对话框
function resetAddDialog() {
  // 清空文本框
  operateProcess.value = {
    procedure_id: "",
    procedure_name: "",
    procedure_description: "",
    defaul_outsource: "N",
  };
  addDialog.value = true;
}

// 新增工序
async function addProcess() {
  const data: any = await useHttp(
    "/MesWorkProcess/M11AddProcedure",
    "post",
    operateProcess.value
  );

  getWorkOrder();
  addDialog.value = false;
}

// 修改工序
async function editProcess() {
  const data: any = await useHttp(
    "/MesWorkProcess/M10ProcedureMaintenance",
    "put",
    operateProcess.value
  );
  getWorkOrder();
  editDialog.value = false;
}

// 删除工单
async function deleteProcess() {
  console.log(operateProcess.value.id);
  const data: any = await useHttp(
    "/MesWorkProcess/M12DeleteProcedure",
    "delete",
    undefined,
    { ids: [operateProcess.value.id] }
  );
  getWorkOrder();
  deleteDialog.value = false;
}
</script>
