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
      padding: 0 20px;
    "
  >
  
  <div style="display: flex;justify-content: space-between;padding-top:5px">
    
    <img src="${image.src}" style="height: 50px"  />

    <div style=" 
      display: flex;
      justify: start;
      flex-direction: column; margin-right:10px;margin-left:10px">
      <div style="font-family: 'KaiTi';font-size:14px">昆山同日派工单标识卡</div>

        <div style="font-family: 'KaiTi';text-align:center;">派工单号:<span
          style="
            text-decoration: underline;
          "
          > ${item.value}
          </span>
        </div>
        
    </div>
    
    <img src="${image.src}" style="height: 60px"  />
  
  </div>
  

   
      <div style="font-family: 'KaiTi';">项目号:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.project}
          </span>
      </div>
    
    
    <div style="font-family: 'KaiTi';margin-top:5px">产出料:
        <span
          style="
            text-decoration: underline;
          "
          >
        ${item.mcode}
        </span>
      </div>


    <div style="font-family: 'KaiTi';margin-top:5px">计划交付日期:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.date}
          </span>
    </div>

    <div style="display: flex; justify-content: space-between;margin-top:5px">
       
      <div style="font-family: 'KaiTi';">工作中心:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.centerName}
          </span>
      </div>
       
      <div style="font-family: 'KaiTi';">是否委外:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.outsource}
          </span>
      </div>

      </div>

    <div style="display: flex; justify-content: space-between;margin-top:5px">
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
