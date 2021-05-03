interface CONDITION {
  [propName: string]: any;
  $or?: Array<object>;
}

interface RESULT_FIELD {
  [propName: string]: number;
}

//条件生成
function createCondition(queryObj: any): CONDITION {
  let obj: CONDITION = queryObj.condition_And ? queryObj.condition_And : {};
  let array = [];
  if (queryObj.condition_Or) {
    for (let item in queryObj.condition_Or) {
      array.push({
        [item]: queryObj.condition_Or[item],
      });
    }
    obj.$or = array;
  }
  if (queryObj.condition_Like) {
    for (let item in queryObj.condition_Like) {
      obj[item] = {
        $regex: queryObj.condition_Like[item],
      };
    }
  }
  return obj;
}

//结果字段生成
function createResultField(queryObj: any, enitiy: any): RESULT_FIELD {
  let obj: RESULT_FIELD = { _id: 0 };
  queryObj.resultField
    ? queryObj.resultField.forEach((element: any) => {
        obj[element] = 1;
      })
    : obj;
  queryObj.unResultField
    ? Object.keys(enitiy[queryObj.tableName]).forEach(
        (element) => {
          if(queryObj.unResultField.indexOf(element) == -1) {
            obj[element] = 1;
          }
        }
      )
    : obj;
  return obj;
}

//修改字段生成
function createUpdateField(queryObj: any) {
  return queryObj.updateField
    ? {
        $set: queryObj.updateField,
      }
    : {};
}

export {
  createCondition,
  createResultField,
  createUpdateField
}