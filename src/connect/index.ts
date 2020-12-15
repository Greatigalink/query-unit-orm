import Mongodb from './mongodb'
import MySql from './mysql'

export default function Connect(_db: any, config: any) {
  return new Promise((resolve, reject) => {
    switch(_db.name) {
      case 'mongodb': {
        const mongodb = new Mongodb();
        mongodb.setConnectUrl(config.DATABASE.url, config.DATABASE);
        mongodb.setAuthorization(config.DATABASE.authorization ? config.DATABASE.authorization : null);
        mongodb.connect().then(
          (res) => resolve(res),
          (err) => reject(err)
        );
      }; break;
  
      case 'mysql': {
        const mysql = new MySql();
        mysql.set_Config(config);
        mysql.set_MySqlObject();
        mysql.connect().then(
          (res) => resolve(res),
          (err) => reject(err)
        );
      }; break;

      default: {
        reject('please check database name!');
      }
    }
  })
  
}