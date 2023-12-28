<template>
  <v-row class="ma-2">
    <v-col cols="4"
      ><v-text-field
        label="项目号"
        v-model="projectCode"
        variant="outlined"
        density="compact"
        :rules="projectCodeRule"
        class="mt-2"
      ></v-text-field
    ></v-col>
    <v-col cols="4"
      ><v-text-field
        label="设备名称"
        v-model="name"
        variant="outlined"
        density="compact"
        class="mt-2"
      ></v-text-field
    ></v-col>
    <v-col cols="4">
      <v-text-field
        label="设备编号"
        v-model="code"
        variant="outlined"
        density="compact"
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <hot-table :data="data" :settings="hotSettings"> </hot-table>
    </v-col>
    <v-col cols="12">
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="confirmData"
        >导入</v-btn
      >
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="filter"
        >查询</v-btn
      >
      <v-btn color="red" class="mr-2 mt-2" size="default" @click="resetFilter"
        >重置查询</v-btn
      >
    </v-col>
    <v-col cols="3"
      ><v-text-field
        label="项目号"
        v-model="searchProjectCode"
        variant="outlined"
        density="compact"
        class="mt-2"
      ></v-text-field
    ></v-col>
    <v-col cols="3"
      ><v-text-field
        label="设备名称"
        v-model="searchName"
        variant="outlined"
        density="compact"
        class="mt-2"
      ></v-text-field
    ></v-col>
    <v-col cols="3">
      <v-text-field
        label="设备编号"
        v-model="searchCode"
        variant="outlined"
        density="compact"
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="外购件信息"
        v-model="searchAll"
        variant="outlined"
        density="compact"
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-data-table
        hover
        :items="produceList"
        :headers="produceHeaders"
        :items-per-page="10"
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
      >
        <template v-slot:item.action="{ item }">
          <v-icon
            color="red"
            size="small"
            @click.stop="showDelDialog(item.raw)"
            v-permission="`${router.currentRoute.value.fullPath}->deleteOrder`"
          >
            fa-solid fa-trash
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <!-- 删除 -->
    <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center"> 您确定要删除这条数据吗? </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="delSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
const router = useRouter();
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
let deleteDialog = ref<boolean>(false);
//搜索
let searchProjectCode = ref<any>("");
let searchName = ref<any>("");
let searchCode = ref<any>("");
let searchAll = ref<any>("");
let produceHeaders = ref<any[]>([
  {
    title: "项目号",
    align: "center",
    key: "project_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "设备名称",
    align: "center",
    key: "devicename",
    sortable: false,
    filterable: true,
  },
  {
    title: "设备编号",
    align: "center",
    key: "devicecode",
    sortable: false,
    filterable: true,
  },
  {
    title: "存货编码",
    align: "center",
    key: "inventory_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "名称",
    align: "center",
    key: "product_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "规格/图号",
    align: "center",
    key: "specification_drawing_number",
    sortable: false,
    filterable: true,
  },
  {
    title: "品牌",
    align: "center",
    key: "brand",
    sortable: false,
    filterable: true,
  },
  {
    title: "总数量",
    align: "center",
    key: "total_quantity",
    sortable: false,
    filterable: true,
  },
  {
    title: "单位",
    align: "center",
    key: "unit",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    align: "center",
    key: "action",
    sortable: false,
    filterable: true,
  },
]);
let produceList = ref<any[]>([]);
//获取数据库里的外购件数据
async function getProduce() {
  const data: any = await useHttp(
    "/PackingList/M102GetProcuredOrder",
    "get",
    undefined,
    {
      project_code: searchProjectCode.value,
      devicename: searchName.value,
      devicecode: searchCode.value,
      query_parameter: searchAll.value,
    }
  );
  produceList.value = data.data.sort((a: any, b: any) => {
    if (a.id > b.id) {
      return -1;
    }
    return 1;
  });
}
onMounted(() => {
  getProduce();
});
function filter() {
  getProduce();
}
function resetFilter() {
  searchProjectCode.value = "";
  searchName.value = "";
  searchCode.value = "";
  searchAll.value = "";
  getProduce();
}
registerAllModules();

