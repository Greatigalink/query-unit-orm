class MySql {
  constructor(config = null) {
    this.config = config;
    this.$dataBase_obj = null;
  }

  set_Config(config) {
    this.config = config;
  }

  set_MySqlObject() {
    const mysql = require('mysql');
    let config = this.config.DATABASE;
    this.$dataBase_obj = mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.authorization.user,
      password: config.authorization.password,
      database: config.database
    });
  }

  getDataBaseObj() {
    return this.$dataBase_obj;
  }

  connect() {
    this.$dataBase_obj.connect();
    return this.$dataBase_obj;
  }
}

module.exports = MySql;