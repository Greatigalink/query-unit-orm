import { QUOError } from '../util/logDisplay';

interface Error {
  [propName: string]: string;
}
interface checkMsg {
  type: number;
  message: string;
}

const Mongodb_Error: Error = {
  name: "Must to set dataBase Type!",
  host: "Must to set Host!",
  port: "Must to set port!",
  database: "Must to set database!",
};
const Mysql_Error: Error = {
  name: "Must to set dataBase Type!",
  host: "Must to set Host!",
  port: "Must to set port!",
  database: "Must to set database!",
  authorization: "Must to set dataBase Authorization!",
};

function Message(type: number, message: string): checkMsg {
  return {
    type,
    message,
  };
}

//Mongodb检查函数
function checkMongodb(dataBaseConfig: any): checkMsg {
  let db_Config = Object.keys(dataBaseConfig.DATABASE);
  if(dataBaseConfig.DATABASE.url) {
    return Message(1, "Successful!");
  }
  for (let item in Mongodb_Error) {
    if (db_Config.indexOf(item) == -1) {
      return Message(0, Mongodb_Error[item]);
    }
  }
  return Message(1, "Successful!");
}

//MySql检查函数
function checkMySql(dataBaseConfig: any): checkMsg {
  let db_Config = Object.keys(dataBaseConfig.DATABASE);
  for (let item in Mysql_Error) {
    if (db_Config.indexOf(item) == -1) {
      return Message(0, Mysql_Error[item]);
    }
  }
  if (
    !dataBaseConfig.DATABASE.authorization.user ||
    !dataBaseConfig.DATABASE.authorization.password
  )
    return Message(0, "Must to set user and password!");
  else return Message(1, "Successful!");
}

//配置文件检查主函数，负责检查关键信息是否缺失
export default function checkConfigFile(dataBaseConfig: any) {
  let checkMsg: checkMsg = {
    type: 0,
    message: "",
  };
  return new Promise((resolve: (value: object) => void, reject) => {
    if (!dataBaseConfig.DATABASE)
      reject(QUOError({
        code: 100,
        message: "not found DataBase...",
      }));
    else if (!dataBaseConfig.ENTITYMAP)
      reject(QUOError({
        code: 101,
        message: "not found EntityMap...",
      }));
    else {
      switch (dataBaseConfig.DATABASE.name) {
        case "mongodb":
          checkMsg = checkMongodb(dataBaseConfig);
          break;
        case "mysql":
          checkMsg = checkMySql(dataBaseConfig);
          break;
        default:
          checkMsg = {
            type: 0,
            message: `Sorry, can't analy DataBase of "${dataBaseConfig.DATABASE.name}"...`,
          };
      }
      if (checkMsg.type == 1) {
        resolve({
          name: dataBaseConfig.DATABASE.name,
          version: '0.0.0'
        });
      } else {
        reject(QUOError({
          code: 102,
          message: checkMsg.message
        }));
      }
    }
  });
}
