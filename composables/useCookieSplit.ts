// 将 menuList、btnList 分为多个 Cookie 存储
export default function useCookieSplit(
  name: string,
  size: number,
  cookies: any
) {
  // size 表示希望将多少条数据存为一个 Cookie

  // 每个 Cookie 储存的数组
  let tempArr: any = [];
  // 每个 Cookie 的索引
  let tempIndex = 0;
  // 这个函数共产生了多少个 Cookie
  let cookieCount = 0;
  cookies.forEach((item: any, index: number) => {
    // 添加一项进入某个 Cookie
    tempArr.push(item);
    // 每 5 项储存为 1 个 Cookie
    if (tempArr.length === size) {
      useCookie(`${name}${tempIndex}`).value = JSON.stringify(tempArr);
      tempArr = [];
      tempIndex++;
      cookieCount++;
    }
    // 处理最后一个 Cookie 的菜单项少于 size 个
    if (index === cookies.length - 1 && tempArr.length < size) {
      useCookie(`${name}${tempIndex}`).value = JSON.stringify(tempArr);
      cookieCount++;
    }
  });

  // 将该函数产生的 Cookie 总数也作为 Cookie 储存
  useCookie(`${name}CookieCount`).value = cookieCount.toString();
}
