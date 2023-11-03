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
let search = ref<string>("");
//树形结构数据
const dataInfo = ref<any>({
  id: 1,
  label: "xxx科技有限公司",
  children: [
    {
      id: 2,
      pid: 1,
      label: "产品研发部",
      children: [
        { id: 6, pid: 2, label: "禁止编辑节点", disabled: true },
        { id: 8, pid: 2, label: "禁止拖拽节点", noDragging: true },
        { id: 10, pid: 2, label: "测试" },
      ],
    },
    {
      id: 3,
      pid: 1,
      label: "客服部",
      children: [
        { id: 11, pid: 3, label: "客服一部" },
        { id: 12, pid: 3, label: "客服二部" },
      ],
    },
    { id: 4, pid: 1, label: "业务部" },
  ],
});

let bomData = ref<any[]>([]);
//获取总转数据
async function getBomList() {
  const data: any = await useHttp(
    "/DesignBom/M68GetMesDesignBomList",
    "get",
    undefined,
    {
      material_id: "",
      material_name: "",
      superior_id: "",
      PageIndex: 1,
      PageSize: 10,
      SortedBy: "id",
      SortType: 0,
    }
  );
  data.data.pageList.map((item: any) =>
    bomData.value.push({
      material_id: item.material_id,
      material_name: item.material_name,
      children: [],
    })
  );
  console.log(bomData.value);
}
onMounted(() => {
  getBomList();
});
function filter() {}
let materialId = ref("");
//点击获取物料Id赋值给materialId
function showBomInfo(item: any) {
  materialId.value = item.material_id;
  getBomInfo();
}
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
  console.log(dataInfo.value);
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
  };
  nodeBom.value = node;
  addBomDialog.value = true;
}
//确认新增
async function addBomInfo() {
  await useHttp("/DesignBom/M70AddMesDesignBom", "post", [bomInfo.value]);
  getBomInfo();
  addBomDialog.value = false;
}

//修改
function editBomINfo(node: any) {
  console.log(node);
  bomInfo.value = {
    id: node.id,
    material_name: node.material_name,
    material_id: node.material_id,
    superior_id: node.superior_id,
    bom_grade: node.bom_grade,
    material_quantity: node.material_quantity,
    unit: node.unit,
    reserved03: null,
    reserved01: null,
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
function delBomINfo(node: any) {
  delId.value = node.id;
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
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="4">
      <v-text-field
        v-model="search"
        label="请输入搜索内容"
        @keydown.enter="filter"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="search"
        label="请输入搜索内容"
        @keydown.enter="filter"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="search"
        label="请输入搜索内容"
        @keydown.enter="filter"
      ></v-text-field>
    </v-col>
    <v-col clos="12">
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
    </v-col>
  </v-row>
  <v-divider :thickness="4"></v-divider>
  <vue3-tree-org
    ref="tree"
    :data="dataInfo"
    :toolBar="false"
    :draggable="false"
    :collapsable="true"
    default-expand-level="5"
    center
    :node-add="addBomINfo"
    :node-edit="editBomINfo"
    :node-delete="delBomINfo"
  >
  </vue3-tree-org>

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

      <v-card-text class="mt-4"> 您是否确认要删除这个零部件？ </v-card-text>

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
