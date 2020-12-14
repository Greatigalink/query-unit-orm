//原文件节点行--记录每一行内容及其缩进大小，便于下一步生成配置对象
interface ymlNode {
  indent: number,
  key: string,
  value: string
}

//配置对象节点--冒号左边为 key(字符串类型)，右边为 value(可能为基本类型值，也有可能为引用类型值)
interface configNode {
  [propName: string]: any
}

//检查语法格式--滤掉不规范的 yml 格式以及注释内容
function checkGramar(str: string): boolean {
  if (str.replace(/\s/g, "").length == 0) return false;
  if (!/.:/g.test(str)) return false;
  if (/#./g.test(str)) return false;
  return true;
}

//生成完整配置对象--根据缩进大小递归构建树形结构，生成对象
function creatObj(arry: Array<ymlNode>): configNode {
  let collect_obj: configNode = {},
    len = arry.length;

  (function Node(obj, i, deep) {
    //保留每一个节点层的对象引用
    let nowDeepObject = obj;
    //当前节点深度小于当前父节点深度时返回，代表新的节点属于父节点的兄弟节点
    if (!arry[i] || arry[i].indent < deep) return i - 1;
    //循环读取节点行
    for (i; i < len; i++) {
      if (arry[i].indent <= deep) return i - 1;
      //若当前节点值为空，代表该节点存在儿子节点，需要继续深入
      //否则它是当前父节点的叶子节点，直接赋值即可
      if (arry[i].value.length == 0) {
        nowDeepObject[arry[i].key] = {};
        i = Node(nowDeepObject[arry[i].key], i + 1, arry[i].indent);
      } else {
        nowDeepObject[arry[i].key] = arry[i].value;
      }
    }
    return i;
  })(collect_obj, 0, -1);

  return collect_obj;
}

//文件解析主函数--负责解析过滤原文件，生成原文件节点行对象数组，生成完整配置对象
export default function createConfig(gather_file: string): object {
  let obj = gather_file.split("\n");
  let nowName: Array<ymlNode> = [];

  obj.forEach((element) => {
    if (checkGramar(element)) {
      let arry = element.split(/:/);
      if (arry.length > 2) {
        arry[1] = arry.slice(1).join(":");
      }
      let index = arry[0].lastIndexOf(" ") + 1;
      let node: ymlNode = {
        indent: index,
        key: arry[0].replace(/\s/g, ""),
        value: arry[1].replace(/[\r\s]/g, ""),
      };
      nowName.push(node);
    }
  });

  return creatObj(nowName);
}
