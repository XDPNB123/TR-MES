<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "工作中心",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工作中心",
  // 该页面的描述
  description: "同日 MES 系统，工作中心",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，工作中心",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});

// 表格所有数据
let workCenterList = ref<any[]>([]);
// 表格当前页
let showingPage = ref<number>(1);
// 表格总页数
let totalPageCount = ref<number>(0);
// 查询条件
let searchWorkCenterId = ref<string | undefined>(undefined);
let searchWorkCenterName = ref<string | undefined>(undefined);
let searchType = ref<string | undefined>(undefined);
let searchWorkCenterAddress = ref<string | undefined>(undefined);
let searchCreator = ref<string | undefined>(undefined);
let searchStartCreateTime = ref<string | undefined>(undefined);
let searchEndCreateTime = ref<string | undefined>(undefined);
let searchUpdatePerson = ref<string | undefined>(undefined);
let searchStartUpdateTime = ref<string | undefined>(undefined);
let searchEndUpdateTime = ref<string | undefined>(undefined);

// 定义表头字段
let headers = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心编号",
    key: "work_center_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心名称",
    key: "work_center_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心类型",
    key: "type",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作中心地址",
    key: "work_center_address",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否废弃",
    key: "isdelete",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建人",
    key: "creator",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建时间",
    key: "create_time",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新时间",
    key: "update_time",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新人",
    key: "update_person",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);

// 对话框
let dialogAdd = ref<boolean>(false);
let dialogUpdate = ref<boolean>(false);
let dialogDelete = ref<boolean>(false);

// 正在操作的表格数据行
let operateRow = ref<any>(null);

onMounted(function () {
  // 页面渲染完成时，加载表格所有数据
  getWorkCenterList();
});

// 按条件查询数据
async function getWorkCenterList() {
  const data = await useHttp(
    "/WorkCenter/M13WorkCenterList",
    "get",
    undefined,
    {
      work_center_id: searchWorkCenterId.value,
      work_center_name: searchWorkCenterName.value,
      type: searchType.value,
      work_center_address: searchWorkCenterAddress.value,
      start_date_create: searchStartCreateTime.value,
      end_date_create: searchEndCreateTime.value,
      start_date_update: searchStartUpdateTime.value,
      end_date_update: searchEndUpdateTime.value,
      creator: searchCreator.value,
      update_person: searchUpdatePerson.value,
      PageIndex: showingPage.value,
      PageSize: 10,
      SortedBy: "id",
      SortType: 0,
    }
  );
  workCenterList.value = data.data.pageList.map((item: any) => {
    item.create_time = item.create_time.substring(0, 10);
    item.update_time = item.update_time.substring(0, 10);
    if (item.isdelete) {
      item.isdelete = "是";
    } else {
      item.isdelete = "否";
    }
    return item;
  });
}

// 重置搜索
function resetSearch() {
  searchWorkCenterId.value = undefined;
  searchWorkCenterName.value = undefined;
  searchType.value = undefined;
  searchWorkCenterAddress.value = undefined;
  searchCreator.value = undefined;
  searchStartCreateTime.value = undefined;
  searchEndCreateTime.value = undefined;
  searchStartUpdateTime.value = undefined;
  searchEndUpdateTime.value = undefined;
  searchUpdatePerson.value = undefined;
  getWorkCenterList();
}

// 重置正在操作的行数据
function resetRow() {
  operateRow.value = {
    work_center_id: undefined,
    type: undefined,
    work_center_name: undefined,
    work_center_address: undefined,
  };
}

// 添加工作中心
async function addWorkCenter() {
  await useHttp("/WorkCenter/M14AddWorkCenter", "post", {
    work_center_id: operateRow.value.work_center_id,
    type: operateRow.value.type,
    work_center_name: operateRow.value.work_center_name,
    work_center_address: operateRow.value.work_center_address,
  });
  // 重新渲染表格
  getWorkCenterList();
  // 关闭对话框
  dialogAdd.value = false;
}

// 修改工作中心
async function updateWorkCenter() {
  await useHttp("/WorkCenter/M15UpdateWorkCenter", "put", {
    id: operateRow.value.id,
    work_center_id: operateRow.value.work_center_id,
    type: operateRow.value.type,
    work_center_name: operateRow.value.work_center_name,
    work_center_address: operateRow.value.work_center_address,
  });
  // 重新渲染表格
  getWorkCenterList();
  // 关闭对话框
  dialogUpdate.value = false;
}

