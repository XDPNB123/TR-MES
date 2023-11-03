<script setup lang="ts">
//弹框
let addBomDialog = ref<boolean>(false);
let editBomDialog = ref<boolean>(false);
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
//零部件对象
let bomInfo = ref<any>(null);
//搜素
let searchType = ref<string>("装配");
watch(searchType, async function () {
  await getBomList();
  materialId.value = bomData.value[0].material_id;
  materialName.value = bomData.value[0].material_name;
});
let searchName = ref<string>("");
let searchId = ref<string>("");
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
//设置背景颜色
let styleTree = ref("bg-color-orange");
let bomData = ref<any[]>([]);
//获取总转数据
async function getBomList() {
  bomData.value = [];
  const data: any = await useHttp(
    "/DesignBom/M68GetMesDesignBomList",
    "get",
    undefined,
    {
      material_id: searchId.value,
      material_name: searchName.value,
      reserved01: searchType.value,
      superior_id: "",
      PageIndex: 1,
      PageSize: 100000,
      SortedBy: "id",
      SortType: 0,
    }
  );
  data.data.pageList.map((item: any) =>
    bomData.value.push({
      material_id: item.material_id,
      material_name: item.material_name,
      material_quantity: item.material_quantity,
      children: [],
    })
  );
}
onMounted(async () => {
  await getBomList();
  materialId.value = bomData.value[0].material_id;
  materialName.value = bomData.value[0].material_name;
});

//搜索
function filter() {
  getBomList();
}
//重置搜索
function restFilter() {
  (searchId.value = ""), (searchName.value = ""), getBomList();
}
let materialId = ref("");
let materialName = ref("");
//点击获取物料Id赋值给materialId
function showBomInfo(item: any) {
  materialId.value = item.material_id;
  materialName.value = item.material_name;
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
function addBomINfo(node: any) {
  bomInfo.value = {
    material_name: "",
    superior_id: node.material_id,
    bom_grade: node.bom_grade + 1,
    material_quantity: "",
    unit: "件",
    reserved01: "装配",
  };
  nodeBom.value = node;
  addBomDialog.value = true;
}
//新增设备
function showAdd() {
  bomInfo.value = {
    material_name: "",
    superior_id: "0",
    bom_grade: 1,
    material_quantity: "",
    unit: "件",
    reserved01: "装配",
  };
  addBomDialog.value = true;
}
//确认新增
async function addBomInfo() {
  await useHttp("/DesignBom/M70AddMesDesignBom", "post", [bomInfo.value]);
  getBomInfo();
  getBomList();
  addBomDialog.value = false;
}

//修改
function editBomINfo(node: any) {
  console.log(node.material_quantity);
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
    reserved02: null,
  };
  editBomDialog.value = true;
}
//确认修改
async function editBomInfo() {
  await useHttp("/DesignBom/M71UpdateMesDesignBom", "put", [bomInfo.value]);
  getBomInfo();
  editBomDialog.value = false;
}
//删除
//删除的id
let delId = ref<string>("");
//存储删除时的名称
let delName = ref<string>("");
function delBomINfo(node: any) {
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
  delBomDialog.value = false;
}
function clg(node: any) {
  console.log(node);
}
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="4">
      <v-text-field
        v-model="searchId"
        label="物料编号"
        variant="outlined"
        density="compact"
        @keydown.enter="filter"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="searchName"
        label="名称"
        variant="outlined"
        density="compact"
        @keydown.enter="filter"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="searchType"
        label="类型"
        :items="['装配', '机加工']"
        variant="outlined"
        density="compact"
        @keydown.enter="filter"
      ></v-select>
    </v-col>

    <v-col cols="12">
      <v-btn color="blue-darken-2" class="mr-2" size="large" @click="filter()"
        >查询</v-btn
      >
      <v-btn color="red" class="mr-2" size="large" @click="restFilter">
        重置查询
      </v-btn>
      <v-btn color="blue-darken-2" class="mr-2" size="large" @click="showAdd">
        新增设备物料
      </v-btn>
    </v-col>

    <v-col clos="12">
      <v-card>
        <v-toolbar density="compact">
          <v-toolbar-title class="text-blue font-weight-bold"
            >设备名称</v-toolbar-title
          >
        </v-toolbar>
        <div class="overflow-x-auto w-100" style="white-space: nowrap">
          <v-card
            class="mx-2 mt-3 mb-1 elevation-2 rounded-lg px-6 py-3 bg-green-lighten-5"
            v-for="(item, index) in bomData"
            :key="index"
            style="display: inline-block"
            :title="item.material_name"
            @click="showBomInfo(item)"
          >
          </v-card>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-divider :thickness="4"></v-divider>
  <v-toolbar density="compact">
    <v-toolbar-title class="text-blue font-weight-bold" v-if="materialName"
      >设备【{{ materialName }}】物料详情</v-toolbar-title
    >
    <v-toolbar-title class="text-blue font-weight-bold" v-else
      >设备物料详情</v-toolbar-title
    >
  </v-toolbar>
  <!-- 确保仅在客户端渲染 -->
  <client-only>
    <vue3-tree-org
      ref="tree"
      :data="dataInfo"
      :toolBar="false"
      :draggable="false"
      :collapsable="true"
      :default-expand-level="5"
      center
      :node-add="addBomINfo"
      :node-edit="editBomINfo"
      :node-delete="delBomINfo"
      :label-class-name="styleTree"
    >
      <template v-slot="{ node }">
        <div style="padding: 10px 10px">
          <div>名称：{{ node.$$data.label }}</div>
          <div v-show="node.$$data.material_quantity">
            数量：{{ node.$$data.material_quantity }}{{ node.$$data.unit }}
          </div>
          <div v-show="node.$$data.reserved01">
            类型：{{ node.$$data.reserved01 }}
          </div>
        </div>
      </template>
    </vue3-tree-org>
  </client-only>

  <!-- 新增零部件对象 -->
  <v-dialog v-model="addBomDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增零部件对象 </v-toolbar-title>
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
        <v-select
          label="类型"
          :items="['装配', '机加工']"
          v-model="bomInfo.reserved01"
        ></v-select>
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
        <v-select
          label="类型"
          :items="['装配', '机加工']"
          v-model="bomInfo.reserved01"
        ></v-select>
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
        <v-btn color="grey" size="large" @click="editBomDialog = false">
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
<style>
.bg-color-orange {
  color: black;
  background-color: orange;
}
</style>
