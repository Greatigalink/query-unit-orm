const { Simply_DataBase } = require("simply-db");

const db = new Simply_DataBase(__dirname);

db.beginBuild().then(
  res => console.log(res),
  err => console.log(err)
);

