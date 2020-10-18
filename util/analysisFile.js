function checkGramar(str) {
  if(str.replace(/\s/g, '').length == 0) return false;
  if(!/.:/g.test(str)) return false;
  if(/#./g.test(str)) return false;
  return true;
}

function creatObj(arry) {

  let collect_obj = {}, len = arry.length;

  (function Node(obj, i, deep) {
    let nowDeepObject = obj;
    if(!arry[i] || arry[i].index < deep) return i - 1;
    for(i; i < len; i ++) {
      //console.log('\n',i)
      //console.log(`deep: ${deep}, index: ${arry[i].index} key: ${arry[i].key}`);
      if(arry[i].index <= deep) return i - 1;
      if(arry[i].value.length == 0) {
        nowDeepObject[arry[i].key] = {};
        i = Node(nowDeepObject[arry[i].key], i + 1, arry[i].index);   
      } else {
        nowDeepObject[arry[i].key] = arry[i].value;
      }
    }
    return i;
  })(collect_obj, 0, -1);

  return collect_obj;
}

function createConfig(gather_file) {
  let obj = gather_file.split('\n');
  let schema_obj;
  let nowName = [];
  obj.forEach(element => {

    if(checkGramar(element)) {
      
      let arry = element.split(/:/);
      if(arry.length > 2) {
        arry[1] = arry.slice(1).join(':');
      }
      let index = arry[0].lastIndexOf(' ') + 1;
      nowName.push({
        index: index,
        key: arry[0].replace(/\s/g, ''),
        value: arry[1].replace(/[\r\s]/g, '')
      });
    }
  });
  schema_obj = creatObj(nowName)
  //console.log(schema_obj);
  return schema_obj;
}



module.exports = createConfig;