<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

const props = defineProps<{
  data: any[];
}>();

const showQrCode = ref<boolean>(false);

function printQrCode() {
  props.data.forEach((item, index) => {
    const qrCode1 = document.getElementById(`${index}1`) as HTMLCanvasElement;

    const image1 = new Image(); //库位二维码

    image1.src = qrCode1?.toDataURL(`image__${index}/png`);

    // 图片确认渲染完毕后的回调
    image1.onload = function () {
      if (index === 0) document.body.innerHTML = "";
      document.write(`

      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height:100%">
    <div>
        <img src="${image1.src}" style="height: 100px" />
    </div>
    <div style="font-size:18px; margin-top:5px">
        库位号:
        <span style="font-family: 'SongTi';margin-right:9px">
            ${item.value}
        </span>
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
    :id="`${index}1`"
  ></qrcode-vue>
</template>
