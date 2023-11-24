<script setup lang="ts">
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
useSeoMeta({
  // 该页面的标题
  title: "常用BOM设计",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工单排产",
  // 该页面的描述
  description: "同日 MES 系统,常用BOM设计",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统,常用BOM设计",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
const router = useRouter();
//弹框
let addBomDialog = ref<boolean>(false);
let addDialog = ref<boolean>(false);
let addModelDialog = ref<boolean>(false);
let editBomDialog = ref<boolean>(false);
let editDialog = ref<boolean>(false);
let delBomDialog = ref<boolean>(false);
let delDialog = ref<boolean>(false);
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

//自动定义右键编译菜单
let menusDefine = ref<any[]>([
  { name: "新增其子节点", command: "add" },
  { name: "编辑当前节点", command: "edit" },
  { name: "删除当前节点", command: "delete" },
]);
//零部件对象
let bomInfo = ref<any>(null);
//搜素
let searchType = ref<string>("");
let searchName = ref<string>("");
watch(searchType, async function () {
  await getMaterialList();
});
watch(searchName, async function () {
  await getBomList();
});

//树形结构数据
const dataInfo = ref<any>({
  id: 1,
  label: "昆山同日云联",
  children: [
    {
      id: 2,
      pid: 1,
      label: "网络发生错误",
      children: [],
    },
    {
      id: 3,
      pid: 1,
      label: "出现此页面为数据获取不到",
      children: [],
    },
  ],
});

let bomData = ref<any[]>([]);
let materialList = ref<any[]>([]);

//获取设备系列数据
async function getMaterialList() {
  const data: any = await useHttp(
    "/SysConfig/M47GetProcessBasisConfig",
    "get",
    undefined,
    {
      config_type: "常用Bom组系列",
      rsv2: searchType.value,
    }
  );
  materialList.value = data.data;
}

let reserved01 = ref<any>(null);
//点击获取当前系列的设备数据
function showDevice(item: any) {
  reserved01.value = item.rsv2;
  getBomList();
}
//获取设备数据
async function getBomList() {
  const data: any = await useHttp(
    "/DesignBom/M68GetMesDesignBomList",
    "get",
    undefined,
    {
      reserved01: reserved01.value,
      material_name: searchName.value,
      PageIndex: 1,
      PageSize: 100000,
      SortedBy: "id",
      SortType: 0,
    }
  );
  bomData.value = data.data.pageList;
}

onMounted(async () => {
  await getMaterialList();
  await getBomList();
  materialId.value = bomData.value[0].material_id;
  materialName.value = bomData.value[0].material_name;
  materialModel.value = bomData.value[0].reserved02;
});

let materialId = ref("");
let materialName = ref("");
let materialModel = ref("");
//点击获取物料Id赋值给materialId
function showBomInfo(item: any) {
  materialId.value = item.material_id;
  materialName.value = item.material_name;
  materialModel.value = item.reserved02;
}
watch(materialId, function () {
  getBomInfo();
});
//获取到当前的加工件的零部件
async function getBomInfo() {
  const data: any = await useHttp(
    "/DesignBom/M69GetMesDesignBomById",
    "get",
    undefined,
    {
      material_id: materialId.value,
    }
  );
  dataInfo.value = data.data;
}

let nodeBom = ref<any>(null);
//新增零部件
function showAddBomInfo(node: any) {
  bomInfo.value = {
    material_name: "",
    superior_id: node.material_id,
    bom_grade: node.bom_grade + 1,
    material_quantity: "",
    unit: "件",
    reserved01: node.reserved01,
    reserved02: "",
    reserved03: "",
    reserved04: "是",
  };
  nodeBom.value = node;
  addBomDialog.value = true;
}
let rsv2 = ref<any>(null);
//新增系列
function showAdd() {
  rsv2.value = "";
  addDialog.value = true;
}
//确认新增系列
async function addRsv2() {
  await useHttp("/SysConfig/M48AddProcessBasis", "post", {
    config_code: "design_bom_type",
    rsv2: rsv2.value,
  });
  addDialog.value = false;
  getMaterialList();
}
//新增设备
function showAddModel(item: any) {
  bomInfo.value = {
    material_name: "",
    bom_grade: 1,
    reserved01: item.rsv2,
    reserved02: "",
  };
  addModelDialog.value = true;
}
//确认新增
async function addBomInfo() {
  await useHttp("/DesignBom/M70AddMesDesignBom", "post", [bomInfo.value]);
  getBomInfo();
  getBomList();
  addBomDialog.value = false;
  addModelDialog.value = false;
}

//修改
function showEditBomInfo(node: any) {
  bomInfo.value = {
    id: node.id,
    material_name: node.material_name,
    material_id: node.material_id,
    superior_id: node.superior_id,
    bom_grade: node.bom_grade,
    material_quantity: node.material_quantity,
    unit: node.unit,
    reserved01: node.reserved01,
    reserved02: node.reserved02,
    reserved03: node.reserved03,
    reserved04: node.reserved04,
  };
  if (node.bom_grade === 1) {
    return setSnackbar("black", "很抱歉，您不能在此处修改当前项！");
  } else {
    editBomDialog.value = true;
  }
}
//修改设备信息
function showUpdateBomInfo(node: any) {
  bomInfo.value = {
    id: node.id,
    material_name: node.material_name,
    material_id: node.material_id,
    superior_id: node.superior_id,
    bom_grade: node.bom_grade,
    material_quantity: node.material_quantity,
    unit: node.unit,
    reserved01: node.reserved01,
    reserved02: node.reserved02,
  };
  editDialog.value = true;
}
//确认修改
async function editBomInfo() {
  await useHttp("/DesignBom/M71UpdateMesDesignBom", "put", [bomInfo.value]);
  getBomInfo();
  getBomList();
  editBomDialog.value = false;
  editDialog.value = false;
}
//删除
//删除的id
let delId = ref<string>("");
//存储删除时的名称
let delName = ref<string>("");
function showDel(node: any) {
  delId.value = node.id;
  delName.value = node.material_name;
  if (node.bom_grade === 1) {
    return setSnackbar("black", "很抱歉，您不能在此处删除当前项！");
  } else {
    delBomDialog.value = true;
  }
}
//删除设备
function showDel2(node: any) {
  delId.value = node.id;
  delName.value = node.material_name;
  delDialog.value = true;
}
//确认删除
async function delBomInfo() {
  await useHttp("/DesignBom/M72DeleteMesDesignBom", "delete", undefined, {
    ids: delId.value,
  });
  getBomInfo();
  getBomList();
  materialId.value = bomData.value[0].material_id;
  materialName.value = bomData.value[0].material_name;
  materialModel.value = bomData.value[0].reserved02;
  delBomDialog.value = false;
  delDialog.value = false;
}
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-toolbar density="compact">
        <v-toolbar-title class="text-blue font-weight-bold"
          >产品系列名称</v-toolbar-title
        >
      </v-toolbar>
      <v-col cols="12">
        <div class="d-flex justify-space-between">
          <v-text-field
            v-model="searchType"
            label="系列搜索"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-text-field>
          <v-btn
            color="blue-darken-2"
            class="mx-2"
            size="large"
            @click="showAdd"
            v-permission="`${router.currentRoute.value.fullPath}->addSeries`"
          >
            新增产品系列
          </v-btn>
        </div>
      </v-col>

      <v-col clos="12">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="(item, index) in materialList"
            :key="index"
            :title="item.rsv2"
            @click="showDevice(item)"
          >
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex justify-space-between">
                    <v-text-field
                      v-model="searchName"
                      label="型号名称搜索"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    ></v-text-field>
                    <v-btn
                      color="blue-darken-2"
                      class="mx-2"
                      size="large"
                      @click="showAddModel(item)"
                      v-permission="
                        `${router.currentRoute.value.fullPath}->addModel`
                      "
                    >
                      新增型号
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-divider :thickness="3"></v-divider>
                  <v-list-item
                    v-for="(_item, _index) in bomData"
                    :key="_index"
                    :title="_item.material_name"
                    hide-details
                    @click="showBomInfo(_item)"
                  >
                    <template v-slot:append>
                      <v-icon
                        color="blue"
                        size="small"
                        class="mr-3"
                        @click.stop="showUpdateBomInfo(_item)"
                        v-permission="
                        `${router.currentRoute.value.fullPath}->updateModel`
                      "
                      >
                        fa-solid fa-pen
                      </v-icon>

                      <v-icon
                        color="red"
                        size="small"
                        @click.stop="showDel2(_item)"
                        v-permission="
                        `${router.currentRoute.value.fullPath}->deleteModel`
                      "
                      >
                        fa-solid fa-trash
                      </v-icon>
                    </template>
                  </v-list-item>
                  <v-divider :thickness="3"></v-divider>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-col>

    <v-col cols="9" style="height: 100vh">
      <v-toolbar density="compact">
        <v-toolbar-title class="text-blue font-weight-bold" v-if="materialName"
          >设备【名称：{{ materialName }}\型号：{{
            materialModel
          }}】物料详情</v-toolbar-title
        >
        <v-toolbar-title class="text-blue font-weight-bold" v-else
          >设备物料详情</v-toolbar-title
        >
      </v-toolbar>
      <!-- 确保仅在客户端渲染 -->
      <div style="height: 100%">
        <client-only>
          <vue3-tree-org
            ref="tree"
            :data="dataInfo"
            :toolBar="false"
            :draggable="false"
            :collapsable="true"
            :node-draggable="false"
            :default-expand-level="5"
            center
            :node-add="showAddBomInfo"
            :node-edit="showEditBomInfo"
            :node-delete="showDel"
            :define-menus="menusDefine"
          >
            <template v-slot="{ node }">
              <div
                class="text-start pa-3 bg-orange"
                style="border-radius: 10px"
                :class="
                  node.$$data.reserved04 === '否' ? 'bg-grey' : 'bg-orange'
                "
              >
                <div v-show="node.$$data.reserved03">
                  编号：{{ node.$$data.reserved03 }}
                </div>
                <div>名称：{{ node.$$data.label }}</div>
                <div v-show="node.$$data.material_quantity">
                  数量：{{ node.$$data.material_quantity
                  }}{{ node.$$data.unit }}
                </div>
                <div v-show="node.$$data.reserved04">
                  是否必须：{{ node.$$data.reserved04 }}
                </div>
              </div>
            </template>
          </vue3-tree-org>
        </client-only>
      </div>
    </v-col>
  </v-row>
  <!-- 新增零部件对象 -->
  <v-dialog v-model="addBomDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增零部件 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addBomDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="零件编号"
              v-model="bomInfo.reserved03"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="bomInfo.material_name"
              label="名称"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="bomInfo.material_quantity"
              label="数量"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              label="单位"
              :items="units"
              v-model="bomInfo.unit"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="型号"
              v-model="bomInfo.reserved02"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              label="是否必须"
              v-model="bomInfo.reserved04"
              :items="['是', '否']"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="addBomInfo"
        >
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="addBomDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 新增序列-->
  <v-dialog v-model="addDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增设备系列 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-text-field label="系列" v-model="rsv2"></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn color="blue-darken-2" size="large" class="mr-2" @click="addRsv2">
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="addDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 新增设备-->
  <v-dialog v-model="addModelDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增设备对象 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addModelDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-text-field label="型号" v-model="bomInfo.reserved02"></v-text-field>
        <v-text-field
          v-model="bomInfo.material_name"
          label="设备名称"
        ></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="addBomInfo"
        >
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="addModelDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改零部件对象 -->
  <v-dialog v-model="editBomDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 修改零部件对象 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editBomDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="零件编号"
              v-model="bomInfo.reserved03"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="bomInfo.material_name"
              label="名称"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="bomInfo.material_quantity"
              label="数量"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              label="单位"
              :items="units"
              v-model="bomInfo.unit"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="型号"
              v-model="bomInfo.reserved02"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              label="是否必须"
              v-model="bomInfo.reserved04"
              :items="['是', '否']"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="editBomInfo"
        >
          确认修改
        </v-btn>
        <v-btn color="grey" size="large" @click="editBomDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改设备对象 -->
  <v-dialog v-model="editDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 修改设备信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-text-field
          v-model="bomInfo.material_name"
          label="名称"
        ></v-text-field>
        <v-text-field label="型号" v-model="bomInfo.reserved02"></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="editBomInfo"
        >
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="editDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除零部件对象 -->
  <v-dialog v-model="delBomDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 删除零部件对象 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="delBomDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4 text-red">
        您是否确认要删除【{{ delName }}】这个零部件？
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="delBomInfo"
        >
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="delBomDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除设备对象 -->
  <v-dialog v-model="delDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 删除设备对象 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="delDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4 text-red">
        您是否确认要删除【{{ delName }}】这个设备？
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="delBomInfo"
        >
          确认新增
        </v-btn>
        <v-btn color="grey" size="large" @click="delDialog = false">
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
