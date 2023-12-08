<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

const props = defineProps<{
  data: any[];
}>();

const showQrCode = ref<boolean>(false);

function printQrCode() {
  props.data.forEach((item, index) => {
    const qrCode1 = document.getElementById(`${index}1`) as HTMLCanvasElement;
    const qrCode2 = document.getElementById(`${index}2`) as HTMLCanvasElement;
    const image1 = new Image(); //派工单二维码
    const image2 = new Image(); //标识二维码

    image1.src = qrCode1?.toDataURL(`image__${index}/png`);
    image2.src = qrCode2?.toDataURL(`image2___${index}/png`);

    // 图片确认渲染完毕后的回调
    image1.onload = function () {
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
  
  <div style="display: flex;justify:start;padding-top:5px">
    <div style="margin-left:3px">
    <img src="${image2.src}" style="height: 55px"  />
    </div>
    <div style=" 
      display: flex;
      justify-content: space-between;
      flex-direction: column;">
      <div style="font-family: 'SongTi';font-size:15px;text-align:center">昆山同日派工标识卡</div>

      <div style="font-family: 'SongTi';text-align:center;font-size:14px">  
           ${item.value}
      </div>
      <div style="font-family: 'SongTi';font-size:12px;margin:0 10px;white-space: nowrap;">  
          ${item.code}
      </div>
        
    </div>
    <div style="padding-right:5px">
    <img src="${image1.src}" style="height: 55px"  />
   </div>
  </div>
  

  <div style="font-family: 'SongTi';margin-top:5px;font-size:12px; display: flex; align-items: center;">
  <span>产出料:</span>
  <div style="flex-grow: 1; border-bottom: 1px solid;text-align:center ">
    ${item.mcode}
  </div>
</div>

<div style="font-family: 'SongTi';margin-top:5px;font-size:12px; display: flex; align-items: center;">
  <span>工序:</span>
  <div style="flex-grow: 1; border-bottom: 1px solid;text-align:center ">
     ${item.produce}
  </div>
</div>

<div style="display: flex; justify-content: space-between;margin-top:5px">
      <div style="font-family: 'SongTi';font-size:12px">当前工序顺序:<span
          style="text-decoration: underline;">
          ${item.produce_order}
          </span>
        </div>

    <div style="font-family: 'SongTi';font-size:12px">是否委外:<span
          style="text-decoration: underline;">
          ${item.outsource}
          </span>
      </div> 
  </div>


  <div style="display: flex; justify-content: space-between;margin-top:5px">
        <div style="font-family: 'SongTi';font-size:12px">
          计划日期:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.date}
          </span> 
        </div>

        <div style="font-family: 'SongTi';font-size:12px">
          项目号:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.project}
          </span>
          
              </div>
  </div>

  

  <div style="display: flex; justify-content: space-between;margin-top:5px">
      <div style="font-family: 'SongTi';font-size:12px">工作中心:<span
          style="
            text-decoration: underline;
          "
          >
          ${item.centerName}
          </span>
      </div>
       
      <div style="font-family: 'SongTi';font-size:12px">数量:
        <span style=" text-decoration: underline;" >
        ${item.number}
        </span>
        </div>
      <div style="font-family: 'SongTi';font-size:12px">单位:
        <span style="text-decoration: underline;" >
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
    :id="`${index}1`"
  ></qrcode-vue>
  <qrcode-vue
    v-for="(item, index) in props.data"
    v-show="showQrCode"
    :key="index"
    :value="item.code"
    :id="`${index}2`"
  ></qrcode-vue>
</template>
