<script setup lang="ts">
//弹框
let addBomDialog = ref<boolean>(false);
let addDialog = ref<boolean>(false);
let addModelDialog = ref<boolean>(false);
let editBomDialog = ref<boolean>(false);
let editDialog = ref<boolean>(false);
let delBomDialog = ref<boolean>(false);
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
watch(searchType, async function () {
  await getBomList();
  materialId.value = bomData.value[0].material_id;
  materialName.value = bomData.value[0].material_name;
  materialModel.value = bomData.value[0].reserved02;
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
let groupedBomData = ref<any[]>([]);
//获取总装数据
async function getBomList() {
  const data: any = await useHttp(
    "/DesignBom/M68GetMesDesignBomList",
    "get",
    undefined,
    {
      reserved01: searchType.value,
      PageIndex: 1,
      PageSize: 100000,
      SortedBy: "id",
      SortType: 0,
    }
  );
  bomData.value = data.data.pageList;
  groupedBomData.value = bomData.value.reduce((result, item) => {
    (result[item.reserved01] = result[item.reserved01] || []).push(item);
    return result;
  }, {});
}

onMounted(async () => {
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
  };
  nodeBom.value = node;
  addBomDialog.value = true;
}
//新增序列
function showAdd() {
  bomInfo.value = {
    material_name: "",
    superior_id: "0",
    bom_grade: 1,
    material_quantity: "1",
    unit: "件",
    reserved01: "",
    reserved02: "",
  };
  addDialog.value = true;
}
//新增设备
function showAddModel(item: any) {
  bomInfo.value = {
    material_name: "",
    superior_id: "0",
    bom_grade: 1,
    material_quantity: "1",
    unit: "件",
    reserved01: item,
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
  addDialog.value = false;
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
    reserved03: null,
    reserved02: node.reserved02,
  };
  editBomDialog.value = true;
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
    reserved03: null,
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
  delBomDialog.value = true;
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
}
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-toolbar density="compact">
        <v-toolbar-title class="text-blue font-weight-bold"
          >设备名称</v-toolbar-title
        >
      </v-toolbar>
      <v-col cols="12">
        <div class="d-flex justify-space-between">
          <v-text-field
            v-model="searchType"
            label="序列"
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
          >
            新增序列
          </v-btn>
        </div>
      </v-col>

      <v-col clos="12">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="(group, title) in groupedBomData"
            :key="title"
            :title="title.toString()"
          >
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex justify-end">
                    <v-btn
                      color="blue-darken-2"
                      class="mx-2"
                      size="large"
                      @click="showAddModel(group[0].reserved01)"
                    >
                      新增设备
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" v-for="(item, index) in group" :key="index">
                  <v-list-item
                    :title="item.material_name"
                    hide-details
                    @click="showBomInfo(item)"
                  >
                    <template v-slot:append>
                      <v-icon
                        color="blue"
                        size="small"
                        class="mr-3"
                        @click.stop="showUpdateBomInfo(item)"
                      >
                        fa-solid fa-pen
                      </v-icon>

                      <v-icon
                        color="red"
                        size="small"
                        @click.stop="showDel(item)"
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
              >
                <div>名称：{{ node.$$data.label }}</div>
                <div v-show="node.$$data.material_quantity">
                  数量：{{ node.$$data.material_quantity
                  }}{{ node.$$data.unit }}
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
        <v-text-field
          v-model="bomInfo.material_name"
          label="名称"
        ></v-text-field>

        <v-text-field
          v-model="bomInfo.material_quantity"
          label="数量"
        ></v-text-field>

        <v-select label="单位" :items="units" v-model="bomInfo.unit"></v-select>
        <v-text-field label="型号" v-model="bomInfo.reserved02"></v-text-field>
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
        <v-toolbar-title> 新增序列 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-text-field label="系列" v-model="bomInfo.reserved01"></v-text-field>
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
        <v-btn color="grey" size="large" @click="addDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 新增序列内容设备-->
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
        <v-text-field
          v-model="bomInfo.material_name"
          label="名称"
        ></v-text-field>

        <v-text-field
          v-model="bomInfo.material_quantity"
          label="数量"
        ></v-text-field>

        <v-select label="单位" :items="units" v-model="bomInfo.unit"></v-select>
        <v-text-field label="型号" v-model="bomInfo.reserved02"></v-text-field>
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
        您是否确认要删除【{{ delName }}】这个设备或零部件？
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
</template>
