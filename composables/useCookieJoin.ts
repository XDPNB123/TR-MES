// 将多个 Cookie 拼接成一个并返回
export default function useCookieJoin(name: any) {
  // 获取该名称的 cookie 总数
  const count = useCookie(`${name}CookieCount`).value;
  // 如果该名称的 Cookie 总数不存在，则直接返回
  if (!count) return false;

  // 声明最终的返回结果
  let result: any = [];
  // 将这些 Cookie 取出并合并
  for (let i = 0; i < Number(count); i++) {
    result = [...result, ...(useCookie(`${name}${i}`).value as any)];
  }

  return result;
}
