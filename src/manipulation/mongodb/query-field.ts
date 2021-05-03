interface CONDITION {
  [propName: string]: any;
  $or?: Array<object>;
}

interface RESULT_FIELD {
  [propName: string]: number;
}

interface LOOKUP_FIELD {
  $lookup: any,
}

interface PROJECT_FIELD {
  $project: any
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
  let obj: RESULT_FIELD = {};
  if(queryObj.resultField) {
    queryObj.resultField.forEach((element: any) => {
      obj[element] = 1;
    })
  } else if(queryObj.unResultField) {
    Object.keys(enitiy[queryObj.tableName]).forEach(
      (element) => {
        if(queryObj.unResultField.indexOf(element) == -1) {
          obj[element] = 1;
        }
      }
    )
  }
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

//聚合查询字段生成
function createAggregateField(queryObj: any, enitiy: any): Array<object> {
  let lookUpObj: LOOKUP_FIELD = {
    $lookup: {},
  }
  let projectObj: PROJECT_FIELD = {
    $project: {}
  }
  let resultField = createResultField(queryObj, enitiy)
  let joinField: RESULT_FIELD = {}

  if(queryObj.joinField) {
    queryObj.joinField.forEach((element: any) => {
      joinField[element] = 1;
    })
  } else if(queryObj.joinUnField) {
    Object.keys(enitiy[queryObj.joinName]).forEach(
      (element) => {
        if(queryObj.joinUnField.indexOf(element) == -1) {
          joinField[element] = 1;
        }
      }
    )
  }

  lookUpObj.$lookup = {
    from: queryObj.joinName || "",
    localField: queryObj.masterRelationField || "",
    foreignField: queryObj.fromRelationField || "",
    as: queryObj.newlyField || "defaultJoin"
  }
  projectObj.$project = Object.assign(
    {}, 
    resultField, 
    {
      [queryObj.newlyField]: joinField
    }
  )
  return [lookUpObj, projectObj]
}

export {
  createCondition,
  createResultField,
  createUpdateField,
  createAggregateField
}