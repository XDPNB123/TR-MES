<template>
  <v-card>
    <v-row class="ma-2">
      <v-col cols="4">
        <v-text-field
          label="明细编号"
          variant="outlined"
          density="compact"
          hide-details
          v-model="searchWorkDid"
        ></v-text-field>
      </v-col>

      <v-col cols="4">
        <v-text-field
          label="物料编号"
          variant="outlined"
          density="compact"
          hide-details
          v-model="searchWorkId"
        ></v-text-field>
      </v-col>

      <v-col cols="4">
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
          size="large"
          @click="showDialogAdd"
          class="mr-2"
          >新增
        </v-btn>
        <v-btn color="blue-darken-2" size="large" class="mr-2"> 导入 </v-btn>
      </v-col>
      <div class="text-h5 align-center"></div>
      <v-col cols="12">
        <v-data-table
          :items-per-page="10"
          :headers="headers"
          :items="bomTableList"
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

    <!-- 增加物料 -->
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
          <v-select
            label="物料单位"
            v-model="conference.unit"
            :items="units"
            clearable
          ></v-select>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addCertain()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="dialogAdd = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除物料 -->
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
            color="blue-darken-2"
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
    <!-- 物料修改 -->
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
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editCertain()"
          >
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

//单位
let units = ref<string[]>([
  "PCS",
  "米",
  "毫米",
  "张",
  "KG",
  "瓶（通）",
  "盒（包）",
  "双（对）",
  "平方米",
  "卷",
  "台",
  "套",
  "件",
  "根",
  "个",
  "袋",
  "立方",
  "升",
  "支",
  "箱",
  "盒",
  "节",
  "把",
  "片",
  "公斤",
  "干公斤",
  "包",
  "本",
]);
let dialogAdd = ref(false);
let dialogDelete = ref(false);
let editDialog = ref(false);

let searchWorkId = ref("");
let searchWorkDid = ref("");
let searchMaterialName = ref("");
// 表格初始页
let tablePage = ref<number>(1);
watch(tablePage, function () {
  getBomList();
});
// 数据库存储数据的条数
let tableCount = ref<number>(0);
// 表格有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableCount.value / 10);
});
//bom对象
let conference = ref<any>({});
const headers = ref<any[]>([
  {
    title: "序号",
    align: "center",
    sortable: false,
    key: "id",
  },
  {
    title: "工单明细编号",
    align: "center",
    key: "workorder_did",
    sortable: false,
  },
  { title: "物料编号", align: "center", key: "material_id", sortable: false },
  { title: "物料名称", align: "center", key: "material_name", sortable: false },
  {
    title: "物料数量",
    align: "center",
    key: "required_quantity",
    sortable: false,
  },
  {
    title: "已领取数量",
    align: "center",
    key: "already_received_quantity",
    sortable: false,
  },
  { title: "单位", align: "center", key: "unit", sortable: false },
  { title: "操作", align: "center", key: "actions", sortable: false },
]);
//bom清单数据
let bomTableList = ref<any[]>([]);

// 搜索过滤
async function filterTableData() {
  getBomList();
}

// 重置搜索
function resetFilter() {
  (searchWorkId.value = ""),
    (searchMaterialName.value = ""),
    (searchWorkDid.value = ""),
    getBomList();
}
let route = useRoute();
searchWorkDid.value = route.query.workorder_did as string;
//存储跳转传输过来的名称
let mcodeName = ref("");
mcodeName.value = route.query.mcodeName as string;
//获取bom物料数据
async function getBomList() {
  const data: any = await useHttp(
    "/MesWorkBom/M16GetBomList",
    "get",
    undefined,
    {
      workorder_did: searchWorkDid.value,
      material_id: searchWorkId.value,
      material_name: searchMaterialName.value,
      PageIndex: tablePage.value,
      PageSize: "10",
      SortedBy: "id",
      SortType: 0,
    }
  );
  bomTableList.value = data.data.pageList;
  tableCount.value = data.data.totalCount;
}
onMounted(() => {
  getBomList();
});

//新增前重置conference对象内容
function showDialogAdd() {
  conference.value = {
    workorder_did: searchWorkDid.value,
    material_id: "",
    material_name: "",
    required_quantity: "",
    already_received_quantity: "0",
    unit: "",
  };
  dialogAdd.value = true;
}
// 新增bom清单
async function addCertain() {
  await useHttp("/MesWorkBom/M17AddBomInfo", "post", [conference.value]);
  getBomList();
  dialogAdd.value = false;
}
//删除bom清单
async function deleteCertain() {
  await useHttp("/MesWorkBom/M19DeleteBomInfo", "delete", undefined, {
    workorderbom_ids: [conference.value.id],
  });
  getBomList();
  dialogDelete.value = false;
}
//修改bom清单
async function editCertain() {
  await useHttp("/MesWorkBom/M18UpdateBomInfo", "put", [conference.value]);
  getBomList();
  editDialog.value = false;
}
</script>
