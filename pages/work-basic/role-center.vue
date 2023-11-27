<script setup lang="ts">
//弹框
let dialogAdd = ref(false);
let dialogDelete = ref(false);
let editDialog = ref(false);
let permissionDialog = ref(false);
//存储用户信息
let roleList = ref<any[]>([]);
let headers = ref<any[]>([
  {
    title: "角色名称",
    key: "roleName",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "角色描述",
    key: "role_text",
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
async function getRoleData() {
  const data: any = await useHttp(
    "/RolePermissions/A10GetRoleDate",
    "get",
    undefined
  );
  roleList.value = data.data;
}
onMounted(() => {
  getRoleData();
});
//查询用户
function filter() {
  getRoleData();
}
//重置查询
function resetFilter() {
  searchPhoneNum.value = "";
  searchName.value = "";
  getRoleData();
}
//用户对象
let roleInfo = ref<any>(null);
//新增角色
function addUser() {
  roleInfo.value = {
    role_name: "",
    role_text: "",
    status: true,
  };
  dialogAdd.value = true;
}
//确认新增
async function addCertain() {
  const data: any = await useHttp(
    "/User/A22AddUserRole",
    "post",
    roleInfo.value
  );
  getRoleData();
  dialogAdd.value = false;
}
//角色修改
function showUpdate(item: any) {
  roleInfo.value = { ...item };
  editDialog.value = true;
}
//保存修改
async function editCertain() {
  const data: any = await useHttp(
    "/User/A19PutUserInfo",
    "put",
    roleInfo.value
  );
  getRoleData();
  editDialog.value = false;
}
//角色删除
function showDelete(item: any) {
  roleInfo.value = { ...item };
  dialogDelete.value = true;
}
//确认删除
async function deleteCertain() {
  const data: any = await useHttp("/User/A20DelUser", "delete", undefined, {
    ids: roleInfo.user_id,
  });
  getRoleData();
  dialogDelete.value = false;
}
//禁用用户
async function disableUser(item: any) {
  getRoleData();
  editDialog.value = false;
}
//分配权限
function showPermissions() {
  
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
        新增角色
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table :items="roleList" :headers="headers" :items-per-page="10">
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
          <!-- 权限分配 -->
          <v-icon
            color="blue"
            size="small"
            class="mr-5"
            @click="showPermissions"
          >
            fa-solid fa-gears
          </v-icon>
          <!-- 角色修改 -->
          <v-icon
            color="blue"
            size="small"
            class="mr-3"
            @click="showUpdate(item.raw)"
          >
            fa-solid fa-pen
          </v-icon>
          <!-- 角色删除 -->
          <v-icon color="red" size="small" @click="showDelete(item.raw)">
            fa-solid fa-trash
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <!-- 增加角色 -->
    <v-dialog v-model="dialogAdd" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增角色信息 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogAdd = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            label="角色名称"
            v-model="roleInfo.role_name"
            clearable
          ></v-text-field>
          <v-text-field
            label="角色描述"
            v-model="roleInfo.role_text"
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
    <!-- 删除角色-->
    <v-dialog v-model="dialogDelete" min-width="400px" width="500px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除角色信息 </v-toolbar-title>
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
    <!-- 修改角色-->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改角色信息 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            label="角色名称"
            v-model="roleInfo.role_name"
            clearable
          ></v-text-field>
          <v-text-field
            label="角色描述"
            v-model="roleInfo.role_text"
            clearable
          ></v-text-field>
          role_name
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
    <!-- 修改权限-->
    <v-dialog v-model="permissionDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改角色权限 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="permissionDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            label="角色名称"
            v-model="roleInfo.role_name"
            clearable
          ></v-text-field>
          <v-text-field
            label="角色描述"
            v-model="roleInfo.role_text"
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
            保存修改
          </v-btn>
          <v-btn color="grey" size="large" @click="permissionDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
