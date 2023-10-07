import { Md5 } from "ts-md5";
export default function useMd5(str: string) {
  return new Md5().appendStr(str).end();
}
