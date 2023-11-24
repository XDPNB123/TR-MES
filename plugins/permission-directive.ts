// plugins 下 .client 结尾的插件表示【客户端】生效
// plugins 下 .server 结尾的插件表示【服务端】生效
// plugins 下 直接以 ts 结尾的插件表示客户端和服务端都会生效

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("permission", {
    mounted(el, binding) {
      // 获取 btnList，注意 useCookie 会自动进行 JSON.parse
      const btnList = useCookie("btnList").value as any;
      // 如果按钮权限不存在
      if (!btnList.includes(binding.value))
        // 移除该按钮
        el.parentNode && el.parentNode.removeChild(el);
    },
    getSSRProps(binding, vnode) {
      // 不做任何处理
      return {};
    },
  });
});
