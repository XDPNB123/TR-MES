<script setup lang="ts">
useSeoMeta({
  // 该页面的标题
  title: "库位管理",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "库位管理",
  // 该页面的描述
  description: "同日 MES 系统，库位管理",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，库位管理",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
const router = useRouter();
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
//搜索绑定
let searchWarehouse = ref<any>(null);
let searchPlaceCode = ref<any>(null);
let searchPlaceDesc = ref<any>(null);
let searchAreaCode = ref<any>(null);
let searchContainer = ref<any>(null);
let searchDefaultSku = ref<any>(null);
let searchFlag = ref<any>(null);
let searchIsEmpty = ref<any>(null);
let searchOccupy = ref<any>(null);
let searchPlaceType = ref<any>(null);
let searchDisable = ref<any>(null);
//表头
let headers = ref<any[]>([
  {
    title: "仓库号",
    align: "center",
    key: "warehouse",
    sortable: false,
    filterable: true,
  },
  {
    title: "库位类型",
    align: "center",
    key: "place_type",
    sortable: false,
    filterable: true,
  },
  {
    title: "库位号",
    align: "center",
    key: "place_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "库位名称",
    align: "center",
    key: "place_desc",
    sortable: false,
    filterable: true,
  },
  {
    title: "库区号",
    align: "center",
    key: "area_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "容器号",
    align: "center",
    key: "container_id",
    sortable: false,
    filterable: true,
  },
  {
    title: "占用单据号",
    align: "center",
    key: "occupy_order",
    sortable: false,
    filterable: true,
  },
  {
    title: "默认物料",
    align: "center",
    key: "default_sku",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否为空Y/N",
    align: "center",
    key: "is_empty",
    sortable: false,
    filterable: true,
  },
  {
    title: "是否有任务",
    align: "center",
    key: "flag_has_task",
    sortable: false,
    filterable: true,
  },
  {
    title: "禁用",
    align: "center",
    key: "disable",
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
//多选内容
let selected = ref<any[]>([]);
let wareHouseList = ref<any[]>([]);
//获取数据库内的数据
async function getWareHouseDate() {
  const data: any = await useHttp("/wmsPlace/G100placeid", "get", undefined, {
    place_id: "",
    warehouse: searchWarehouse.value,
    place_code: searchPlaceCode.value,
    place_desc: searchPlaceDesc.value,
    area_code: searchAreaCode.value,
    container_id: searchContainer.value,
    is_empty:
      searchIsEmpty.value === "是"
        ? "Y"
        : searchIsEmpty.value === "否"
        ? "N"
        : "",
    flag_has_task:
      searchFlag.value === "是" ? "Y" : searchFlag.value === "否" ? "N" : "",
    default_sku: searchDefaultSku.value,
    occupy_order: searchOccupy.value,
    place_type: searchPlaceType.value,
    disable:
      searchDisable.value === "是"
        ? true
        : searchDisable.value === "否"
        ? "false"
        : "",
  });
  wareHouseList.value = data.data.map((item: any) => {
    item.is_empty = item.is_empty === "Y" ? "是" : "否";
    item.flag_has_task = item.flag_has_task === "Y" ? "是" : "否";
    item.disable = item.disable === false ? "否" : "是";
    return item;
  });
}
//页面加载时,获取数据
onMounted(() => {
  getWareHouseDate();
});
//搜索
function filter() {
  getWareHouseDate();
}
//重置搜素
function resetFilter() {
  searchWarehouse.value = "";
  searchPlaceCode.value = "";
  searchPlaceDesc.value = "";
  searchAreaCode.value = "";
  searchContainer.value = "";
  searchDefaultSku.value = "";
  searchFlag.value = "";
  searchIsEmpty.value = "";
  searchOccupy.value = "";
  searchPlaceType.value = "";
  searchDisable.value = "";
  getWareHouseDate();
}
//控制弹出框
let addDialog = ref<boolean>(false);
let editDialog = ref<boolean>(false);
let delDialog = ref<boolean>(false);
//库位对象
let stationInfo = ref<any>(null);

//将字符串里面的文字转成-,并且个位的数字前面补0
function convertFormat(
  warehouse: string,
  areaCode: string,
  numRow: string,
  numColumn: string,
  numLayer: string
): string {
  return `${warehouse}-${areaCode.padStart(2, "0")}-${numRow.padStart(
    2,
    "0"
  )}-${numColumn.padStart(2, "0")}-${numLayer.padStart(2, "0")}`;
}

//打开新增弹框
function showAddDialog() {
  stationInfo.value = {
    num_cloumn: "",
    num_layer: "",
    num_row: "",
    height: 0,
    width: 0,
    lenth: 0,
    occupy_order: "",
    default_sku: "",
    flag_has_task: "",
    is_empty: "",
    container_id: "",
    area_code: "",
    place_desc: "",
    place_code: "",
    warehouse: "",
    max_weight: "",
    place_type: "",
    disable: false,
    reserved01: "",
    org_tag: "",
    reserved03: "",
    reserved02: "",
  };

  addDialog.value = true;
}
//点击写入名称
function importName() {
  stationInfo.value.place_desc =
    stationInfo.value.warehouse +
    "仓" +
    stationInfo.value.area_code +
    "区" +
    stationInfo.value.num_row +
    "排" +
    stationInfo.value.num_cloumn +
    "列" +
    stationInfo.value.num_layer +
    "层";
}
//确认新增
async function addSation() {
  const data: any = await useHttp("/wmsPlace/G102newone", "post", {
    num_cloumn: stationInfo.value.num_cloumn,
    num_layer: stationInfo.value.num_layer,
    num_row: stationInfo.value.num_row,
    height: stationInfo.value.height,
    width: stationInfo.value.width,
    lenth: stationInfo.value.lenth,
    occupy_order: "",
    default_sku: stationInfo.value.default_sku,
    flag_has_task: "N",
    is_empty: "Y",
    container_id: "",
    area_code: stationInfo.value.area_code,
    place_desc: stationInfo.value.place_desc,
    place_code: convertFormat(
      stationInfo.value.warehouse,
      stationInfo.value.area_code,
      stationInfo.value.num_row.toString(),
      stationInfo.value.num_cloumn.toString(),
      stationInfo.value.num_layer.toString()
    ),
    warehouse: stationInfo.value.warehouse,
    max_weight: 0,
    place_type: stationInfo.value.place_type,
    disable: false,
    reserved01: "",
    org_tag: "",
    reserved03: "",
    reserved02: "",
  });
  if (data.code === 200) {
    setSnackbar("blue", "新增成功");
    getWareHouseDate();
    addDialog.value = false;
  } else {
    return setSnackbar("black", "新增失败");
  }
}
//打开修改框
function showEditDialog(item: any) {
  stationInfo.value = { ...item };
  editDialog.value = true;
}
async function editSation() {
  const data: any = await useHttp("/wmsPlace/G103update", "put", {
    place_id: stationInfo.value.place_id,
    num_cloumn: stationInfo.value.num_cloumn,
    num_layer: stationInfo.value.num_layer,
    num_row: stationInfo.value.num_row,
    height: stationInfo.value.height,
    width: stationInfo.value.width,
    lenth: stationInfo.value.lengh,
    occupy_order: stationInfo.value.occupy_order,
    default_sku: stationInfo.value.default_sku,
    flag_has_task: stationInfo.value.flag_has_task === "是" ? "Y" : "N",
    is_empty: stationInfo.value.is_empty === "是" ? "Y" : "N",
    container_id: stationInfo.value.container_id,
    area_code: stationInfo.value.area_code,
    place_desc: stationInfo.value.place_desc,
    place_code: convertFormat(
      stationInfo.value.warehouse,
      stationInfo.value.area_code,
      stationInfo.value.num_row.toString(),
      stationInfo.value.num_cloumn.toString(),
      stationInfo.value.num_layer.toString()
    ),
    warehouse: stationInfo.value.warehouse,
    max_weight: stationInfo.value.max_weight,
    place_type: stationInfo.value.place_type,
    disable: stationInfo.value.disable === "是" ? true : false,
    reserved01: stationInfo.value.reserved01,
    org_tag: stationInfo.value.org_tag,
    reserved03: stationInfo.value.reserved03,
    reserved02: stationInfo.value.reserved02,
  });
  if (data.code === 200) {
    setSnackbar("blue", "修改成功");
    getWareHouseDate();
    editDialog.value = false;
  } else {
    return setSnackbar("black", "修改失败");
  }
}
//打开删除弹框
function showDelDialog(item: any) {
  stationInfo.value = { ...item };
  delDialog.value = true;
}
//确认删除
async function delSation() {
  const data: any = await useHttp("/wmsPlace/G104delete", "delete", undefined, {
    one: stationInfo.value.place_id,
  });
  if (data.code === 200) {
    setSnackbar("blue", "删除成功");
    getWareHouseDate();
    delDialog.value = false;
  } else {
    return setSnackbar("black", "修改失败");
  }
}
// 二维码实例
const qrCodeIns = ref<any>(null);
let dataCode = ref<any[]>([]);
//打印出二维码
function printCode() {
  if (!selected.value.length) {
    return setSnackbar("black", "请您选择需要打印的派工单");
  }
  selected.value.map((item: any) =>
    dataCode.value.push({
      value: item.place_code,
    })
  );
  nextTick(() => {
    qrCodeIns.value.printQrCode();
  });
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="2">
      <v-text-field
        label="库位号"
        v-model="searchPlaceCode"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="仓库名称"
        v-model="searchPlaceDesc"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="占用单据号"
        v-model="searchOccupy"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="库区号"
        v-model="searchAreaCode"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="容器号"
        v-model="searchContainer"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="默认物料"
        v-model="searchDefaultSku"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-select
        label="库位类型"
        v-model="searchPlaceType"
        :items="['平面库', '立体库', '临时库', '虚拟库']"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="2">
      <v-select
        label="仓库号"
        v-model="searchWarehouse"
        variant="outlined"
        density="compact"
        :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>

    <v-col cols="2">
      <v-select
        label="是否有任务"
        v-model="searchFlag"
        variant="outlined"
        :items="['是', '否']"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="2">
      <v-select
        label="是否为空"
        v-model="searchIsEmpty"
        :items="['是', '否']"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="2">
      <v-select
        label="是否禁用"
        v-model="searchDisable"
        :items="['是', '否']"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="filter"
        >搜索</v-btn
      >
      <v-btn color="red" class="mr-2 mt-2" size="default" @click="resetFilter"
        >重置搜索</v-btn
      >
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="showAddDialog"
        v-permission="`${router.currentRoute.value.fullPath}->addLocation`"
      >
        新增库位
      </v-btn>
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="printCode"
        v-permission="
          `${router.currentRoute.value.fullPath}->printCodeLocation`
        "
      >
        打印
      </v-btn>
      <VQRCode2 :data="dataCode" ref="qrCodeIns"></VQRCode2>
    </v-col>
    <v-col>
      <v-data-table
        hover
        :items-per-page="10"
        :headers="headers"
        :items="wareHouseList"
        v-model="selected"
        show-select
        return-object
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
      >
        <template v-slot:item.action="{ item }">
          <!-- 库位详情 -->
          <!-- <v-icon color="blue" size="small" class="mr-5">
            fa-solid fa-mattress-pillow
          </v-icon> -->
          <!-- 修改 -->
          <v-icon
            color="blue"
            size="small"
            class="mr-3"
            @click="showEditDialog(item.raw)"
            v-permission="`${router.currentRoute.value.fullPath}->editLocation`"
          >
            fa-solid fa-pen
          </v-icon>
          <!-- 删除 -->
          <v-icon
            color="red"
            size="small"
            @click="showDelDialog(item.raw)"
            v-permission="
              `${router.currentRoute.value.fullPath}->deleteLocation`
            "
          >
            fa-solid fa-trash
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <!-- 新增库位 -->
    <v-dialog v-model="addDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增库位 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-select
                label="仓库类型"
                v-model="stationInfo.place_type"
                :items="['平面库', '立体库', '临时库', '虚拟库']"
                clearable
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="默认物料"
                v-model="stationInfo.default_sku"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                label="仓库号"
                v-model="stationInfo.warehouse"
                :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="库区号"
                v-model="stationInfo.area_code"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                label="排"
                v-model="stationInfo.num_row"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="列"
                v-model="stationInfo.num_cloumn"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="层"
                v-model="stationInfo.num_layer"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="4">
              <v-text-field
                label="长"
                v-model="stationInfo.lenth"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="4"
              ><v-text-field
                label="宽"
                v-model="stationInfo.width"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="4"
              ><v-text-field
                label="高"
                v-model="stationInfo.height"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="12">
              <v-text-field
                label="库位名称"
                v-model="stationInfo.place_desc"
                clearable
                hide-details
                append-inner-icon="fa-solid fa-star"
                @click:append-inner="importName"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addSation()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="addDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改库位 -->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改库位 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-select
                label="仓库类型"
                v-model="stationInfo.place_type"
                clearable
                hide-details
                :items="['平面库', '立体库', '临时库', '虚拟库']"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="默认物料"
                v-model="stationInfo.default_sku"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                label="仓库号"
                v-model="stationInfo.warehouse"
                :items="['A', 'B', 'C', 'D', 'E', 'F', 'Z']"
                clearable
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="库区号"
                v-model="stationInfo.area_code"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                label="排"
                v-model="stationInfo.num_row"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="列"
                v-model="stationInfo.num_cloumn"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                label="层"
                v-model="stationInfo.num_layer"
                :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="4">
              <v-text-field
                label="长"
                v-model="stationInfo.lenth"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="4"
              ><v-text-field
                label="宽"
                v-model="stationInfo.width"
                clearable
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="4">
              <v-text-field
                label="高"
                v-model="stationInfo.height"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="库位名称"
                v-model="stationInfo.place_desc"
                clearable
                hide-details
                append-inner-icon="fa-solid fa-star"
                @click:append-inner="importName"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editSation()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="editDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除库位 -->
    <v-dialog v-model="delDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除库位 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="delDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要删除【{{ stationInfo.place_desc }}】这一库位吗?
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="delSation()"
          >
            确认
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
  </v-row>
</template>