let data = ref(
  Array(5)
    .fill(0)
    .map(() => ["", "", "", "", "", "", "", "", "", "", ""])
);
let hotSettings = ref({
  rowHeaders: true,
  colHeaders: [
    "存货编码",
    "名称",
    "规格",
    "品牌",
    "材质",
    "表面处理",
    "单台数量",
    "总数量",
    "单位",
    "备注",
    "其他",
  ],
  height: "auto",
  minSpareRows: 5,
  stretchH: "all",
  licenseKey: "non-commercial-and-evaluation",
  trimWhitespace: true,
});
//复制数据的属性名
let headers = ref<any[]>([
  "inventory_code",
  "product_name",
  "specification_drawing_number",
  "brand",
  "material",
  "surface_treatment",
  "quantity_per_unit",
  "total_quantity",
  "unit",
  "remarks",
  "other_info",
]);
let projectCode = ref<any>("");
let name = ref<any>("");
let code = ref<any>("");

async function confirmData() {
  if (projectCode.value === "") {
    return setSnackbar("black", "请您输入项目号");
  }
  if (name.value === "") {
    return setSnackbar("black", "请您输入设备名称");
  }
  if (code.value === "") {
    return setSnackbar("black", "请您输入设备编码,若设备编码为空请你输入T0000");
  }

  const exportedData = data.value
    .map((row) => {
      let obj: any = {};
      headers.value.forEach((header, index) => {
        obj[header] = row[index] === "　" ? "" : row[index];
      });
      return obj;
    })
    .filter((item: any) =>
      Object.values(item).some((item_: any) => (item_ || "").trim() !== "")
    );

  const tabArr: any = [];
  for (const [index, item] of exportedData.entries()) {
    if (item.inventory_code === "" || item.inventory_code === null) {
      return setSnackbar("black", "第" + (index + 1) + "行存货编码不能为空");
    }
    if (item.product_name === "" || item.product_name === null) {
      return setSnackbar("black", "第" + (index + 1) + "行名称不能为空");
    }
    if (
      item.specification_drawing_number === "" ||
      item.specification_drawing_number === null
    ) {
      return setSnackbar("black", "第" + (index + 1) + "行规格/图号不能为空");
    }
    if (item.total_quantity === "" || item.total_quantity === null) {
      return setSnackbar("black", "第" + (index + 1) + "行总数量不能为空");
    }
    if (item.unit === "" || item.unit === null) {
      return setSnackbar("black", "第" + (index + 1) + "行单位不能为空");
    }
    tabArr.push({
      project_code: projectCode.value,
      devicename: name.value,
      devicecode: code.value,
      inventory_code: item.inventory_code,
      product_name: item.product_name,
      specification_drawing_number: item.specification_drawing_number,
      brand: item.brand,
      material: item.material,
      surface_treatment: item.surface_treatment,
      quantity_per_unit: item.quantity_per_unit,
      total_quantity: item.total_quantity,
      unit: item.unit,
      remarks: item.remarks,
      other_info: item.other_info,
    });
  }

  const newData: any = await useHttp(
    "/PackingList/M103AddProcuredOrder",
    "post",
    tabArr
  );
  if (newData.code === 200) {
    getProduce();
    setSnackbar("green", "新增成功");
  } else {
    setSnackbar("black", "新增失败");
  }
}
function clear() {
  data.value = Array(5)
    .fill(0)
    .map(() => ["", "", "", "", "", "", "", "", "", "", ""]);
}
//项目号的校验规则
const projectCodeRule: Array<(v: string) => boolean | string> = [
  (v) => !!v || "不能为空",
  (v) =>
    v.substring(0, 1) === "Z" ||
    v.substring(0, 1) === "F" ||
    v.substring(0, 1) === "J" ||
    v.substring(0, 1) === "A" ||
    v.substring(0, 1) === "Y" ||
    v.substring(0, 1) === "L" ||
    v.substring(0, 1) === "H" ||
    "第1位必须是Z/F/J/A/Y/L/H",
  (v) => /^[A-Z]+$/.test(v.substring(1, 2)) || "第2位必须大写字母",
  (v) => /^\d+$/.test(v.substring(2, 7)) || "第3位到第7位必须为数字",
  (v) => v.substring(7, 8) === "-" || "第8位必须为'-'字符",
  (v) => /^\d+$/.test(v.substring(8, 9)) || "第9位必须为数字",
  (v) => v.length === 9 || "长度必须为9位",
];

let info = ref<any>(null);
function showDelDialog(item: any) {
  info.value = { ...item };
  deleteDialog.value = true;
}
async function delSucces() {
  const data: any = await useHttp(
    "/PackingList/M105DelProcuredOrder",
    "delete",
    undefined,
    {
      id: [info.value.id],
    }
  );
  if (data.code === 200) {
    getProduce();
    deleteDialog.value = false;
    setSnackbar("green", "删除成功");
  } else {
    setSnackbar("black", "删除失败");
  }
}
</script>
