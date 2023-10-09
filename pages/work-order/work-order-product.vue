<template>
  <v-card>
    <v-row class="ma-2">
      <v-col cols="6">
        <v-text-field
          label="工单编号"
          variant="outlined"
          density="compact"
          v-model="searchTicketNumber"
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          label="工单类型"
          variant="outlined"
          density="compact"
          v-model="searchTicketType"
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          label="项目号"
          variant="outlined"
          density="compact"
          v-model="searchProjectNumber"
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          label="产出料"
          variant="outlined"
          density="compact"
          v-model="searchOutputs"
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-btn
          color="black"
          class="mr-2"
          size="large"
          @click="filterTableData()"
          >查询</v-btn
        >
        <v-btn color="red" class="mr-2" size="large" @click="resetFilter()">
          重置
        </v-btn>
        <v-btn
          color="green"
          class="mr-2"
          size="large"
          @click="resetAddDialog()"
        >
          新增
        </v-btn>
        <v-btn color="blue" class="mr-2" size="large">导出</v-btn>
      </v-col>

      <v-col cols="12">
        <v-divider></v-divider>
        <!-- 工单表头表格 -->
        <v-data-table
          v-model:page="tablePage"
          expand-on-click
          :headers="tableHeaders"
          :items="tableData"
          :items-per-page="tablePerPage"
          style="white-space: nowrap"
          @click:row="showTicketDetail"
          :expanded.sync="expandedRows"
        >
          <template v-slot:item.id="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.actions="{ item }">
            <!-- <v-icon color="orange" size="small" class="mr-3" @click.stop="">
              fa-solid fa-eye
            </v-icon> -->

            <v-icon
              color="blue"
              size="small"
              class="mr-3"
              @click.stop="
                operatingTicket = { ...item.raw };
                editDialog = true;
              "
            >
              fa-solid fa-pen
            </v-icon>

            <v-icon
              color="red"
              size="small"
              @click.stop="
                operatingTicket = { ...item.raw };
                deleteDialog = true;
              "
            >
              fa-solid fa-trash
            </v-icon>
          </template>
          <!-- 内嵌明细 -->
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <v-row class="mt-2 row-container">
                  <v-col cols="12">
                    <v-btn
                      color="green"
                      class="mr-2"
                      size="large"
                      @click="resetAddDetailDialog(item.raw.workorder_hid)"
                      >新增明细</v-btn
                    >

                    <v-btn
                      @click="batchWork(item.raw.workorder_hid)"
                      class="mr-2 bg-primary"
                      size="large"
                      >批量工序维护</v-btn
                    >
                  </v-col>
                  <v-col cols="12" class="mb-3">
                    <!-- 内置明细表格 -->
                    <v-data-table
                      v-model:page="tablePage"
                      :items-per-page="-1"
                      v-model="selected"
                      show-select
                      :key="key"
                      :headers="headers"
                      :items="details[item.raw.workorder_hid]"
                      class="elevation-12 font-size"
                    >
                      <template v-slot:item.actions="{ item }">
                        <v-icon
                          color="blue"
                          size="small"
                          class="mr-3"
                          @click="
                            operatingTicketDetail = { ...item.raw };
                            editDetailDialog = true;
                          "
                        >
                          fa-solid fa-pen
                        </v-icon>

                        <v-icon
                          color="red"
                          size="small"
                          @click="
                            operatingTicketDetail = { ...item.raw };
                            deleteDetailDialog = true;
                          "
                        >
                          fa-solid fa-trash
                        </v-icon>
                      </template>
                      <!-- 工序维护 -->
                      <!-- <template v-slot:item.procedure="{ item }">
                        <span
                          @click="
                            operatingTicketDetail = { ...item.raw };
                            showProcessDialog(item.raw.procedure);
                          "
                          >{{ item.raw.procedure }}</span
                        >
                      </template> -->
                      <template v-slot:item.BOMList="{ item }">
                        <span @click="handleBomClick(item.raw)">{{
                          item.raw.BOMList
                        }}</span>
                      </template>
                      <template v-slot:item.blueprint_id="{ item }">
                        <span @click="handleBlueprintClick(item.raw)">{{
                          item.raw.blueprint_id
                        }}</span>
                      </template>
                      <template v-slot:bottom></template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </template>
          <template v-slot:bottom>
            <div class="text-center pt-2">
              <v-pagination
                v-model="tablePage"
                :length="tablePageCount"
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- 新增工单表头 -->
    <v-dialog v-model="addDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicket.workorder_hid"
            label="工单编号"
          ></v-text-field>
          <v-select
            label="工单类型"
            :items="['装配', '机加工']"
            v-model="operatingTicket.workorder_type"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.product_id"
            label="产品编号"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.planned_quantity"
            label="计划数量"
          ></v-text-field>

          <v-select
            label="单位"
            :items="['个', '件', '套', '组', '盒', '对', '台']"
            v-model="operatingTicket.unit"
          ></v-select>
          <v-text-field
            label="开始日期"
            type="date"
            v-model="operatingTicket.start_date"
          />
          <v-text-field
            label="完成日期"
            type="date"
            v-model="operatingTicket.finish_date"
          ></v-text-field>
          <v-text-field
            label="计划完成日期"
            type="date"
            v-model="operatingTicket.planned_completion_time"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.status"
            label="工单状态"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="addTicket()">
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改工单 -->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicket.workorder_hid"
            label="工单编号"
          ></v-text-field>
          <v-select
            label="工单类型"
            :items="['装配', '机加工']"
            v-model="operatingTicket.workorder_type"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.product_id"
            label="产品编号"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.planned_quantity"
            label="计划数量"
          ></v-text-field>
          <v-select
            label="单位"
            :items="['个', '件', '套', '组', '盒', '对', '台']"
            v-model="operatingTicket.unit"
          ></v-select>
          <v-text-field
            v-model="operatingTicket.start_date"
            type="date"
            label="开始日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.finish_date"
            type="date"
            label="完成日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.planned_completion_time"
            type="date"
            label="计划完成日期"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicket.status"
            label="工单状态"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="editTicket()">
            确认修改
          </v-btn>
          <v-btn color="grey" size="large" @click="editDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除工单 -->
    <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4 text-center text-red text-h6">
          您确认要删除这条工单吗？

          <v-list>
            <v-list-item
              v-for="(value, key, index) in operatingTicket"
              :key="index"
            >
              <template #prepend> {{ getChineseKey(key) }}:</template>
              <template #append>
                {{ value }}
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <div class="d-flex justify-end mr-6 my-4">
          <v-btn color="red" size="large" class="mr-2" @click="deleteTicket()">
            确认删除
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 新增工单明细 -->
    <v-dialog v-model="addDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增工单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicketDetail.mcode"
            label="产出料"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.estimated_delivery_date"
            type="date"
            label="预计交付时间"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.blueprint_id"
            label="图纸号"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.project_code"
            label="项目号"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.workorder_did"
            label="工单明细编号"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.planned_quantity"
            label="计划数量"
          ></v-text-field>
          <v-select
            label="单位"
            :items="['个', '件', '套', '组', '盒', '对', '台']"
            v-model="operatingTicketDetail.unit"
          ></v-select>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue"
            size="large"
            class="mr-2"
            @click="addTicketDetail()"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除工单明细行 -->
    <v-dialog v-model="deleteDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除工单明细 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4 text-center text-red text-h6">
          您确认要删除这条工单明细吗？

          <v-list>
            <v-list-item
              v-for="(value, key, index) in operatingTicketDetail"
              :key="index"
            >
              <template #prepend> {{ getDetailChineseKey(key) }}:</template>
              <template #append>
                {{ value }}
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <div class="d-flex justify-end mr-6 my-4">
          <v-btn
            color="red"
            size="large"
            class="mr-2"
            @click="deleteTicketDetail()"
          >
            确认删除
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改工单明细行 -->
    <v-dialog v-model="editDetailDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改工单 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            v-model="operatingTicketDetail.mcode"
            label="产料"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.estimated_delivery_date"
            type="date"
            label="交付时间"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.blueprint_id"
            label="图纸号"
          ></v-text-field>

          <v-text-field
            v-model="operatingTicketDetail.project_code"
            label="项目号"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.standard_time"
            label="标准工时"
          ></v-text-field>
          <v-text-field
            v-model="operatingTicketDetail.planned_quantity"
            label="计划数量"
          ></v-text-field>
          <v-select
            label="单位"
            :items="['个', '件', '套', '组', '盒', '对', '台']"
            v-model="operatingTicketDetail.unit"
          ></v-select>
          <v-text-field
            v-model="operatingTicketDetail.status"
            label="状态"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue"
            size="large"
            class="mr-2"
            @click="editTicketDetail()"
          >
            确认修改
          </v-btn>
          <v-btn color="grey" size="large" @click="editDetailDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 工序维护弹框 -->
    <v-dialog v-model="processDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工序维护 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="processDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row class="ma-3">
          <v-col cols="1"></v-col>
          <v-col cols="6">
            <v-card class="h-60">
              <v-card-subtitle>已选工序</v-card-subtitle>
              <v-list @dragover.prevent @drop="drop">
                <v-list-item
                  class="ma-5"
                  v-for="(chip, index) in droppedChips"
                  :key="index"
                  color="primary"
                  text-color="white"
                  draggable="true"
                  v-if="droppedChips.length !== 0"
                  :title="chip.procedure_name"
                >
                  <template v-slot:prepend>
                    <v-badge color="red" overlap class="mr-4"> </v-badge
                  ></template>

                  <template v-slot:append>
                    <v-icon @click="removeChip(index)" size="small"
                      >fa-solid fa-xmark</v-icon
                    ></template
                  >
                </v-list-item>
                <v-list-item
                  v-else
                  subtitle="请选择工序"
                  class="mb-5"
                ></v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
          <v-col cols="3">
            <v-card flat>
              <v-card-subtitle>可选工序</v-card-subtitle>
              <div
                v-for="(chip, index) in chips"
                :key="index"
                draggable="true"
                @dragstart="dragStart(chip)"
                @dragend="dragEnd"
                v-if="chips.length !== 0"
              >
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
                  size="large"
                >
                  {{ chip.procedure_name }}
                </v-chip>
              </div>
              <v-chip v-else>已无可选择的工序</v-chip>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="blue" size="large" class="mr-2" @click="saveTicket()">
            保存工序
          </v-btn>
          <v-btn color="grey" size="large" @click="processDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
