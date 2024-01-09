<script setup lang="ts">
onMounted(() => {
  getFolderData();
});
let searchType = ref<any>("PC");
watch(searchType, function () {
  getFolderData();
});
//弹框
let addFolderDialog = ref<boolean>(false);
let addPageDialog = ref<boolean>(false);
let addBtnDialog = ref<boolean>(false);
//存储文件夹名称
let folderList = ref<any[]>([]);
//存储页面路由
let pageUrlList = ref<any[]>([]);
//存储按钮
let btnList = ref<any[]>([]);
//获取文件夹数据
async function getFolderData() {
  const data: any = await useHttp(
    "/Permissions/A16GetPermissionsList",
    "get",
    undefined,
    {
      pid: 0,
      platform: searchType.value,
    }
  );
  folderList.value = data.data;
}
//暂存文件夹对象
let folderInfo = ref<any>(null);
//暂存文件夹对象
let pageInfo = ref<any>(null);
//点击获取当前文件夹下的页面路由
function showPageUrlData(item: any) {
  folderInfo.value = item;
  getPageUrlData();
}
async function getPageUrlData() {
  const data: any = await useHttp(
    "/Permissions/A16GetPermissionsList",
    "get",
    undefined,
    {
      pid: folderInfo.value.permission_id,
      platform: folderInfo.value.platform,
    }
  );
  pageUrlList.value = data.data;
}
//点击查看当前页面下的按钮权限
function showBtnData(item: any) {
  pageInfo.value = item;
  getBtnData();
}
//点击查看当前页面下的按钮权限
async function getBtnData() {
  const data: any = await useHttp(
    "/Permissions/A16GetPermissionsList",
    "get",
    undefined,
    {
      pid: pageInfo.value.permission_id,
      platform: pageInfo.value.platform,
    }
  );
  btnList.value = data.data;
}
//新增权限
//权限对象
let permissionInfo = ref<any>(null);
//新增文件夹权限
function showAdd() {
  permissionInfo.value = {
    permission_title: "",
    parent_id: 0,
    permission_api_url: "",
    page_url: "",
    is_menu: true,
    icon_name: "",
    action_name: "",
    platform: "PC",
  };
  addFolderDialog.value = true;
}
//确认新增
async function addPermission() {
  await useHttp("/Permissions/A17AddPermissions", "post", permissionInfo.value);
  addFolderDialog.value = false;
  addPageDialog.value = false;
  addBtnDialog.value = false;
  getFolderData();
  getPageUrlData();
  getBtnData();
}
//新增页面权限
function showAddPage() {
  permissionInfo.value = {
    permission_title: "",
    parent_id: folderInfo.value.permission_id,
    permission_api_url: "",
    page_url: "",
    is_menu: true,
    icon_name: "",
    action_name: "",
    platform: "PC",
  };
  addPageDialog.value = true;
}
//新增按钮权限
function showAddBtn(item: any) {
  permissionInfo.value = {
    permission_title: "",
    parent_id: item.permission_id,
    permission_api_url: "",
    page_url: item.page_url,
    is_menu: false,
    icon_name: "",
    action_name: "",
    platform: "PC",
  };
  addBtnDialog.value = true;
}
</script>
<template>
  <v-row class="ma-2">
    <!-- 左侧的文件夹 -->
    <v-col cols="3">
      <v-card height="85vh" class="overflow-y-auto">
        <v-toolbar density="compact">
          <v-toolbar-title class="text-blue font-weight-bold"
            >文件夹名称</v-toolbar-title
          >
        </v-toolbar>
        <v-row class="ma-1">
          <v-col cols="12">
            <div class="d-flex justify-space-between">
              <v-select
                v-model="searchType"
                label="类型"
                variant="outlined"
                density="compact"
                hide-details
                :items="['PC', 'PDA']"
                clearable
              ></v-select>
              <v-btn
                color="blue-darken-2"
                class="mx-2"
                size="large"
                @click="showAdd"
              >
                新增文件夹
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12">
            <v-list
              density="compact"
              class="ma-2 elevation-2 rounded-lg"
              v-for="(item, index) in folderList"
              :key="index"
              @click="showPageUrlData(item)"
            >
              <v-list-item :title="item.permission_title"> </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- 右侧的页面和按钮 -->
    <v-col cols="9">
      <v-card height="85vh" class="overflow-y-auto">
        <v-toolbar density="compact">
          <v-toolbar-title class="text-blue font-weight-bold"
            >页面路由与按钮</v-toolbar-title
          >
        </v-toolbar>
        <v-row class="ma-1">
          <v-col cols="12">
            <v-btn
              color="blue-darken-2"
              class="mx-2"
              size="large"
              v-if="folderInfo"
              @click="showAddPage"
            >
              新增页面权限
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels variant="accordion">
              <v-expansion-panel
                v-for="(item, index) in pageUrlList"
                :key="index"
                :title="item.permission_title"
                @click="showBtnData(item)"
              >
                <v-expansion-panel-text>
                  <v-row class="ma-1">
                    <v-col cols="12">
                      <v-btn
                        color="blue-darken-2"
                        class="mx-2"
                        size="large"
                        @click="showAddBtn(item)"
                      >
                        新增按钮权限
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-list
                        density="compact"
                        class="ma-2 elevation-2 rounded-lg"
                        v-for="(item_, index_) in btnList"
                        :key="index_"
                      >
                        <v-list-item :title="item_.permission_title">
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- 新增文件权限 -->
    <v-dialog v-model="addFolderDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增文件权限 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addFolderDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="权限名称"
                v-model="permissionInfo.permission_title"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="permissionInfo.permission_api_url"
                label="接口路由"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="permissionInfo.page_url"
                label="页面路由"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="图标"
                v-model="permissionInfo.icon_name"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="客户端"
                v-model="permissionInfo.platform"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addPermission"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addFolderDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 新增页面权限 -->
    <v-dialog v-model="addPageDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增页面权限 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addPageDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="权限名称"
                v-model="permissionInfo.permission_title"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="permissionInfo.permission_api_url"
                label="接口路由"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="permissionInfo.page_url"
                label="页面路由"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="图标"
                v-model="permissionInfo.icon_name"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="客户端"
                v-model="permissionInfo.platform"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addPermission"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addPageDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 新增按钮权限 -->
    <v-dialog v-model="addBtnDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增按钮权限 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addBtnDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="权限名称"
                v-model="permissionInfo.permission_title"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="permissionInfo.permission_api_url"
                label="接口路由"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="permissionInfo.page_url"
                label="页面路由"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="图标"
                v-model="permissionInfo.icon_name"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="按钮名"
                v-model="permissionInfo.action_name"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="客户端"
                v-model="permissionInfo.platform"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addPermission"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addBtnDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
