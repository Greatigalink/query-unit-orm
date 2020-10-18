const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;
const TYPE = {
  'String': String,
  'Number': Number,
  'Array': Array,
  'ObjectId': ObjectId,
  'Date': Date,
  'Boolean': Boolean
}

function gatherMap(collection, obj) {
  let type =  Object.keys(obj);
  type.forEach(item_type => {
    if(item_type != 'ArrayObj') {
      let columns = obj[item_type].replace(/[\[\]]/g, '').split(',');
      columns.forEach(item_field  => collection[item_field] = TYPE[item_type]);
    } else {
      let array = Object.keys(obj[item_type]);
      array.forEach(item => {
        let col = {};
        gatherMap(col, obj[item_type][item]);
        collection[item] = [];
        collection[item].push(col)
        //console.log(collection)
      })
    }

  });
}

function readDeploy(dataBase_obj, configFile) {
  let model = [];
  let collection_obj = {};
  let collections = Object.keys(configFile.TABLE);
  collections.forEach(item => {
    let schema_obj = {};
    gatherMap(schema_obj, configFile.TABLE[item]);
    collection_obj[item] = mongoose.Schema(
      schema_obj,
      {
        versionKey: false
      }
    );
    model.push({
      collectionName: item,
      value: dataBase_obj.model(item, collection_obj[item])
    });
  });
  //console.log(model)
  return model;
}

module.exports =  readDeploy;