let expandedRows = ref([1]);
// 用于刷新视图的 key
let key = ref<number>(0);

//创建一个键值对数组，存储工单明细
let details = ref<any>({});
// 路由
const router = useRouter();
let selected = ref<any[]>([]);
// 工单新增、修改、删除对话框
let addDialog = ref(false);
let editDialog = ref(false);
let deleteDialog = ref(false);
let addDetailDialog = ref(false);
let deleteDetailDialog = ref(false);
let editDetailDialog = ref(false);

// 工单搜索
let searchTicketNumber = ref<string>("");
let searchProjectNumber = ref<string>("");
let searchTicketType = ref<string>("");
let searchOutputs = ref<string>("");
// 表格初始页
let tablePage = ref<number>(1);
// 表格每页条数
let tablePerPage = ref<number>(10);
// 正在操作的工单
let operatingTicket = ref<any>({
  workorder_hid: "",
  workorder_type: "",
  planned_completion_time: "",
  unit: "",
  planned_quantity: "",
  product_id: "",
  start_date: "",
  finish_date: "",
  status: "",
});

let keyToChinese = ref<any>({
  id: "序号",
  workorder_hid: "工单编号",
  workorder_type: "工单类型",
  unit: "单位",
  planned_quantity: "计划数量",
  product_id: "产品编号",
  start_date: "开始日期",
  finish_date: "完成日期",
  planned_completion_time: "计划完成时间",
  status: "工单状态",
});
let getChineseKey = (key: any) => keyToChinese.value[key] || key;
//正在操作的工单明细
let operatingTicketDetail = ref<any>({
  mcode: "",
  estimated_delivery_date: "",
  blueprint_id: "",
  project_code: "",
  standard_time: "",
  actual_time: "",
  procedure: "",
  planned_quantity: "",
  reported_quantity: "",
  unit: "",
  workorder_did: "",
  workorder_hid: "",
  actual_delivery_date: "",
});
let keyToDetailChinese = ref<any>({
  mcode: "产出料",
  estimated_delivery_date: "预计交付时间",
  blueprint_id: "图纸号",
  BOMList: "BOM清单",
  procedure: "工序",
  project_code: "项目号",
  standard_time: "标准工时",
  actual_time: "实际工时",
  planned_quantity: "计划数量",
  reported_quantity: "实际报工数量",
  unit: "单位",
  status: "状态",
  workorder_did: "工单明细编号",
  workorder_hid: "工单编号",
  actual_delivery_date: "实际交付时间",
});
let getDetailChineseKey = (key: any) => keyToDetailChinese.value[key] || key;
// 工单表头
let tableHeaders = ref<any[]>([
  {
    title: "序号",
    key: "id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工单编号",
    key: "workorder_hid",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "产品编号",
    key: "product_id",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工单类型",
    key: "workorder_type",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "计划数量",
    key: "planned_quantity",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "单位",
    key: "unit",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "开始日期",
    key: "start_date",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "完成日期",
    key: "finish_date",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "计划完成时间",
    key: "planned_completion_time",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "工单状态",
    key: "status",
    align: "center",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);

// 工单表
let tempTableData = ref<any[]>([]);

// 展示的工单表格数据
let tableData = ref<any[]>([]);

//工单明细表头
let headers = ref<any[]>([
  { title: "产出料", align: "start", key: "mcode" },
  { title: "交付时间", align: "start", key: "estimated_delivery_date" },
  { title: "实际交付时间", align: "start", key: "actual_delivery_date" },
  { title: "图纸号", align: "start", key: "blueprint_id" },
  { title: "BOM清单", align: "center", key: "bomdata" },
  { title: "工序", align: "start", key: "procedure" },
  { title: "工单明细编号", align: "start", key: "workorder_did" },
  { title: "项目号", align: "start", key: "project_code" },
  { title: "标准工时", align: "start", key: "standard_time" },
  { title: "实际工时", align: "start", key: "actual_time" },
  { title: "计划数量", align: "start", key: "planned_quantity" },
  { title: "实际报工数量", align: "start", key: "reported_quantity" },
  { title: "单位", align: "start", key: "unit" },
  { title: "状态", align: "start", key: "status" },
  {
    title: "操作",
    key: "actions",
    align: "center",
    sortable: false,
    filterable: false,
  },
]);
//工单明细全部数据
let tempTableDataDetail = ref<any[]>([]);

//工单明细表格展示的数据
let tableDataDetail = ref<any[]>([]);

// 表格有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableData.value.length / tablePerPage.value);
});

