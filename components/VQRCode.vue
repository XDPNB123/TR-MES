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

    image.style.width = "30%";

    image.src = qrCode?.toDataURL(`image__${index}/png`);

    // 图片确认渲染完毕后的回调
    image.onload = function () {
      if (index === 0) document.body.innerHTML = "";

      const div = document.createElement("div");
      div.innerText = item.text;
      div.style.fontSize = "12px";
      div.style.pageBreakAfter = "always";
      div.style.display = "flex";
      div.style.justifyContent = "center";
      div.style.alignItems = "center";
      div.style.flexDirection = "column-reverse";
      div.style.gap = "10px";
      div.appendChild(image);
      document.body.appendChild(div);

      if (index === props.data.length - 1) {
        window.print();
        window.location.reload();
      }
    };
  });
}
</script>

<template>
  <v-btn color="blue" @click="printQrCode()">打印</v-btn>
  <qrcode-vue
    v-for="(item, index) in props.data"
    :key="index"
    v-show="showQrCode"
    :value="item.value"
    :id="`__${index}`"
  ></qrcode-vue>
</template>
