const { simplyORM } = require("simply-orm");

const db = new simplyORM(__dirname);

db.beginBuild().then(
  res => console.log(res),
  err => console.log(err)
);

