// Pinia 储存的数据，在浏览器刷新后会丢失，因此不建议使用 Pinia
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", () => {
  let name = ref<string>("");
  let age = ref<number>(18);

  return { name, age };
});
