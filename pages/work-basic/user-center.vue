<script setup lang="ts">
import { number } from "echarts";

//弹框
let dialogAdd = ref(false);
let dialogDelete = ref(false);
let editDialog = ref(false);
let assignDialog = ref(false);
//存储用户信息
let users = ref<any[]>([]);
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
    title: "角色",
    key: "rolenames",
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
let pageLength = ref<number>(0);
//一共有多少页
let pageCount = computed(() => {
  return Math.ceil(pageLength.value / 10);
});
//获取用户信息
async function getUserData() {
  const data: any = await useHttp(
    "/User/A21GetUserRoleList",
    "get",
    undefined,
    {
      cell_phone: searchPhoneNum.value,
      Name: searchName.value,
      PageIndex: page.value,
      PageSize: 10,
      SortedBy: "id",
      SortType: 0,
    }
  );

  users.value = data.data.pageList;
  pageLength.value = data.data.totalCount;
}
onMounted(() => {
  getUserData();
});
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
// //新增用户
// function addUser() {
//   userInfo.value = {
//     user_name: "",
//     password: "",
//     work_no: "",
//     cell_phone: "",
//     login_rp: "PC",
//     status: true,
//   };
//   dialogAdd.value = true;
// }
// //确认新增
// async function addCertain() {
//   const data: any = await useHttp(
//     "/User/A22AddUserRole",
//     "post",
//     userInfo.value
//   );
//   getUserData();
//   dialogAdd.value = false;
// }
//用户修改
function showUpdate(item: any) {
  userInfo.value = { ...item };
  editDialog.value = true;
}
//保存修改
async function editCertain() {
  const data: any = await useHttp("/User/A19PutUserInfo", "put", {
    Uid: userInfo.value.user_id,
    Status: userInfo.value.status,
    UName: userInfo.value.user_name,
    Work_No: userInfo.value.work_no,
  });
  getUserData();
  editDialog.value = false;
}
//用户删除
function showDelete(item: any) {
  userInfo.value = { ...item };
  dialogDelete.value = true;
}
//确认删除
async function deleteCertain() {
  const data: any = await useHttp("/User/A20DelUser", "delete", undefined, {
    ids: userInfo.value.user_id,
  });
  getUserData();
  dialogDelete.value = false;
}
//禁用用户
async function disableUser(item: any) {
  item.status = !item.status;
  const data: any = await useHttp("/User/A19PutUserInfo", "put", {
    Uid: item.user_id,
    Status: item.status,
    UName: item.user_name,
    Work_No: item.work_no,
  });
  getUserData();
  editDialog.value = false;
}
//已选的角色
let roles = ref<any[]>([]);
//存储数据库里面的所有角色数据
let roleList = ref<any[]>([]);
async function getRoleData() {
  const data: any = await useHttp(
    "/RolePermissions/A10GetRoleDate",
    "get",
    undefined
  );
  roleList.value = data.data.filter((item: any) => item.status === true);
}
//分配角色
function showAssign(item: any) {
  userInfo.value = { ...item };
  getRoleData();
  roles.value = userInfo.value.roleids.split(",").map(Number);
  assignDialog.value = true;
}

//保存分配
async function saveAssign() {
  await useHttp("/User/A22AddUserRole", "post", {
    user_id: userInfo.value.user_id,
    role_id: roles.value.join(","),
  });
  getUserData();
  assignDialog.value = false;
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
      <v-btn color="blue-darken-2" class="mr-2" size="large" @click="filter">
        查询
      </v-btn>
      <v-btn color="red" class="mr-2" size="large" @click="resetFilter">
        重置
      </v-btn>
      <!-- <v-btn color="blue-darken-2" class="mr-2" size="large" @click="addUser">
        新增用户
      </v-btn> -->
    </v-col>
    <v-col cols="12">
      <v-data-table :items="users" :headers="headers" :items-per-page="10">
        <template v-slot:item.status="{ item }">
          <v-switch
            style="display: inline-block; max-width: 120px"
            v-model="item.raw.status"
            label="启用"
            color="blue"
            hide-details
            inset
            @click="disableUser(item.raw)"
          ></v-switch>
        </template>
        <template v-slot:item.action="{ item }">
          <!-- 角色分配 -->
          <v-icon
            color="blue"
            size="small"
            class="mr-5"
            @click="showAssign(item.raw)"
          >
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
    <!-- <v-dialog v-model="dialogAdd" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增用户信息 </v-toolbar-title>
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
          <v-text-field
            label="公司"
            v-model="userInfo.company_name"
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
    </v-dialog> -->
    <!-- 删除用户-->
    <v-dialog v-model="dialogDelete" min-width="400px" width="500px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除用户信息 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDelete = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>确定删除这条用户信息吗?</v-card-text>
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
          <v-toolbar-title> 修改用户信息 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
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
            label="工号"
            v-model="userInfo.work_no"
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
    <!-- 给用户分配角色-->
    <v-dialog v-model="assignDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 分配角色 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="assignDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-select
            label="角色列表"
            v-model="roles"
            clearable
            chips
            :items="roleList"
            item-title="role_name"
            item-value="role_id"
            multiple
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="saveAssign()"
          >
            保存分配
          </v-btn>
          <v-btn color="grey" size="large" @click="assignDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
