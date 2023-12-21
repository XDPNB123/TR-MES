<script setup lang="ts">
import printJS from "print-js";
import QrcodeVue from "qrcode.vue";
useSeoMeta({
  // 该页面的标题
  title: "班组信息",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "班组信息",
  // 该页面的描述
  description: "同日 MES 系统，班组信息",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，班组信息",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
const router = useRouter();
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
//控制弹框的属性
let addDialog = ref(false);
let editDialog = ref(false);
let deleteDialog = ref(false);
let addInfoDialog = ref(false);
let editInfoDialog = ref(false);
let deleteInfoDialog = ref(false);
//页面加载时获取数据
onMounted(() => {
  getWorkClass();
  getWorkClassInfo();
});
//班组信息操作
//班组信息表头
let workClassHeader = ref<any[]>([
  {
    title: "序号",
    align: "center",
    key: "id",
    sortable: false,
    filterable: true,
  },
  {
    title: "班组编号",
    align: "center",
    key: "worker_id",
    sortable: false,
    filterable: true,
  },
  {
    title: "班组名称",
    align: "center",
    key: "work_classname",
    sortable: false,
    filterable: true,
  },
  {
    title: "班组负责人",
    align: "center",
    key: "leader_name",
    sortable: false,
    filterable: true,
  },

  {
    title: "创建人",
    align: "center",
    key: "creator",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建时间",
    align: "center",
    key: "create_time",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新人",
    align: "center",
    key: "update_person",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新时间",
    align: "center",
    key: "update_time",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: true,
  },
]);
//表格当前页
let workClassPage = ref(1);
watch(workClassPage, () => {
  getWorkClass();
});
//数据库一共存储多少数据
let workClassPageCount = ref(0);
//班组信息数据
let workClassTableData = ref<any[]>([]);
//计算一共有的多少页
let workClassTablePageCount = computed(() => {
  return Math.ceil(workClassPageCount.value / 10);
});
//获取班组信息数据
async function getWorkClass() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M27GetWorkClass",
      "get",
      undefined,
      {
        worker_id: "",
        work_classname: workClassName.value,
        leader_name: workClassLeader.value,
        PageIndex: workClassPage.value,
        PageSize: 10,
        SortedBy: "id",
        SortType: 0,
      }
    );
    workClassTableData.value = formateDate(data.data.pageList);
    workClassPageCount.value = data.data.totalCount;
  } catch (error) {
    setSnackbar("black", "获取数据失败");
    console.log(error);
  }
}
//日期截取
function formateDate(data: any) {
  try {
    data.forEach((item: any, index: number) => {
      if (item.create_time) {
        item.create_time = item.create_time.substring(0, 10);
      }
      if (item.update_time) {
        item.update_time = item.update_time.substring(0, 10);
      }
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

//点击获取当前班组的成员信息
let workerId = ref("");
function showInfo(item: any, obj: any) {
  workerId.value = obj.item.raw.worker_id;
}
//班组对象
let workClass = ref<any>({
  worker_id: "",
  work_classname: "",
  leader_name: "",
});
//搜索操作
let workClassName = ref("");
let workClassLeader = ref("");
//查询
function searchWorkClass() {
  getWorkClass();
}
//重置查询
function resetWorkClass() {
  workClassName.value = "";
  workClassLeader.value = "";
  workerId.value = "";
  getWorkClass();
}
//通过改变workerId的值来改变右边表的数据
watch(workerId, () => {
  getWorkClassInfo();
});
//新增班组信息
//新增前清空文本
function showAddDialog() {
  workClass.value = {
    worker_id: "",
    work_classname: "",
    leader_name: "",
  };
  addDialog.value = true;
}
//确认新增
async function addWorkClass() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M28AddWorkClass",
      "post",
      workClass.value
    );
    getWorkClass();

    if (data.code === 200) {
      setSnackbar("green", "新增成功");
    } else {
      setSnackbar("black", "新增失败");
    }
  } catch (error) {
    console.log(error);
    setSnackbar("black", "新增失败");
  }
  addDialog.value = false;
}
//修改班组信息
async function editWorkClass() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M29UpdateWorkClass",
      "put",
      workClass.value
    );
    getWorkClass();

    if (data.code === 200) {
      setSnackbar("green", "修改成功");
    } else {
      setSnackbar("black", "修改失败");
    }
  } catch (error) {
    setSnackbar("black", "修改失败");
    console.log(error);
  }
  editDialog.value = false;
}
//删除班组信息
async function deleteWorkClass() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M30DeleteWorkClass",
      "delete",
      undefined,
      {
        ids: [workClass.value.id],
      }
    );
    getWorkClass();
    if (data.code === 200) {
      setSnackbar("green", "删除成功");
    } else {
      setSnackbar("black", "删除失败");
    }
  } catch (error) {
    setSnackbar("black", "删除失败");
    console.log(error);
  }
  deleteDialog.value = false;
}

