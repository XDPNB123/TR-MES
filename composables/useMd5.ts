// 注意：如果函数使用 default 导出，则使用文件名来调用默认导出的函数；如果函数没有使用 default 导出，则可以直接使用【函数名】调用函数
import { Md5 } from "ts-md5";
export default function useMd5(str: string) {
  return new Md5().appendStr(str).end();
}
