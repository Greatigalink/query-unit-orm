const chalk = require('chalk');
const START = chalk.bold.blue;
const ERROR = chalk.bold.red;
const YES = chalk.bold.green;

export default class MySql {
  public config: any;
  private _dataBase: any

  set_Config(config: object) {
    this.config = config;
  }

  set_MySqlObject() {
    const mysql = require("mysql");
    let config = this.config.DATABASE;
    this._dataBase = mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.authorization.user,
      password: config.authorization.password,
      database: config.database,
    });
  }

  getDataBase() {
    return this._dataBase;
  }

  connect() {
    return new Promise((resolve: (value: any) => void, reject: (value: object) => void) => {
      let that = this;
      console.time('connect');
      console.log(START("begin try connect to mysql..."));
      this._dataBase.connect(function (err: any) {
        if (err) {
          reject(err);
          console.timeEnd('connect');
          console.log(ERROR("connect to MySql Failed......"));
        } else {
          resolve(that._dataBase);
          console.timeEnd('connect');
          console.log(YES("connect to Mysql successful!"));
        }
      });
    });
  }

}
