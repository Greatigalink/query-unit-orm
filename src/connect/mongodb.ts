const chalk = require('chalk');
const START = chalk.bold.blue;
const ERROR = chalk.bold.red;
const YES = chalk.bold.green;

interface AUTH {
  user: string,
  pass: string
}

export default class Mongodb {
  public connectUrl: string;
  public authorization: AUTH;
  private _dataBase: any;

  setConnectUrl(connectUrl: string, config: any) {
    this.connectUrl = connectUrl;
    if(config.port && config.host && config.database) {
      this.connectUrl = `mongodb://${config.host}:${config.port}/${config.database}`
    }
  }

  setAuthorization(auth: any) {
    this.authorization = auth ? {
      user: auth.user || "",
      pass: auth.password || "",
    } : null;
  }

  getDataBase() {
    return this._dataBase;
  }

  connect() {
    const mongoose = require("mongoose");
    console.log(START("begin try connect to mongodb..."));
    console.time("connect");
    if(this.authorization) {
      mongoose.connect(this.connectUrl, this.authorization || {});
    } else {
      mongoose.connect(this.connectUrl);
    }
    
    return new Promise((resolve: (value: any) => void, reject: (value: object) => void) => {
      this._dataBase = mongoose.connection;
      this._dataBase.once("open", () => {
        resolve(this._dataBase);
        console.timeEnd("connect");
        console.log(YES("connect to mongodb successful!"));
      });
      this._dataBase.on("error", (err: any) => {
        reject({
          err
        });
        console.timeEnd("connect");
        console.log(ERROR("connect to mongodb Failed......"));
      });
    });
    
  }

}
