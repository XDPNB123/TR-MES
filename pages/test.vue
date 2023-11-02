<script setup lang="ts">
let dataCode = ref<any[]>([
  {
    project: "123123",
    mcode: "固定架支板的脚手架的螺丝",
    produce: "打磨",
    date: "2023 - 10 - 11",
    number: 12,
    unit: "个",
    value: "123",
    centerName: "折弯车间3",
    outsource: "N",
    code: "88.216.1/PGD23110100005",
  },
  {
    project: "2312",
    mcode: "电脑",
    produce: "达摩尔",
    date: "2023 - 10 - 11",
    number: 12,
    unit: "个",
    value: "123",
    centerName: "折弯车间1",
    outsource: "N",
    code: "88.216.1/PGD23110100005",
  },
  {
    project: "2312",
    mcode: "电脑",
    produce: "达摩尔",
    date: "2023 - 10 - 11",
    number: 12,
    unit: "个",
    value: "123",
    centerName: "折弯车间2",
    outsource: "N",
    code: "88.216.1/PGD23110100005",
  },
]);
</script>
<template>
  <VQRCode :data="dataCode"></VQRCode>
</template>
