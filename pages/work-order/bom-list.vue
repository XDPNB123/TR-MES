<template>
  <v-card>
    <v-row class="ma-2">
      <v-col cols="6">
        <v-text-field
          label="物料编号"
          variant="outlined"
          density="compact"
          hide-details
          v-model="searchWorkId"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          label="物料名称"
          variant="outlined"
          density="compact"
          v-model="searchMaterialName"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12"
        ><v-btn
          color="black"
          class="mr-2"
          size="large"
          @click="filterTableData()"
          >查询</v-btn
        >
        <v-btn color="red" class="mr-2" size="large" @click="resetFilter()">
          重置
        </v-btn>
        <v-btn
          color="green"
          variant="flat"
          size="large"
          @click="showDialogAdd"
          class="mr-2"
          >新增
        </v-btn>
        <v-btn color="blue-darken-4" variant="flat" size="large" class="mr-2">
          导入
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-data-table
          v-model:page="tablePage"
          :items-per-page="tablePerPage"
          :headers="headers"
          :items="bomTableList"
          class="elevation-1"
        >
          <template v-slot:item.id="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              color="orange"
              size="small"
              class="mr-3"
              @click="
                editDialog = true;
                conference = { ...item.raw };
              "
            >
              fa-solid fa-pen
            </v-icon>
            <v-icon
              color="red"
              size="small"
              class="mr-3"
              @click="
                dialogDelete = true;
                conference = { ...item.raw };
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
    <v-dialog v-model="dialogAdd" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增物料 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogAdd = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            label="工单明细编号"
            v-model="conference.workorder_did"
            clearable
          ></v-text-field>
          <v-text-field
            label="物料编号"
            v-model="conference.material_id"
            clearable
          ></v-text-field>
          <v-text-field
            label="物料名称"
            v-model="conference.material_name"
            clearable
          ></v-text-field>
          <v-text-field
            label="物料数量"
            v-model="conference.required_quantity"
            clearable
          ></v-text-field>
          <v-text-field
            label="物料单位"
            v-model="conference.unit"
            clearable
          ></v-text-field>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="addCertain()">
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="dialogAdd = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" min-width="400px" width="500px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除物料明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDelete = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>确定删除该物料吗?</v-card-text>
        <div class="d-flex justify-end mr-6 mb-4 mt-3">
          <v-btn
            color="blue"
            size="large"
            class="mr-2"
            @click="deleteCertain()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="dialogDelete = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改物料明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            v-model="conference.material_name"
            label="物料名称"
          ></v-text-field>
          <v-text-field
            v-model="conference.required_quantity"
            label="物料数量"
          ></v-text-field>
          <v-text-field
            v-model="conference.already_received_quantity"
            label="已领取数量"
          ></v-text-field>
          <v-text-field
            v-model="conference.unit"
            label="物料单位"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="editCertain()">
            确认修改
          </v-btn>
          <v-btn color="grey" size="large" @click="editDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "物料清单",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "物料清单",
  // 该页面的描述
  description: "同日 MES 系统，物料清单",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，物料清单",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});

let dialogAdd = ref(false);
let dialogDelete = ref(false);
let editDialog = ref(false);

let searchWorkId = ref("");
let searchMaterialName = ref("");
// 表格初始页
let tablePage = ref<already_received_quantity>(1);
// 表格每页条数
let tablePerPage = ref<already_received_quantity>(10);
// 表格有多少页
let tablePageCount = computed(() => {
  return Math.ceil(bomTableList.value.length / tablePerPage.value);
});
let conference = ref<any>({
  workorder_did: "",
  material_id: "",
  material_name: "",
  required_quantity: "",
  already_received_quantity: "",
  unit: "",
});
const headers = ref<any[]>([
  {
    title: "序号",
    align: "center",
    sortable: false,
    key: "id",
  },
  { title: "工单明细编号", align: "center", key: "workorder_did" },
  { title: "物料编号", align: "center", key: "material_id" },
  { title: "物料名称", align: "center", key: "material_name" },
  { title: "物料数量", align: "center", key: "required_quantity" },
  { title: "已领取数量", align: "center", key: "already_received_quantity" },
  { title: "单位", align: "center", key: "unit" },
  { title: "操作", align: "center", key: "actions", sortable: false },
]);
let bomTableList = ref<any[]>([]);

// 搜索过滤
async function filterTableData() {
  const data: any = await useHttp(
    "/MesWorkBom/M16GetBomList",
    "get",
    undefined,
    {
      workorder_did: workorder_did,
      material_id: searchWorkId.value,
      material_name: searchMaterialName.value,
      PageIndex: "1",
      PageSize: "20",
      SortedBy: "id",
      SortType: 0,
    }
  );
  bomTableList.value = data.data.pageList;
}

// 重置搜索
function resetFilter() {
  (searchWorkId.value = ""),
    (searchMaterialName.value = ""),
    getBomList(workorder_did);
}
let route = useRoute();
let workorder_did = route.query.workorder_did;
//搜素bom物料
async function getBomList(workorder_did: any) {
  const data: any = await useHttp(
    "/MesWorkBom/M16GetBomList",
    "get",
    undefined,
    {
      workorder_did: workorder_did,
      material_id: "",
      material_name: "",
      PageIndex: "1",
      PageSize: "20",
      SortedBy: "id",
      SortType: 0,
    }
  );

  bomTableList.value = data.data.pageList;
}
onMounted(() => {
  getBomList(workorder_did);
});

//新增前重置conference对象内容
function showDialogAdd() {
  conference.value = {
    workorder_did: workorder_did,
    material_id: "",
    material_name: "",
    required_quantity: "",
    already_received_quantity: "0",
    unit: "",
  };
  dialogAdd.value = true;
}
async function addCertain() {
  await useHttp("/MesWorkBom/M17AddBomInfo", "post", [conference.value]);
  getBomList();
  dialogAdd.value = false;
}
async function deleteCertain() {
  await useHttp("/MesWorkBom/M19DeleteBomInfo", "delete", undefined, {
    workorderbom_ids: [conference.value.id],
  });
  getBomList();
  dialogDelete.value = false;
}
function goBack() {
  router.back();
}
async function editCertain() {
  await useHttp("/MesWorkBom/M18UpdateBomInfo", "put", [conference.value]);
  getBomList();
  editDialog.value = false;
}
</script>
