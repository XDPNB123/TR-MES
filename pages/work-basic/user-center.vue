<script setup lang="ts">
//弹框
let dialogAdd = ref(false);
let dialogDelete = ref(false);
let editDialog = ref(false);
//存储用户信息
let users = ref<any[]>([
  {
    cell_phone: "123",
    user_name: "zs",
    work_no: "123",
    login_rp: "PC",
    status: true,
  },
]);
let headers = ref<any[]>([
  {
    title: "用户手机号",
    key: "cell_phone",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "用户名称",
    key: "user_name",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工号",
    key: "work_no",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "平台",
    key: "login_rp",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "状态",
    key: "status",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    filterable: true,
  },
]);
let searchPhoneNum = ref<any>(null);
let searchName = ref<any>(null);
//当前页
let page = ref<number>(1);
watch(page, function () {
  getUserData();
});
//数据库存储的数据条数
let pageLength = ref<number>(100);
//一共有多少页
let pageCount = computed(() => {
  return Math.ceil(pageLength.value / 10);
});
//获取用户信息
async function getUserData() {
  const data: any = await useHttp("");
  pageLength.value = data.data.totalCount;
}
//查询用户
function filter() {
  page.value = 1;
  getUserData();
}
//重置查询
function resetFilter() {
  page.value = 1;
  searchPhoneNum.value = "";
  searchName.value = "";
  getUserData();
}
//用户对象
let userInfo = ref<any>(null);
//新增用户
function addUser() {
  userInfo.value = {
    user_name: "",
    password: "",
    work_no: "",
    cell_phone: "",
    login_rp: "PC",
    status: true,
  };
  dialogAdd.value = true;
}
//确认新增
async function addCertain() {
  const data: any = await useHttp("");
  getUserData();
  dialogAdd.value = false;
}
//用户修改
function showUpdate(item: any) {
  userInfo.value = item;
  editDialog.value = true;
}
//保存修改
function editCertain() {
  getUserData();
  editDialog.value = false;
}
//用户删除
function showDelete(item: any) {
  userInfo.value = item;
  dialogDelete.value = true;
}
//确认删除
async function deleteCertain() {
  getUserData();
  dialogDelete.value = false;
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="6">
      <v-text-field
        label="手机号"
        variant="outlined"
        density="compact"
        v-model="searchPhoneNum"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        label="用户名称"
        variant="outlined"
        density="compact"
        v-model="searchName"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-btn color="blue-darken-2" class="mr-2" size="large" @click="filter"
        >查询</v-btn
      >
      <v-btn color="red" class="mr-2" size="large" @click="resetFilter">
        重置
      </v-btn>
      <v-btn color="blue-darken-2" class="mr-2" size="large" @click="addUser">
        新增用户
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :items="users"
        :headers="headers"
        v-model:page="page"
        :items-per-page="10"
      >
        <template v-slot:item.status="{ item }">
          <v-switch
            v-model="item.raw.status"
            label="启用"
            color="blue"
            size="large"
          ></v-switch>
        </template>
        <template v-slot:item.action="{ item }">
          <!-- 角色分配 -->
          <v-icon color="blue" size="small" class="mr-5">
            fa-solid fa-users-gear
          </v-icon>
          <!-- 用户修改 -->
          <v-icon
            color="blue"
            size="small"
            class="mr-3"
            @click="showUpdate(item.raw)"
          >
            fa-solid fa-pen
          </v-icon>
          <!-- 用户删除 -->
          <v-icon color="red" size="small" @click="showDelete(item.raw)">
            fa-solid fa-trash
          </v-icon>
        </template>
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-col>
    <!-- 增加用户 -->
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
            label="用户名称"
            v-model="userInfo.user_name"
            clearable
          ></v-text-field>
          <v-text-field
            label="手机号"
            v-model="userInfo.cell_phone"
            clearable
          ></v-text-field>
          <v-text-field
            label="工号"
            v-model="userInfo.work_no"
            clearable
          ></v-text-field>
          <v-text-field
            label="密码"
            v-model="userInfo.password"
            clearable
          ></v-text-field>
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
    <!-- 删除用户-->
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
    <!-- 修改用户-->
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
            label="手机号"
            v-model="userInfo.cell_phone"
            clearable
          ></v-text-field>
          <v-text-field
            label="用户名称"
            v-model="userInfo.user_name"
            clearable
          ></v-text-field>
          <v-text-field
            label="工号"
            v-model="userInfo.work_no"
            clearable
          ></v-text-field>
          <v-text-field
            label="平台"
            v-model="userInfo.login_rp"
            clearable
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
  </v-row>
</template>
