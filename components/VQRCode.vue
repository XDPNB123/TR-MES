<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

const props = defineProps<{
  data: any[];
}>();

const showQrCode = ref<boolean>(false);

function printQrCode() {
  props.data.forEach((item, index) => {
    const qrCode = document.getElementById(`__${index}`) as HTMLCanvasElement;
    const image = new Image();

    image.src = qrCode?.toDataURL(`image__${index}/png`);

    // 图片确认渲染完毕后的回调
    image.onload = function () {
      if (index === 0) document.body.innerHTML = "";

      document.write(`
   
      <div style="display: flex;">
  <div style="margin-right: 20px;"><img src="${image.src}" style="height:50px !important;"></div>
  <div style="display: flex; flex-direction: column; justify-content: space-between;
  border: 1px solid black;
  ">
    <div style="font-size:8px !important">项目号：${item.project}</div>
    <div style="font-size:8px !important">产出料：${item.mcode}</div>
    <div style="font-size:8px !important">工序：${item.produce}</div>
    <div style="font-size:8px !important">交付日期：${item.date}</div>
    <div style="font-size:8px !important">数量：${item.number}</div>
    <div style="font-size:8px !important">单位：${item.number}</div>
  </div>
</div> 
`);

      if (index === props.data.length - 1) {
        window.print();
        window.location.reload();
      }
    };
  });
}
// 将打印的函数暴漏给外部使用
defineExpose({ printQrCode });
</script>

<template>
  <v-btn v-show="showQrCode" color="blue" @click="printQrCode()"
    >保存并打印</v-btn
  >
  <qrcode-vue
    v-for="(item, index) in props.data"
    :key="index"
    v-show="showQrCode"
    :value="item.value"
    :id="`__${index}`"
  ></qrcode-vue>
</template>
