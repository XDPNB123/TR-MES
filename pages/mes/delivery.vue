<template>
  <div>
    <v-btn @click="openPrint()"> 打印 </v-btn>
    <v-btn @click="add"> 添加一页 </v-btn>

    <div class="d-flex justify-center h-100">
      <div id="printContent">
        <div
          style="
            width: 794px;
            height: 1123px;
            page-break-before: always;
            margin-top: 20px;
          "
          class="d-flex flex-column"
          v-for="(item_, index_) in newArray"
          :key="index_"
        >
          <div class="d-flex justify-space-around">
            <!-- 第一列-->
            <div>
              <div class="font-weight-bold">昆山同日工业自动化有限公司</div>
              <div class="font-weight-black" style="white-space: nowrap">
                Tungray Industrial Automation(KunShan)Co.,Ltd
              </div>
              <div class="text-subtitle-2">Http://www.tungray.com.cn</div>
              <div class="text-subtitle-2">E-mail:tungray@tungray.com.cn</div>
            </div>
            <!-- 第二列 -->
            <div class="d-flex flex-column text-h6">
              <div>地址：江苏昆山淀山</div>
              <div>湖镇丁家浜路3号</div>
              <div>电话：0512-36829026</div>
            </div>
          </div>
          <!-- 装箱单 -->
          <div class="d-flex justify-space-between">
            <div
              class="mt-2 align-self-center"
              style="border-top: 10px solid black; width: 43%"
            ></div>
            <div
              class="d-flex flex-column justify-center align-self-center"
              style="align-self: center"
            >
              <div style="align-self: center">
                <qrcode-vue
                  style="width: 60px; height: 60px"
                  value="WW771234"
                ></qrcode-vue>
              </div>

              <div style="font-weight: black; white-space: nowrap">
                装箱单:WW771234
              </div>
            </div>
            <div
              class="mt-2 align-self-center"
              style="border-top: 10px solid black; width: 44%"
            ></div>
          </div>
          <!-- 其他内容 -->
          <div class="d-flex justify-space-between">
            <!-- 第一列 -->
            <div class="d-flex flex-column">
              <!-- 第一列第一行 -->
              <div style="white-space: nowrap">
                Project No/项目号：<input
                  type="text"
                  style="
                    border: none;
                    border-bottom: 1px solid black;
                    outline: none;
                    text-align: center;
                  "
                />
              </div>
              <!-- 第一列第二行 -->
              <div class="d-flex justify-space-between mt-4">
                <div style="white-space: nowrap">
                  No:<input
                    type="text"
                    style="
                      border: none;
                      border-bottom: 1px solid black;
                      outline: none;
                      text-align: center;
                    "
                  />
                </div>
                <div style="white-space: nowrap">
                  共<input
                    type="text"
                    style="
                      border: none;
                      border-bottom: 1px solid black;
                      outline: none;
                      text-align: center;
                    "
                  />箱
                </div>
              </div>
              <!-- 第一列第三行 -->
              <div style="white-space: nowrap" class="mt-4">
                包装材料：
                <span style="padding-right: 80px"
                  >Case(木箱) <input type="checkbox"
                /></span>
                <span>Crate(板条箱) <input type="checkbox" /></span>
              </div>
            </div>

            <!-- 第二列 -->
            <div class="d-flex flex-column">
              <!-- 第二列第一行 -->
              <div style="white-space: nowrap">
                Date/日期：<input
                  type="text"
                  style="
                    border: none;
                    border-bottom: 1px solid black;
                    outline: none;
                    text-align: center;
                  "
                />
              </div>
              <!-- 第二列第二行 -->
              <div style="white-space: nowrap" class="mt-4">
                L/W/H(长/宽/高)/其他：<input
                  type="text"
                  style="
                    border: none;
                    border-bottom: 1px solid black;
                    outline: none;
                    text-align: center;
                  "
                />
              </div>
              <!-- 第二列第三行 -->
              <div style="white-space: nowrap" class="mt-4">
                <span style="padding-right: 80px"
                  >Carton(纸箱）<input type="checkbox"
                /></span>
                <span>其他 <input type="checkbox" /></span>
              </div>
            </div>
          </div>
          <div class="mt-4">装箱明细：</div>
          <!-- 表格 -->
          <div style="white-space: nowrap" class="mt-4">
            <table border="1" style="border-collapse: collapse">
              <tr>
                <th style="text-align: center; height: 30px">No</th>
                <th style="text-align: center; height: 30px">Production</th>
                <th style="text-align: center; height: 30px">
                  Model No/Item No
                </th>
                <th style="text-align: center; height: 30px">QTY</th>
                <th style="text-align: center; height: 30px">Rmks</th>
              </tr>
              <tr>
                <th style="text-align: center; height: 30px">序号</th>
                <th style="text-align: center; height: 30px">产品</th>
                <th style="text-align: center; height: 30px">产品规格及型号</th>
                <th style="text-align: center; height: 30px">数量</th>
                <th style="text-align: center; height: 30px">备注</th>
              </tr>
              <tr v-for="item in item_.group" :key="item.no">
                <td>
                  <input
                    type="text"
                    :value="item.no"
                    style="text-align: center; height: 30px; width: 80px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    :value="item.production"
                    style="text-align: center; height: 30px; width: 230px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    :value="item.model"
                    style="text-align: center; height: 30px; width: 180px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    :value="item.qty"
                    style="text-align: center; height: 30px; width: 80px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    :value="item.rmks"
                    style="text-align: center; height: 30px; width: 230px"
                  />
                </td>
              </tr>

              <tr
                v-for="index1 in 18 - item_.group.length"
                :key="index1 + 18 - item_.group.length"
              >
                <td>
                  <input
                    type="text"
                    style="text-align: center; height: 30px; width: 80px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style="text-align: center; height: 30px; width: 230px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style="text-align: center; height: 30px; width: 180px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style="text-align: center; height: 30px; width: 80px"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style="text-align: center; height: 30px; width: 230px"
                  />
                </td>
              </tr>
            </table>
          </div>
          <div class="mt-4">Your faithfuly:</div>
          <div class="font-weight-black mt-4" style="white-space: nowrap">
            Tungray Industrial Automation(KunShan)Co.,Ltd
          </div>
          <div class="mt-4">供应商：昆山同日工业自动化有限公司</div>
          <div class="d-flex justify-space-around mt-4">
            <div class="d-flex" style="white-space: nowrap">
              装箱员：<input
                type="text"
                style="
                  border: none;
                  border-bottom: 1px solid black;
                  outline: none;
                "
              />
            </div>
            <div class="d-flex" style="white-space: nowrap">
              复核员：<input
                type="text"
                style="
                  border: none;
                  border-bottom: 1px solid black;
                  outline: none;
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import printJS from "print-js";
import QrcodeVue from "qrcode.vue";
function openPrint() {
  printJS({
    printable: "printContent",
    type: "html",
    targetStyles: ["*"],
  });
}
function add() {
  newArray.value.push({ group });
}
const tableData = ref([
  { no: "1", production: "Prod1", model: "Model1", qty: "10", rmks: "Remark1" },
  { no: "2", production: "Prod2", model: "Model2", qty: "20", rmks: "Remark2" },
  { no: "3", production: "Prod3", model: "Model3", qty: "30", rmks: "Remark3" },
  { no: "4", production: "Prod4", model: "Model4", qty: "40", rmks: "Remark4" },
  { no: "5", production: "Prod5", model: "Model5", qty: "50", rmks: "Remark5" },
  { no: "6", production: "Prod6", model: "Model6", qty: "60", rmks: "Remark6" },
  { no: "7", production: "Prod7", model: "Model7", qty: "70", rmks: "Remark7" },
  { no: "8", production: "Prod8", model: "Model8", qty: "80", rmks: "Remark8" },
  { no: "9", production: "Prod9", model: "Model9", qty: "90", rmks: "Remark9" },
  {
    no: "10",
    production: "Prod10",
    model: "Model10",
    qty: "100",
    rmks: "Remark10",
  },
  {
    no: "11",
    production: "Prod11",
    model: "Model11",
    qty: "110",
    rmks: "Remark11",
  },
  {
    no: "12",
    production: "Prod12",
    model: "Model12",
    qty: "120",
    rmks: "Remark12",
  },
  {
    no: "13",
    production: "Prod13",
    model: "Model13",
    qty: "130",
    rmks: "Remark13",
  },
  {
    no: "14",
    production: "Prod14",
    model: "Model14",
    qty: "140",
    rmks: "Remark14",
  },
  {
    no: "15",
    production: "Prod15",
    model: "Model15",
    qty: "150",
    rmks: "Remark15",
  },
  {
    no: "16",
    production: "Prod16",
    model: "Model16",
    qty: "160",
    rmks: "Remark16",
  },
  {
    no: "17",
    production: "Prod17",
    model: "Model17",
    qty: "170",
    rmks: "Remark17",
  },
  {
    no: "18",
    production: "Prod18",
    model: "Model18",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "19",
    production: "Prod119",
    model: "Model19",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "20",
    production: "Prod120",
    model: "Model20",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
  {
    no: "21",
    production: "Prod21",
    model: "Model21",
    qty: "180",
    rmks: "Remark18",
  },
]);

let newArray = ref<any[]>([]);
let groupSize = 18;
let group = Array.from({ length: 18 }, () => ({}));
onMounted(() => {
  for (let i = 0; i < tableData.value.length; i += groupSize) {
    group = tableData.value.slice(i, i + groupSize);
    newArray.value.push({ group });
  }
  group = Array.from({ length: 18 }, () => ({}));
});
</script>