//班组成员操作
//班组成员信息表头
let workClassInfoHeader = ref<any[]>([
  {
    title: "序号",
    align: "center",
    key: "id",
    sortable: false,
    filterable: true,
  },
  {
    title: "员工编号",
    align: "center",
    key: "employee_id",
    sortable: false,
    filterable: true,
  },
  {
    title: "员工姓名",
    align: "center",
    key: "employee_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "工位",
    align: "center",
    key: "station",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建人",
    align: "center",
    key: "creator",
    sortable: false,
    filterable: true,
  },
  {
    title: "创建时间",
    align: "center",
    key: "create_time",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新人",
    align: "center",
    key: "update_person",
    sortable: false,
    filterable: true,
  },
  {
    title: "更新时间",
    align: "center",
    key: "update_time",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: true,
  },
]);
//班组成员信息数据
let workClassInfoTableData = ref<any[]>([]);

async function getWorkClassInfo() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M31GetWorkClassInfo",
      "get",
      undefined,
      {
        employee_id: employeeId.value,
        employee_name: employeeName.value,
        worker_id: workerId.value,
        PageIndex: 1,
        PageSize: 10000,
        SortedBy: "id",
        SortType: 0,
      }
    );
    workClassInfoTableData.value = formateDate(data.data.pageList);
  } catch (error) {
    setSnackbar("black", "获取数据失败");
    console.log(error);
  }
}

//班组成员数据
let workClassInfo = ref<any>({
  station: "",
  worker_id: "",
  employee_name: "",
  employee_id: "",
});
//班组成员搜素
let employeeId = ref("");
let employeeName = ref("");
//查询
function searchWorkClassInfo() {
  getWorkClassInfo();
}
//重置查询
function resetWorkClassInfo() {
  employeeId.value = "";
  employeeName.value = "";
  getWorkClassInfo();
}
//新增班组成员前重置文本
function showAddInfoDialog() {
  workClassInfo.value = {
    station: "",
    worker_id: workerId.value,
    employee_name: "",
    employee_id: "",
  };
  addInfoDialog.value = true;
}
//确定新增
async function addWorkClassInfo() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M32AddWorkClassInfo",
      "post",
      workClassInfo.value
    );
    getWorkClassInfo();
    if (data.code === 200) {
      setSnackbar("green", "新增成功");
    } else {
      setSnackbar("black", "新增失败");
    }
  } catch (error) {
    setSnackbar("black", "新增失败");
    console.log(error);
  }
  addInfoDialog.value = false;
}
//修改员工信息
async function editWorkClassInfo() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M33UpdateWorkClassInfo",
      "put",
      workClassInfo.value
    );
    getWorkClassInfo();
    if (data.code === 200) {
      setSnackbar("green", "修改成功");
    } else {
      setSnackbar("black", "修改失败");
    }
  } catch (error) {
    setSnackbar("black", "修改失败");
    console.log(error);
  }
  editInfoDialog.value = false;
}
//删除员工信息
async function deleteWorkClassInfo() {
  try {
    const data: any = await useHttp(
      "/MesWorkClassInfo/M34DeleteWorkClassInfo",
      "delete",
      undefined,
      {
        ids: [workClassInfo.value.id],
      }
    );
    getWorkClassInfo();
    if (data.code === 200) {
      setSnackbar("green", "删除成功");
    } else {
      setSnackbar("black", "删除失败");
    }
  } catch (error) {
    setSnackbar("black", "删除失败");
    console.log(error);
  }
  deleteInfoDialog.value = false;
}
//打印员工信息
let selected = ref<any[]>([]);
let printList = ref<any[]>([]);