//工序模块
//拖拽功能
let processDialog = ref(false);
let chips = ref<any[]>([]);
let droppedChips = ref<any[]>([]);
let draggedChip = ref(null);
function dragStart(chip: any) {
  draggedChip.value = chip;
}
function dragEnd() {
  draggedChip.value = null;
}
function drop() {
  if (draggedChip.value) {
    droppedChips.value.push(draggedChip.value);
    chips.value = chips.value.filter((chip) => chip !== draggedChip.value);
  }
}
function removeChip(index: number) {
  const removedChip = droppedChips.value.splice(index, 1)[0];
  chips.value.push(removedChip);
}

let innerTableSelectData = ref<any[]>([]);

// 发请求获取完整的选中的数据
// 判断工序是否一致
// 如果一致，则将选中的数据暂时保存
// 打开对话框，将选中数据的工序显示左边，其他工序过滤到右边
// 点击保存，将左侧的工序拼接后，赋值给每一个暂存的对象
// 将对象数组作为参数调用更新接口重新获取数据

//批量工序维护
async function batchWork(workorder_hid: any) {
  //判断是否选择数据
  if (selected.value.length === 0) {
    alert("请选择需要工序维护的产料");
    return;
  }

  //获取到当前选择的数据
  let selectedData = await getWorkOrderDetail(workorder_hid);
  console.log(selectedData);
  innerTableSelectData.value = selectedData.filter((item) =>
    selected.value.includes(item.id)
  );

  console.log(innerTableSelectData.value);
  //判断选择的数据他们的工序是否一致
  let isSameProcedure = innerTableSelectData.value.every(
    (item, index, array) => {
      return item.procedure === array[0].procedure;
    }
  );
  if (isSameProcedure) {
    // 所有选中的数据都有相同的工序属性
    const data: any = await useHttp(
      "/MesWorkProcess/M09GetProcedureData",
      "get",
      undefined,
      {
        SortedBy: "id",
        PageIndex: 1,
        SortType: 0,
        procedure_name: "",
        procedure_id: "",
        PageSize: 5,
      }
    );
    chips.value = data.data;
    //过滤出已选工序和未选工序
    const workorderHids = innerTableSelectData.value[0].procedure.split(",");
    droppedChips.value = chips.value.filter((chip) =>
      workorderHids.includes(chip.procedure_name)
    );
    chips.value = chips.value.filter(
      (chip) => !workorderHids.includes(chip.procedure_name)
    );
    processDialog.value = true;
  } else {
    alert("您选择的数据的初始工序属性并不一致，请检查后重新选择");
    return;
  }
}
//工序维护
async function showProcessDialog(procedure: string) {
  const data: any = await useHttp(
    "/MesWorkProcess/M09GetProcedureData",
    "get",
    undefined,
    {
      SortedBy: "id",
      PageIndex: 1,
      SortType: 0,
      procedure_name: "",
      procedure_id: "",
      PageSize: 5,
    }
  );
  chips.value = data.data;
  //过滤出已选工序和未选工序
  const workorderHids = procedure.split(",");
  droppedChips.value = chips.value.filter((chip) =>
    workorderHids.includes(chip.procedure_name)
  );
  chips.value = chips.value.filter(
    (chip) => !workorderHids.includes(chip.procedure_name)
  );
  processDialog.value = true;
}

