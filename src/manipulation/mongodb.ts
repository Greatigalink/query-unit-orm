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

//使用 insertMany 进行存储
function Save_Mongodb(dataBase: any, queryObj: any) {
  let QUERY = dataBase[queryObj.tableName];
  let document = queryObj.many_Save ? queryObj.many_Save : [queryObj.one_Save];

  return new Promise((resolve, reject) => {
    QUERY.insertMany(document, function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

//使用 remove 删除
function Remove_Mongodb(dataBase: any, queryObj: any) {
  let condition = createCondition(queryObj);
  let QUERY = dataBase[queryObj.tableName].remove(
    Object.keys(condition).length == 0 ? { Default: true } : condition,
    {
      justOne: queryObj.Limit == 1 ? true : false,
    }
  );

  return new Promise((resolve, reject) => {
    QUERY.exec(function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

//使用 update 修改
function Update_Mongodb(dataBase: any, queryObj: any) {
  let QUERY = dataBase[queryObj.tableName].update(
    createCondition(queryObj),
    createUpdateField(queryObj)
  );

  queryObj.Sort ? QUERY.sort(queryObj.Sort) : QUERY;
  queryObj.Limit ? QUERY.limit(queryObj.Limit) : QUERY;

  return new Promise((resolve, reject) => {
    QUERY.exec(function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

//使用 find 查询
function Find_Mongodb(dataBase: any, queryObj: any, enitiy: any) {
  let QUERY = dataBase[queryObj.tableName].find(
    createCondition(queryObj),
    createResultField(queryObj, enitiy)
  );

  queryObj.Sort ? QUERY.sort(queryObj.Sort) : QUERY;
  queryObj.Limit ? QUERY.limit(queryObj.Limit) : QUERY;

  return new Promise((resolve, reject) => {
    QUERY.exec(function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export { Save_Mongodb, Remove_Mongodb, Update_Mongodb, Find_Mongodb };
