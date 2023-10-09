<template>
  <v-card>
    <v-btn
      color="green"
      variant="flat"
      size="large"
      @click="dialogAdd = true"
      class="mx-2"
      >新增
    </v-btn>
    <v-btn color="blue-darken-4" variant="flat" size="large" @click="ToText">
      导入
    </v-btn>
    <v-btn class="ma-2" color="blue" size="large">保存</v-btn>
    <v-btn color="primary" size="large">取消</v-btn>
  </v-card>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :search="search"
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'calories', order: 'asc' }]"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon color="orange" size="small" class="mr-3" @click="">
        fa-solid fa-eye
      </v-icon>
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
          text = { ...item.raw };
        "
      >
        fa-solid fa-trash
      </v-icon>
    </template>
  </v-data-table>

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
          label="物料名称"
          v-model="conference.name"
          clearable
        ></v-text-field>
        <v-text-field
          label="物料数量"
          v-model="conference.num"
          clearable
        ></v-text-field>
        <v-text-field
          label="物料单位"
          v-model="conference.unit"
          clearable
        ></v-text-field>
      </v-card-text>
      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn color="blue" size="large" class="mr-2" @click="addCertain()">
          确认
        </v-btn>
        <v-btn color="grey" size="large" @click="dialogAdd = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
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
        <v-btn color="blue" size="large" class="mr-2" @click="deleteCertain()">
          确认
        </v-btn>
        <v-btn color="grey" size="large" @click="dialogDelete = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
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
        <v-text-field v-model="conference.name" label="物料名称"></v-text-field>
        <v-text-field v-model="conference.num" label="物料数量"></v-text-field>
        <v-text-field
          v-model="conference.number"
          label="已领取数量"
        ></v-text-field>
        <v-text-field v-model="conference.unit" label="物料单位"></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn color="blue" size="large" class="mr-2" @click="editCertain()">
          确认修改
        </v-btn>
        <v-btn color="grey" size="large" @click="editDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
let router = useRouter();
let itemsPerPage = ref(10);
let search = ref("");
let dialogAdd = ref(false);
let dialogDelete = ref(false);
let editDialog = ref(false);
let text = ref(0);
let conference = ref<any>({
  id: 1,
  name: "",
  num: 0,
  number: 0,
  unit: "件",
});
const headers = ref<any[]>([
  {
    title: "序号",
    align: "center",
    sortable: false,
    key: "id",
  },
  { title: "物料名称", align: "center", key: "name" },
  { title: "物料数量", align: "center", key: "num" },
  { title: "已领取数量", align: "center", key: "number" },
  { title: "单位", align: "center", key: "unit" },
  { title: "操作", align: "center", key: "actions", sortable: false },
]);
const desserts = ref<any[]>([
  {
    id: 1,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 2,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 3,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 4,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 5,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 6,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 7,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 8,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 9,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 10,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 11,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
  {
    id: 12,
    name: "称重支腿",
    num: 6,
    number: 24,
    unit: "件",
  },
]);
function ToText() {
  router.push("/text");
}
function addCertain() {
  desserts.value.push(conference.value);
  dialogAdd.value = false;
}
function deleteCertain() {
  desserts.value.splice(text.value - 1, 1);
  dialogDelete.value = false;
}
function goBack() {
  router.back();
}
function editCertain() {
  desserts.value.forEach((item, index) => {
    if (item.id === conference.value.id) {
      desserts.value[index] = { ...conference.value };
    }
  });
  editDialog.value = false;
}
</script>
