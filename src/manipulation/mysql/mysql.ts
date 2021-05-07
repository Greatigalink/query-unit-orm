import { QUOError } from "../../util/logDisplay";
import {
  createCondition,
  createInsertOne,
  createInsertMany,
  createResultField,
  createUpdateField,
  createSortAndLimit
} from "./query-field"

function Save_Mysql(dataBase: any, queryObj: any) {
  let sql = `INSERT INTO ${queryObj.tableName} `;
  let ONE_SAVE = queryObj.one_Save ? createInsertOne(queryObj) : false;
  let MANY_SAVE = queryObj.many_Save ? createInsertMany(queryObj) : false;

  if(MANY_SAVE && MANY_SAVE != "") {
    sql += MANY_SAVE;
  } else if(ONE_SAVE && ONE_SAVE != "") {
    sql += ONE_SAVE;
  } else {
    sql = null;
  }

  console.log(sql)

  return new Promise((resolve, reject) => {
    sql == null ? reject(QUOError({ code: 110, message: "No valid data was found"})) : sql;
    dataBase.query(sql, function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function Remove_Mysql(dataBase: any, queryObj: any) {
  let sql = `DELETE FROM ${queryObj.tableName} `;
  let CONDITION = createCondition(queryObj);

  return new Promise((resolve, reject) => {
    CONDITION != ""
      ? (sql += `WHERE ${CONDITION}`)
      : reject(
          QUOError({ code: 111, message: "You cannot delete without conditions!" })
        );
    dataBase.query(sql, function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function Update_Mysql(dataBase: any, queryObj: any) {
  let sql = `UPDATE ${queryObj.tableName} SET `;
  let CONDITION = createCondition(queryObj);
  let UPDATE = createUpdateField(queryObj);

  return new Promise((resolve, reject) => {
    UPDATE != ""
      ? (sql += `${UPDATE}`)
      : reject(
          QUOError({ code: 112, message: "The modify field must be specified!" })
      );

    CONDITION != ""
      ? (sql += ` WHERE ${CONDITION}`)
      : reject(
          QUOError({ code: 113, message: "You cannot update without conditions!" })
        );

    dataBase.query(sql, function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function Find_Mysql(dataBase: any, queryObj: any, enitiy: any) {
  let sql = `SELECT ${createResultField(queryObj, enitiy)} FROM ${
    queryObj.tableName
  }`;
  let CONDITION = createCondition(queryObj);
  let { SORT, LIMIT } = createSortAndLimit(queryObj);
  CONDITION != "" ? (sql += ` WHERE ${CONDITION}`) : sql;
  SORT != "" ? (sql += ` ORDER BY ${SORT} `) : sql;
  LIMIT ? (sql += ` LIMIT ${LIMIT} `) : sql;

  return new Promise((resolve, reject) => {
    dataBase.query(sql, function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export { Save_Mysql, Remove_Mysql, Update_Mysql, Find_Mysql };
