// plugins 下 .client 结尾的插件表示【客户端】生效
// plugins 下 .server 结尾的插件表示【服务端】生效
// plugins 下 直接以 ts 结尾的插件表示客户端和服务端都会生效

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("permission", {
    mounted(el, binding) {
      // 获取 btnList，注意 useCookie 会自动进行 JSON.parse
      const btnList = useCookieJoin("btnList");

      // useCookieJoin("btnList") 的返回值如果是 false
      if (!btnList) {
        // 移除该按钮
        return el.parentNode && el.parentNode.removeChild(el);
      }

      // btnList 中如果不包含这个 btn
      if (!btnList.includes(binding.value))
        // 移除该按钮
        return el.parentNode && el.parentNode.removeChild(el);
    },
    getSSRProps(binding, vnode) {
      // 不做任何处理
      return {};
    },
  });
});
