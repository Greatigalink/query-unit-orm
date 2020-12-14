import Mongodb from './mongodb';
import Mysql from './mysql';

export default function createModel(SIMPLY_Db: any) {
  return new Promise((resolve: (value: object) => void, reject) => {

    switch(SIMPLY_Db._db.name) {
      case "mongodb": {
        try {
          let entity_obj = Mongodb(SIMPLY_Db.dataBase, SIMPLY_Db.dataBaseConfig);
          resolve(entity_obj);
        } catch (error) {
          reject(error)
        }
      } break;

      case "mysql": {
        try {
          let entity_obj = Mysql(SIMPLY_Db.dataBaseConfig);
          resolve(entity_obj)
        } catch (error) {
          reject(error)
        }
      } break;

    }
  })
}