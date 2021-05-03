const { queryUnitORM } = require("query-unit-orm");
const db = new queryUnitORM(__dirname);

db.beginBuild().then(
  res => selectName(),
  err => console.log(err)
)

async function selectName() {
  let user_1 = new db.Query("blogusers");
  user_1.result_Field(["_id", "user_name"]);
  
  let user_2 = new db.Query("blogusers");
  user_2.unResult_Field(["_id", "user_friend"]).limit(3)

  let arts = new db.Query("articles");
  arts.unResult_Field(["art_content"]).limit(5)

  let list_1 = await db.Find(user_1)
  let list_2 = await db.Find(user_2)
  let list_3 = await db.Find(arts)

  list_3.concat(list_1);
}