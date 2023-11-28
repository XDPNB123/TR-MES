export default function useListToTree(list: any[], parentId: any = 0) {
  let tree: any[] = [];
  let temp: any;

  for (let i = 0; i < list.length; i++) {
    if (list[i].pid === parentId) {
      temp = { ...list[i] };
      temp.children = useListToTree(list, list[i].id);
      tree.push(temp);
    }
  }

  return tree;
}
