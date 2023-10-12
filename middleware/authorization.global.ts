// 修改 middleware 后注意需要重启项目，否则配置不生效
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("token");

  // 如果目标路由为 /，则同意跳转
  if (to.path === "/") return;

  // 如果目标路由为 /auth/login，则同意跳转
  if (to.path === "/auth/login") return;

  // 如果目标路由为 /auth/register，则同意跳转
  if (to.path === "/auth/register") return;

  // 如果目标路由为 /auth/forget-password
  if (to.path === "/auth/forget-password") return;

  // 如果目标路由为除上述路由的其他路由，但没有权限，则跳转到登录
  if (!token.value) return navigateTo("/auth/login");

  // 如果目标路由为除上述路由的其他路由，且具有权限，则允许跳转
  return;
});
