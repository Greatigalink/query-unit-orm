function gatherMap(obj: any) {
  let tableMap: any = {};
  for(let post in obj) {
    obj[post].replace(/[\[\]]/g, "").split(",").forEach((item: any) => {
      tableMap[item] = post.toLocaleLowerCase()
    })
  }
  return tableMap;
}

export default function createEnitiy(configFile: any) {
  let enitiyMap: any = {};

  for(let item in configFile.ENTITYMAP) {
    enitiyMap[item] = gatherMap(configFile.ENTITYMAP[item]);
  }

  return enitiyMap;
}