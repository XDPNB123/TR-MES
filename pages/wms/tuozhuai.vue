<template>
  <div class="row">
    <div class="col-4">
      <h3>First draggable with header</h3>

      <draggable
        id="first"
        data-source="juju"
        :list="list"
        class="list-group"
        draggable=".item"
        group="a"
      >
        <div
          class="list-group-item item"
          v-for="element in list"
          :key="element.name"
        >
          {{ element.name }}
        </div>

        <div
          slot="header"
          class="btn-group list-group-item"
          role="group"
          aria-label="Basic example"
        >
          <button class="btn btn-secondary" @click="add">Add</button>
          <button class="btn btn-secondary" @click="replace">Replace</button>
        </div>
      </draggable>
    </div>

    <div class="col-4">
      <h3>Second draggable with header</h3>

      <draggable :list="list2" class="list-group" draggable=".item" group="a">
        <div
          class="list-group-item item"
          v-for="element in list2"
          :key="element.name"
        >
          {{ element.name }}
        </div>

        <div
          slot="header"
          class="btn-group list-group-item"
          role="group"
          aria-label="Basic example"
        >
          <button class="btn btn-secondary" @click="add2">Add</button>
          <button class="btn btn-secondary" @click="replace2">Replace</button>
        </div>
      </draggable>
    </div>

    <rawDisplayer class="col-2" :value="list" title="List" />

    <rawDisplayer class="col-2" :value="list2" title="List2" />
  </div>
</template>

<script setup lang="ts">

let id = 1;
let name = ref("two-list-headerslots");
let display = ref("Two list header slot");
let order = ref(14);

let list = ref<any[]>([
  { name: "John 1", id: 0 },
  { name: "Joao 2", id: 1 },
  { name: "Jean 3", id: 2 },
]);
let list2 = ref<any[]>([
  { name: "Jonny 4", id: 3 },
  { name: "Guisepe 5", id: 4 },
]);

function add() {
  list.value.push({ name: "Juan " + id, id: id++ });
}
function replace() {
  list.value = [{ name: "Edgard", id: id++ }];
}
function add2() {
  list2.value.push({ name: "Juan " + id, id: id++ });
}
function replace2() {
  list2.value = [{ name: "Edgard", id: id++ }];
}
</script>
<style scoped></style>
