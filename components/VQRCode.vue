dd
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

<div
    style="
      display: flex;
      justify: start;
      flex-direction: column;
      page-break-before: always;
      padding: 0 18px;
    "
  >
  <div style="display: flex;justify:start">
    <img src="${image.src}" style="height: 50px"  />

    <div style=" 
      display: flex;
      justify: start;
      flex-direction: column;">
    <div style="font-family: 'KaiTi';font-size:18px">昆山同日工业自动化有限公司</div>
    <div style="font-family: 'KaiTi';text-align:center;">扫描此处获取派工单号</div>
  </div>
  </div>
  

    <div style="display: flex; justify-content: space-between;margin-bottom:10px">
      <div style="font-family: 'KaiTi';">项目号:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.project}
          </span>
      </div>
      <div style="font-family: 'KaiTi';">产出料:
        <span
          style="
            text-decoration: underline;
          "
          >
        ${item.mcode}
        </span>
      </div>
    </div>

    <div style="margin-bottom:10px;font-family: 'KaiTi';">交付日期:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.date}
          </span>
    </div>

    <div style="display: flex; justify-content: space-between;margin-bottom:10px">
      <div style="font-family: 'KaiTi';">工序:<span
              style="
                text-decoration: underline;
              "
              >
              ${item.produce}
              </span>
              </div>
      <div style="font-family: 'KaiTi';">数量:
        <span
              style="
                text-decoration: underline;
              "
              >
        ${item.number}
        </span>
        </div>
      <div style="font-family: 'KaiTi';">单位:
        <span
           style="
              text-decoration: underline;
              "
              >
        ${item.unit}
        </span>
        </div>
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
  <v-btn color="blue" v-show="showQrCode" @click="printQrCode()"
    >保存并打印</v-btn
  >
  <qrcode-vue
    v-for="(item, index) in props.data"
    v-show="showQrCode"
    :key="index"
    :value="item.value"
    :id="`__${index}`"
  ></qrcode-vue>
</template>
