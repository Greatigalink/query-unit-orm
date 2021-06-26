const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
const TYPE: any = {
  String: String,
  Number: Number,
  Array: Array,
  ObjectId: ObjectId,
  Date: Date,
  Boolean: Boolean,
  Mixed: Mixed
};

interface COLLECTION {
  [propName: string]: any
}

function gatherMap(schema_obj: COLLECTION, obj: any, entity_obj: any) {
  let type = Object.keys(obj);
  type.forEach((item_type: string) => {
    if (item_type != "ArrayObj") {
      let columns = obj[item_type];
      columns.forEach(
        (item_field: any) => {
          schema_obj[item_field] = TYPE[item_type];
          entity_obj[item_field] = item_type.toLocaleLowerCase();
        }
      );
    } else {
      let array = Object.keys(obj[item_type]);
      array.forEach((item) => {
        let col: COLLECTION = {};
        let eny: COLLECTION = {};
        gatherMap(col, obj[item_type][item], eny);
        schema_obj[item] = [];
        schema_obj[item].push(col);
        entity_obj[item] = "array-obj";
        for(let post in eny) {
          entity_obj[post] = eny[post];
        }
      });
    }
  });
}

//mongodb 集合映射生成主函数，负责将配置文件集合信息转换为可执行操作的 Modle
export default function readDeploy(dataBase: any, configFile: any) {
  let ENTITY: COLLECTION = {};
  let collection_obj: COLLECTION = {};
  let collections = Object.keys(configFile.ENTITYMAP);

  collections.forEach((item) => {
    let schema_obj: COLLECTION = {};
    let entity_obj: COLLECTION = {};
    let model_value: any;
    gatherMap(schema_obj, configFile.ENTITYMAP[item], entity_obj);
    collection_obj[item] = mongoose.Schema(schema_obj, {
      versionKey: false,
    });
    model_value = dataBase.model(item, collection_obj[item]);
    dataBase[item] = model_value;
    ENTITY[item] = entity_obj;
  });
  return ENTITY;

}