//保存工序
async function saveTicket() {
  if (droppedChips.value.length === 0) {
    alert("请你至少选择一个工序");
    return;
  }

  // 将选择的工序数组拼接成字符串
  innerTableSelectData.value.forEach((item) => {
    item.procedure = droppedChips.value
      .map((item) => item.procedure_name)
      .join(",");
  });

  await useHttp(
    "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
    "put",
    innerTableSelectData.value
  );

  console.log(innerTableSelectData.value);
  details.value[innerTableSelectData.value[0].workorder_hid] =
    await getWorkOrderDetail(innerTableSelectData.value[0].workorder_hid);

  processDialog.value = false;
}
// 搜索过滤
function filterTableData() {
  tableData.value = [...tempTableData.value];
  tableDataDetail.value = [...tempTableDataDetail.value];
  if (searchTicketNumber)
    tableData.value = tableData.value.filter((item) =>
      item.workorder_hid.includes(searchTicketNumber.value)
    );

  if (searchTicketType)
    tableData.value = tableData.value.filter((item) =>
      item.workorder_type.includes(searchTicketType.value)
    );

  if (searchProjectNumber)
    tableDataDetail.value = tableDataDetail.value.filter((item) =>
      item.project_code.includes(searchProjectNumber.value)
    );

  if (searchOutputs)
    tableDataDetail.value = tableDataDetail.value.filter((item) =>
      item.mcode.includes(searchOutputs.value)
    );
}

