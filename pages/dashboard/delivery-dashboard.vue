<template>
  <v-row>
    <v-col cols="6">
      <Bar
        :data="barChartData"
        :responsive="true"
        :maintainAspectRatio="false"
      />
    </v-col>
    <v-col cols="6">
      <Pie :data="chartData" :responsive="true" :maintainAspectRatio="false" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Pie, Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement, // 导入 PointElement
  BarElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
); // 注册 PointElement
// 定义饼图数据
let chartData = ref({
  labels: ["January", "February", "March"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: ["#f87979", "#7aa6f2", "#f2a27a"],
      data: [40, 20, 12],
    },
  ],
});
// 定义柱状图数据
let barChartData = ref({
  labels: ["January", "February", "March"],
  datasets: [
    {
      label: "Data Three",
      backgroundColor: ["#f87979", "#7aa6f2", "#f2a27a"],
      data: [50, 30, 20],
    },
  ],
});
</script>
