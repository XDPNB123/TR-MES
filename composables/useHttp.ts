// 注意：如果函数使用 default 导出，则使用文件名来调用默认导出的函数；如果函数没有使用 default 导出，则可以直接使用【函数名】调用函数
export default async function useHttp(
  api: string,
  // 参数可选，如果不传递，则为 undefined
  requestMethod?: any,
  requestBody?: any,
  requestParams?: any
) {
  // 获取基本请求地址
  const baseUrl = useRuntimeConfig().public.apiBase;
  // 获取 token
  const token = useCookie("token");
  // 响应的的结果
  let result: any = null;

  // 发送请求
  await $fetch(baseUrl + api, {
    method: requestMethod ?? "POST",
    body: requestBody,
    params: requestParams,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : "",
    },
    // 请求失败的回调函数
    onRequestError({ error }) {
      console.log(`请求失败，失败原因：${error}`);
    },
    // 响应的回调函数
    onResponse({ response }) {
      switch (response.status) {
        case 200:
          result = response._data;
          break;
        case 400:
          console.log("服务器无法理解请求参数");
          break;
        case 401:
          console.log("权限认证失败");
          break;
        case 403:
          console.log("访问遭到拒绝");
          break;
        case 404:
          console.log("服务器上不存在该接口资源");
          break;
        case 500:
          console.log("服务器内部错误");
      }
    },
  });
  // 将响应的结果返回
  return result;
}