// 删除工作中心
async function deleteWorkCenter() {
  await useHttp("/WorkCenter/M25DeleteWorkCenter", "delete", undefined, {
    ids: operateRow.value.id,
  });
  // 重新渲染表格
  getWorkCenterList();
  // 关闭对话框
  dialogDelete.value = false;
}
</script>

<template>
  <v-card class="ma-3">
    <v-toolbar class="text-h6 pl-6">工作中心</v-toolbar>
    <v-data-table
      :headers="headers"
      :items="workCenterList"
      no-data-text="没有找到符合的数据"
    >
      <template v-slot:item.action="{ item }">
        <v-icon
          size="small"
          color="blue"
          class="mr-3"
          @click="
            dialogUpdate = true;
            operateRow = { ...item.raw };
          "
          >fa-solid fa-pen</v-icon
        >
        <v-icon
          size="small"
          color="red"
          @click="
            dialogDelete = true;
            operateRow = { ...item.raw };
          "
          >fa-solid fa-trash</v-icon
        >
      </template>

      <template v-slot:top>
        <v-row no-gutters>
          <v-col cols="2">
            <v-text-field
              label="工作中心编号"
              v-model="searchWorkCenterId"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
            <v-text-field
              label="工作中心名称"
              v-model="searchWorkCenterName"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
            <v-text-field
              label="工作中心类型"
              v-model="searchType"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
            <v-text-field
              label="工作中心地址"
              v-model="searchWorkCenterAddress"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
              label="创建人"
              v-model="searchCreator"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
            <v-text-field
              label="创建时间（起始）"
              v-model="searchStartCreateTime"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
            <v-text-field
              label="创建时间（结束）"
              v-model="searchEndCreateTime"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
              label="更新人"
              v-model="searchUpdatePerson"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
            <v-text-field
              label="更新时间（起始）"
              v-model="searchStartUpdateTime"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
            <v-text-field
              label="更新时间（结束）"
              v-model="searchEndUpdateTime"
              variant="outlined"
              density="compact"
              class="mt-3 ml-3"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-3">
            <v-btn
              size="large"
              color="black"
              class="mx-3"
              prepend-icon="fa-solid fa-search"
              @click="getWorkCenterList()"
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
            <v-btn
              size="large"
              color="teal"
              class="mr-3"
              prepend-icon="fa-solid fa-add"
              @click="
                dialogAdd = true;
                resetRow();
              "
              >新增工作中心</v-btn
            >
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </template>

      <template v-slot:bottom>
        <v-pagination
          v-model="showingPage"
          :length="totalPageCount"
        ></v-pagination>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialogAdd" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>新增工作中心</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogAdd = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateRow.work_center_id"
          label="工作中心编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.type"
          label="工作中心类型"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_name"
          label="工作中心名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_address"
          label="工作中心地址"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="green" class="mr-3" @click="addWorkCenter()">确认</v-btn>
        <v-btn color="grey" class="mr-3" @click="dialogAdd = false">取消</v-btn>
      </div>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogUpdate" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>更新工作中心</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogUpdate = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          class="mt-3"
          variant="outlined"
          v-model="operateRow.work_center_id"
          label="工作中心编号"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.type"
          label="工作中心类型"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_name"
          label="工作中心名称"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="operateRow.work_center_address"
          label="工作中心地址"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="blue" class="mr-3" @click="updateWorkCenter()"
          >确认</v-btn
        >
        <v-btn color="grey" class="mr-3" @click="dialogUpdate = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete" max-width="400">
    <v-card>
      <v-toolbar color="blue-darken-3">
        <v-toolbar-title>删除工作中心</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-3" @click="dialogDelete = false"
          >fa-solid fa-remove</v-icon
        >
      </v-toolbar>
      <v-card-text class="my-6 text-h6 text-red font-weight-medium text-center">
        您确认要删除吗？
      </v-card-text>
      <v-divider></v-divider>
      <div class="text-right my-3">
        <v-btn color="red" class="mr-3" @click="deleteWorkCenter()">确认</v-btn>
        <v-btn color="grey" class="mr-3" @click="dialogDelete = false"
          >取消</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>
