import vue3TreeOrg from "vue3-tree-org";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3TreeOrg);
});