async function print() {
  await selected.value.forEach((item: any) => {
    if (
      item.employee_id.charAt(0) !== "l" &&
      item.employee_id.charAt(0) !== "L"
    ) {
      printList.value.push({
        id: "WNM-" + item.employee_id.substring(1) + "-" + item.employee_name,
        name: item.employee_id.substring(1) + "-" + item.employee_name,
      });
    } else {
      printList.value.push({
        id: "LSG-" + item.employee_id.substring(1) + "-" + item.employee_name,
        name: item.employee_id.substring(1) + "-" + item.employee_name,
      });
    }
  });
  printJS({
    printable: "printContent",
    type: "html",
    targetStyles: ["*"],
  });
  selected.value = [];
  printList.value = [];
}
</script>
<template>
  <v-row class="ma-2">
    <!-- 左边数据 -->
    <v-col cols="6">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">班组信息</v-toolbar>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-text-field
              label="班组名称"
              variant="outlined"
              density="compact"
              v-model="workClassName"
              @keydown.enter="searchWorkClass"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="班组负责人"
              variant="outlined"
              density="compact"
              v-model="workClassLeader"
              @keydown.enter="searchWorkClass"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="searchWorkClass"
              >查询</v-btn
            >
            <v-btn
              color="red"
              class="mr-2"
              size="large"
              @click="resetWorkClass"
            >
              重置查询
            </v-btn>
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="showAddDialog"
              v-permission="`${router.currentRoute.value.fullPath}->addClass`"
            >
              新增班组
            </v-btn>
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
            <v-data-table
              hover
              :items-per-page="10"
              :headers="workClassHeader"
              :items="workClassTableData"
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              height="610"
              no-data-text="没有找到符合的数据"
              @click:row="showInfo"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="
                    workClass = { ...item.raw };
                    editDialog = true;
                  "
                  v-permission="
                    `${router.currentRoute.value.fullPath}->updateClass`
                  "
                >
                  fa-solid fa-pen
                </v-icon>

                <v-icon
                  color="red"
                  size="small"
                  @click.stop="
                    workClass = { ...item.raw };
                    deleteDialog = true;
                  "
                  v-permission="
                    `${router.currentRoute.value.fullPath}->deleteClass`
                  "
                >
                  fa-solid fa-trash
                </v-icon>
              </template>

              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination
                    v-model="workClassPage"
                    :length="workClassTablePageCount"
                  ></v-pagination>
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- 右边数据 -->
    <v-col cols="6">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">班组{{ workerId }}成员</v-toolbar>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-text-field
              label="员工编号"
              variant="outlined"
              density="compact"
              v-model="employeeId"
              @keydown.enter="searchWorkClassInfo"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="员工姓名"
              variant="outlined"
              density="compact"
              v-model="employeeName"
              @keydown.enter="searchWorkClassInfo"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="searchWorkClassInfo"
              >查询</v-btn
            >
            <v-btn
              color="red"
              class="mr-2"
              size="large"
              @click="resetWorkClassInfo"
            >
              重置查询
            </v-btn>
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="showAddInfoDialog"
              v-if="workerId"
              v-permission="
                `${router.currentRoute.value.fullPath}->addClassPerson`
              "
            >
              新增成员
            </v-btn>
            <v-btn
              color="blue-darken-2"
              class="mr-2"
              size="large"
              @click="print"
            >
              打印
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
            <!-- 工单表头表格 -->
            <v-data-table
              hover
              :items-per-page="10"
              :headers="workClassInfoHeader"
              :items="workClassInfoTableData"
              v-model="selected"
              show-select
              return-object
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              height="610"
              no-data-text="没有找到符合的数据"
            >
              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click.stop="
                    workClassInfo = { ...item.raw };
                    editInfoDialog = true;
                  "
                  v-permission="
                    `${router.currentRoute.value.fullPath}->updateClassPerson`
                  "
                >
                  fa-solid fa-pen
                </v-icon>

                <v-icon
                  color="red"
                  size="small"
                  @click.stop="
                    workClassInfo = { ...item.raw };
                    deleteInfoDialog = true;
                  "
                  v-permission="
                    `${router.currentRoute.value.fullPath}->deleteClassPerson`
                  "
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12" v-show="false">
            <div id="printContent">
              <div
                v-for="(item, index) in printList"
                :key="index"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                "
              >
                <div>
                  <qrcode-vue
                    style="width: 70px; height: 70px"
                    :value="item.id"
                  ></qrcode-vue>
                </div>
                <div class="text-text-subtitle-1">姓名:{{ item.name }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <!-- 新增班组信息 -->
  <v-dialog v-model="addDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增班组信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-text-field
          label="班组编号"
          v-model="workClass.worker_id"
        ></v-text-field>
        <v-text-field
          label="班组名称"
          v-model="workClass.work_classname"
        ></v-text-field>
        <v-text-field
          label="班组负责人"
          v-model="workClass.leader_name"
        ></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="addWorkClass"
        >
          确认添加
        </v-btn>
        <v-btn color="grey" size="large" @click="addDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改班组信息 -->
  <v-dialog v-model="editDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 修改班组信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-text-field
          label="班组编号"
          v-model="workClass.worker_id"
        ></v-text-field>
        <v-text-field
          label="班组名称"
          v-model="workClass.work_classname"
        ></v-text-field>
        <v-text-field
          label="班组负责人"
          v-model="workClass.leader_name"
        ></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="editWorkClass"
        >
          确认修改
        </v-btn>
        <v-btn color="grey" size="large" @click="editDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除班组信息 -->
  <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 删除班组信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="deleteDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4 text-center text-red text-h6">
        你确定要删除班组编号为"{{ workClass.worker_id }}"这条数据吗？
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="deleteWorkClass"
        >
          确认删除
        </v-btn>
        <v-btn color="grey" size="large" @click="deleteDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 新增班组成员信息 -->
  <v-dialog v-model="addInfoDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 新增班组成员信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addInfoDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-text-field
          label="工位"
          v-model="workClassInfo.station"
        ></v-text-field>
        <v-text-field
          label="员工名称"
          v-model="workClassInfo.employee_name"
        ></v-text-field>
        <v-text-field
          label="成员编号"
          v-model="workClassInfo.employee_id"
        ></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="addWorkClassInfo"
        >
          确认添加
        </v-btn>
        <v-btn color="grey" size="large" @click="addInfoDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 修改班组成员信息 -->
  <v-dialog v-model="editInfoDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 修改班组成员信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editInfoDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-text-field
          label="工位"
          v-model="workClassInfo.station"
        ></v-text-field>
        <v-text-field
          label="班组编号"
          v-model="workClassInfo.worker_id"
        ></v-text-field>
        <v-text-field
          label="员工名称"
          v-model="workClassInfo.employee_name"
        ></v-text-field>
        <v-text-field
          label="成员编号"
          v-model="workClassInfo.employee_id"
        ></v-text-field>
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="editWorkClassInfo"
        >
          确认修改
        </v-btn>
        <v-btn color="grey" size="large" @click="editInfoDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <!-- 删除班组成员信息 -->
  <v-dialog v-model="deleteInfoDialog" min-width="400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 删除成员信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="deleteInfoDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4 text-center text-red text-h6">
        你确定要删除名称为"{{ workClassInfo.employee_name }}"这位员工的数据吗？
      </v-card-text>

      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn
          color="blue-darken-2"
          size="large"
          class="mr-2"
          @click="deleteWorkClassInfo"
        >
          确认删除
        </v-btn>
        <v-btn color="grey" size="large" @click="deleteInfoDialog = false">
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
