export default defineNuxtConfig({
  css: ["vuetify/styles"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt", "nuxt-lodash"],
  // 页面过渡效果，name 的值需要与 app.vue 中的 css 名称匹配
  // app: {
  //   pageTransition: {
  //     name: "page",
  //     mode: "out-in",
  //   },
  // },
  // composables、components、server/utils 文件夹下【导出】的变量和函数，在其他文件夹下会自动导入，可以直接使用
  // 如果你想自定义一个文件夹，并让这个文件夹下导出的变量和函数可以自动导入到其他组件或者页面，需要在下方进行配置，下方表示 http 文件夹下的所有导出的变量和函数会被其他文件夹自动导入
  imports: {
    dirs: ["http"],
  },
  // 配置默认请求地址
  runtimeConfig: {
    public: {
      apiBase: "http://10.0.20.250:5009",
    },
  },
  // 类型检查、严格模式是否启用
  typescript: { strict: true, typeCheck: false },
  // devtools 工具是否启用
  devtools: { enabled: true },
});
