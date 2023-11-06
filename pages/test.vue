<script setup lang="ts">
import * as XLSX from "xlsx";

function handleFileUpload(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files && inputElement.files.length > 0) {
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      console.log(data); // 打印原始的二进制数据
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      console.log(parsedData); // 打印解析后的数据
    };
    reader.readAsBinaryString(file);
  }
}
</script>

<template>
  <v-file-input
    label="请选择上传的excel"
    id="fileInput"
    accept=".xlsx,xls"
    @change="handleFileUpload"
  ></v-file-input>
</template>
