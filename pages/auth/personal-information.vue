<!-- <script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "个人信息",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "个人信息",
  // 该页面的描述
  description: "同日 MES 系统，个人信息",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，个人信息",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 不采用布局
definePageMeta({
  layout: false,
});
onMounted(() => {
  // 页面初始动画
  useGsap.from(".initial-animation", {
    y: 100,
    opacity: 0,
    duration: 1,
  });
});
</script>

<template>
  <div class="initial-animation">这是个人信息页面</div>
</template> -->

<template>
  <div>
    <div class="print-area">
      <qrcode-vue :value="myData" id="qr-code"></qrcode-vue>
    </div>
    <v-btn @click="printQrCode">打印二维码</v-btn>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

const myData = ref("123");

function printQrCode() {
  const qrCode = document.getElementById("qr-code") as HTMLCanvasElement;
  const image = new Image();

  image.width = 100;
  image.height = 100;
  image.src = qrCode?.toDataURL("image/png");

  image.onload = function () {
    document.body.innerHTML = "";
    document.body.appendChild(image);
    window.print();
    window.location.reload();
  };
}

// await nextTick();

// let printContents = document.getElementById("printArea")?.innerHTML;

// let printFrame = document.getElementById("printFrame") as HTMLIFrameElement;
// let doc = printFrame.contentWindow?.document;
// doc?.open();
// doc?.write(`
//   <html>
//     <head>
//       <title>Print Page</title>
//     </head>
//     <body>
//       ${printContents}
//     </body>
//   </html>
// `);
// doc?.close();

// printFrame.contentWindow?.print();
</script>
