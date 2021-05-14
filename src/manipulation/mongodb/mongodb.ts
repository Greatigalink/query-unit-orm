import {
  createCondition,
  createResultField,
  createUpdateField,
  createAggregateField
} from './query-field'

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

function Aggregate_Mongodb(dataBase: any, queryObj: any, enitiy: any) {
  let aggField = createAggregateField(queryObj, enitiy)

  if(queryObj.Limit) {
    aggField.splice(2, 0, {
      $limit: queryObj.Limit
    })
  }
  if(queryObj.Sort) {
    aggField.splice(2, 0, {
      $sort: queryObj.Sort
    })
  }

  let QUERY = dataBase[queryObj.tableName].aggregate(
    aggField
  )

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

export { Save_Mongodb, Remove_Mongodb, Update_Mongodb, Find_Mongodb, Aggregate_Mongodb };
