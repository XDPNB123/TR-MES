<template>
  <div>
    <div v-for="(item, index) in treeData" :key="index">
      <input
        type="checkbox"
        :value="item.permission_id"
        v-model="checkedValues"
        @change="handleCheckChange(item, $event)"
      />
      {{ item.permission_title }}
      <div v-if="item.children" style="margin-left: 15px">
        <tree-view :tree-data="item.children" :checked-values="checkedValues" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from "vue";

interface TreeNode {
  permission_id: string;
  permission_title: string;
  children?: TreeNode[];
}

export default defineComponent({
  name: "TreeView",
  props: {
    treeData: {
      type: Array as PropType<TreeNode[]>,
      required: true,
    },
    checkedValues: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      expanded: props.treeData.map(() => false),
      checkedValues: [...props.checkedValues], // create a local copy of checkedValues
    });

    function toggleExpand(index: number) {
      state.expanded[index] = !state.expanded[index];
    }

    function handleCheckChange(item: TreeNode, event: Event) {
      const isChecked = (event.target as HTMLInputElement).checked;
      console.log(111);
      // Check/uncheck current item
      const currentIndex = state.checkedValues.indexOf(item.permission_id);
      if (isChecked && currentIndex === -1) {
        state.checkedValues.push(item.permission_id);
        console.log(123);
      } else if (!isChecked && currentIndex !== -1) {
        state.checkedValues.splice(currentIndex, 1);
      }

      // Check/uncheck all children
      if (item.children) {
        item.children.forEach((child) => {
          const index = state.checkedValues.indexOf(child.permission_id);
          if (isChecked && index === -1) {
            state.checkedValues.push(child.permission_id);
          } else if (!isChecked && index !== -1) {
            state.checkedValues.splice(index, 1);
          }
        });
      }

      // Check/uncheck all parents
      let parent = findParent(props.treeData, item);
      while (parent) {
        const index = state.checkedValues.indexOf(parent.permission_id);
        if (isChecked && index === -1) {
          state.checkedValues.push(parent.permission_id);
        } else if (!isChecked && index !== -1) {
          state.checkedValues.splice(index, 1);
        }
        parent = findParent(props.treeData, parent);
      }
    }

    function findParent(nodes: TreeNode[], child: TreeNode): TreeNode | null {
      for (const node of nodes) {
        if (node.children && node.children.includes(child)) {
          return node;
        } else if (node.children) {
          const found = findParent(node.children, child);
          if (found) {
            return found;
          }
        }
      }
      return null;
    }

    return {
      ...toRefs(state),
      toggleExpand,
      handleCheckChange,
    };
  },
  components: {
    "tree-view": () => import("./TreeView.vue"), // import self for recursive component
  },
});
</script>
