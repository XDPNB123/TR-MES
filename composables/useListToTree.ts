// 将列表根据 id 与 pid 转换成树
export default function useListToTree(list: any) {
  const temp: any = {};
  const tree: any = [];
  for (let i in list) {
    temp[list[i].id] = list[i];
  }
  for (let i in temp) {
    if (temp[i].pid) {
      if (!temp[temp[i].pid].children) {
        temp[temp[i].pid].children = [];
      }
      temp[temp[i].pid].children.push(temp[i]);
    } else {
      tree.push(temp[i]);
    }
  }
  return tree;
}
