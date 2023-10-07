import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", () => {
  const name = ref("xdp");
  const age = ref(18);
  const sex = ref("男");
  return { name, age, sex };
});
