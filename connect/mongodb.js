class Mongodb {
  constructor(connectUrl = null) {
    this.connectUrl = connectUrl;
  }

  set_ConnectUrl(connectUrl) {
    this.connectUrl = connectUrl;
  }

  set_Authorization(auth) {
    this.auth = {
      user: auth.user || '',
      pass: auth.pass || ''
    };
  }

  getDataBaseObj() {
    return this.$dataBase_obj;
  }

  connect() {
    const mongoose = require('mongoose');
    console.log('begin try connect to mongodb...');
    console.time('connect');
    mongoose.connect(this.connectUrl, this.auth || {});
    return new Promise((resolve, reject) => {
      if(!this.connectUrl) reject({
        status: 40
      });
      this.$dataBase_obj = mongoose.connection;
      this.$dataBase_obj.once('open', () => {
        resolve({
          status: 20
        });
        console.timeEnd('connect');
        console.log('connect to mongodb successful!');
      });
      this.$dataBase_obj.on('error', err => {
        reject({
          status: 50, 
          message: err
        });
      })
    });
  }
}

module.exports = Mongodb;