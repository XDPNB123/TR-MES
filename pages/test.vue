<template>
  <Vtree
    :data="data"
    checkable
    v-model="value"
    titleField="name"
    keyField="id"
    :cascade="false"
  />
</template>

<script setup lang="ts">
import Vtree, { VTreeNode, VTreeSearch, VTreeDrop } from "@wsfe/vue-tree";
import "@wsfe/vue-tree/style.css";
const value = ref<any[]>([1, 3]);
const data = ref<any[]>([
  {
    id: 1,
    name: "节点1",
    checked: false,
    children: [
      {
        id: 2,
        name: "子节点1",
        checked: false,
        children: [
          {
            id: 3,
            name: "孙节点1",
            checked: false,
          },
          {
            id: 4,
            name: "孙节点2",
            checked: false,
          },
        ],
      },
      {
        id: 5,
        name: "子节点2",
        checked: false,
      },
    ],
  },
  {
    id: 7,
    name: "节点2",
    checked: false,
    children: [
      {
        id: 8,
        name: "子节点3",
        checked: false,
      },
      {
        id: 9,
        name: "子节点4",
        checked: false,
        children: [
          {
            id: 10,
            name: "孙节点3",
            checked: false,
          },
          {
            id: 11,
            name: "孙节点4",
            checked: false,
          },
        ],
      },
    ],
  },
]);
</script>