// 重置搜索
function resetFilter() {
  searchProjectNumber.value = "";
  searchTicketNumber.value = "";
  searchOutputs.value = "";
  searchTicketType.value = "";
  getWorkOrder();
  tableDataDetail.value = [...tempTableDataDetail.value];
}

onMounted(async () => {
  await getWorkOrder();
  // const rowToExpand = tableData.value.find(
  //   (row) => row.workorder_hid === "workorder001"
  // );
  // if (rowToExpand) {
  //   // 如果找到了，将这一行的标识添加到 expandedRows 数组中
  //   expandedRows.value.push(rowToExpand.id); // 假设每行数据有唯一的 id 属性
  //   console.log(rowToExpand.id);
  // }
});
//获取工单数据
async function getWorkOrder() {
  const data: any = await useHttp(
    "/MesWorkOrder/M01GetWorkOrderList",
    "get",
    undefined,
    {
      PageIndex: 1,
      PageSize: 20,
      SortType: 0,
      SortedBy: "id",
      workorder_hid: "",
      status: "",
      start_date: null,
      planned_quantity: null,
      product_id: null,
      planned_completion_time: null,
      workorder_type: "",
      finish_date: null,
    }
  );
  const newData = formatDate(data.data.pageList);
  tempTableData.value = newData;
  tableData.value = newData;
}
//将工单数据的日期进行截取，保留年月份
function formatDate(data: any) {
  data.forEach((item, index) => {
    item.start_date = item.start_date.substring(0, 10);
    item.finish_date = item.finish_date.substring(0, 10);
    item.planned_completion_time = item.planned_completion_time.substring(
      0,
      10
    );
  });
  return data;
}
//获取工单明细数据
async function getWorkOrderDetail(workorder_hid: string) {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M05WorkOrderDetails",
    "get",
    undefined,
    {
      PageIndex: 1,
      PageSize: 30,
      SortType: 0,
      SortedBy: "id",
      workorder_did: "",
      workorder_hid: workorder_hid,
      blueprint_id: "",
      mcode: "",
      planned_quantity: "",
      unit: "",
      procedure: "",
      project_code: "",
      reported_quantity: "",
      estimated_delivery_date: "",
      actual_delivery_date: "",
      actual_time: "",
      standard_time: "",
    }
  );
  return formatDateDetail(data.data.pageList);
}
//将工单明细数据的日期进行截取，保留年月份
function formatDateDetail(data: any) {
  data.forEach((item, index) => {
    item.estimated_delivery_date = item.estimated_delivery_date.substring(
      0,
      10
    );
    item.actual_delivery_date = item.actual_delivery_date.substring(0, 10);
  });
  return data;
}
//点击表单显示表单明细
async function showTicketDetail(item: any, obj: any) {
  details.value[obj.item.raw.workorder_hid] = await getWorkOrderDetail(
    obj.item.raw.workorder_hid
  );
}

