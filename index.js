const readFile = require('./util/readFile');
const createConfig = require('./util/analysisFile');
const check = require('./util/checkConfig');
const Mongodb = require('./connect/mongodb');
const MySql = require('./connect/mysql');

class Great_DataBase {
  constructor(path = __dirname) {
    this.path = path;
    this.configFile = null;
    this.dataBase = null;
  }

  setPath(path) {
    this.path = path;
  }

  setConfigFile(configFile) {
    this.configFile = configFile;
  }

  connectToMongodb() {
    const db = new Mongodb();
    const config = this.dataBaseConfig.DATABASE;

    return new Promise((resolve, reject) => {
      db.set_ConnectUrl(config.url);
      if(config.authorization && config.authorization.enable == 'true') {
        db.set_Authorization({
          user: config.authorization.user || '',
          pass: config.authorization.pass || ''
        });
      }
      db.connect()
        .then(
          () => resolve(db.getDataBaseObj()),
          err => reject(err)
        )
    })
  }

  connectToMySql() {
    const db = new MySql();
    db.set_Config(this.dataBaseConfig);
    console.log('begin try connect to MySql...');
    console.time('connect')
    db.set_MySqlObject();
    this.dataBase =  db.connect();
    console.timeEnd('connect');
    console.log('connect to MySql successful!');
  }

  async Create() {
    await readFile(this.path)
      .then(
        res => this.configFile = res
      )
    this.dataBaseConfig = createConfig(this.configFile);
    await check(this.dataBaseConfig);
    switch(this.dataBaseConfig.DATABASE.name) {
      case 'mongodb': {
        const collection = require('./gatherMap/mongodb');
        await this.connectToMongodb().then(res => this.dataBase = res);
        let collections = collection(this.dataBase,this.dataBaseConfig);
        collections.forEach(item => this[item.collectionName] = item.value);
      }; break;

      case 'mysql': {
        this.connectToMySql();
      }; break;
    }
    return;
  }
}

module.exports = Great_DataBase;