import {
  Save_Mongodb,
  Remove_Mongodb,
  Update_Mongodb,
  Find_Mongodb,
  Aggregate_Mongodb,
  Count_Mongodb,
} from "./mongodb/mongodb";
import {
  Save_Mysql,
  Remove_Mysql,
  Update_Mysql,
  Find_Mysql,
} from "./mysql/mysql";
import { QUOWarning } from "../util/logDisplay";
import typeCheck from "./typeCheck";

const isUseAgg = (queryObj: any) =>
  queryObj.joinName &&
  queryObj.fromRelationField &&
  queryObj.masterRelationField;

async function Save(_db: any, dataBase: any, queryObj: any) {
  let result;
  switch (_db.name) {
    case "mongodb":
      result = await Save_Mongodb(dataBase, queryObj);
      break;
    case "mysql":
      result = await Save_Mysql(dataBase, queryObj);
      break;
  }
  return result;
}

async function Remove(_db: any, dataBase: any, queryObj: any) {
  let result;
  switch (_db.name) {
    case "mongodb":
      result = await Remove_Mongodb(dataBase, queryObj);
      break;
    case "mysql":
      result = await Remove_Mysql(dataBase, queryObj);
      break;
  }
  return result;
}

async function Update(_db: any, dataBase: any, queryObj: any) {
  let result;
  switch (_db.name) {
    case "mongodb":
      result = await Update_Mongodb(dataBase, queryObj);
      break;
    case "mysql":
      result = await Update_Mysql(dataBase, queryObj);
      break;
  }
  return result;
}

async function Find(_db: any, dataBase: any, queryObj: any, enitiy: any) {
  let result;
  switch (_db.name) {
    case "mongodb":
      result = await Find_Mongodb(dataBase, queryObj, enitiy);
      break;
    case "mysql":
      result = await Find_Mysql(dataBase, queryObj, enitiy);
      break;
  }
  return result;
}

async function Aggregate(_db: any, dataBase: any, queryObj: any, enitiy: any) {
  let result;
  switch (_db.name) {
    case "mongodb":
      {
        if (isUseAgg(queryObj)) {
          result = await Aggregate_Mongodb(dataBase, queryObj, enitiy);
        } else {
          console.log(
            QUOWarning({
              code: 117,
              message: `because not found all aggFiled(joinName, masterRelationField, fromRelationField, newlyField), so only use "Find_Mongodb" find data give you!`,
            })
          );
          result = await Find_Mongodb(dataBase, queryObj, enitiy);
        }
      }
      break;
  }
  return result;
}

async function Count(_db: any, dataBase: any, queryObj: any, enitiy: any) {
  let result;
  
  switch (_db.name) {
    case "mongodb":
      result = await Count_Mongodb(dataBase, queryObj, enitiy);
      break;
  }
  return result;
}

export { Save, Remove, Update, Find, typeCheck, Aggregate, Count };
