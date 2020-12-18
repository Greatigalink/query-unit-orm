const { queryUnitORM } = require("query-unit-orm");

const db = new queryUnitORM(__dirname);

db.beginBuild().then(
  res => console.log(res),
  err => console.log(err)
);