// 新增工单前重置新增对话框
function resetAddDialog() {
  operatingTicket.value = {
    workorder_hid: "",
    workorder_type: "",
    product_id: "",
    start_date: "",
    finish_date: "",
    status: "",
  };
  addDialog.value = true;
}
// 新增工单
async function addTicket() {
  const data: any = await useHttp(
    "/MesWorkOrder/M02AddWorkOrder",
    "post",
    operatingTicket.value
  );
  getWorkOrder();
  addDialog.value = false;
}
// 新增工单明细前重置新增对话框
function resetAddDetailDialog(workorder_hid: any) {
  operatingTicketDetail.value = {
    mcode: "",
    estimated_delivery_date: "",
    blueprint_id: "",
    project_code: "",
    standard_time: "",
    actual_time: "",
    procedure: "123",
    planned_quantity: "",
    reported_quantity: "",
    unit: "",
    workorder_did: "",
    workorder_hid: workorder_hid,
    actual_delivery_date: null,
  };
  addDetailDialog.value = true;
  getWorkOrder();
}
//新增工单明细行
async function addTicketDetail() {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M06AddWorkOrderDetails",
    "post",
    [operatingTicketDetail.value]
  );
  details.value[operatingTicketDetail.value.workorder_hid] =
    await getWorkOrderDetail(operatingTicketDetail.value.workorder_hid);
  addDetailDialog.value = false;
}
// 修改工单
async function editTicket() {
  const data: any = await useHttp(
    "/MesWorkOrder/M03PartiallyUpdateWorkOrder",
    "put",
    operatingTicket.value
  );
  getWorkOrder();
  editDialog.value = false;
}
//修改工单明细行
async function editTicketDetail() {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M07UpdateWorkOrderDetail",
    "put",
    [operatingTicketDetail.value]
  );
  details.value[operatingTicketDetail.value.workorder_hid] =
    await getWorkOrderDetail(operatingTicketDetail.value.workorder_hid);
  editDetailDialog.value = false;
}
// 删除工单
async function deleteTicket() {
  const data: any = await useHttp(
    "/MesWorkOrder/M04DeleteWorkOrder",
    "delete",
    undefined,
    {
      workorder_ids: [operatingTicket.value.id],
    }
  );
  getWorkOrder();
  deleteDialog.value = false;
}

// 删除工单明细行
async function deleteTicketDetail() {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M08DeleteWorkOrderDetails",
    "delete",
    undefined,
    { workorderdetail_ids: [operatingTicketDetail.value.id] }
  );
  details.value[operatingTicketDetail.value.workorder_hid] =
    await getWorkOrderDetail(operatingTicketDetail.value.workorder_hid);
  deleteDetailDialog.value = false;
}

//查看图纸
function handleBlueprintClick(item: any) {
  console.log(item.blueprint_id); // 查看图纸
}
//bom清单维护
function handleBomClick(item: any) {
  router.push({ path: "/ticketDetails/bom-maintenance" });
}
</script>
<style scoped>
.font-size {
  font-size: small;
  white-space: nowrap;
  width: 100%;
  color: #1831d6;
}
.row-container {
  background-color: rgb(174, 182, 182);
}
.date-input {
  margin-bottom: 24px;
  color: grey;
  padding: 14px;
  border: none;
  border-bottom: 0.5px solid;
  width: 100%;
  background-color: #ebe9e9;
}
</style>
