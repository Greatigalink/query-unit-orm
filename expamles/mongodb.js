const { queryUnitORM } = require("query-unit-orm");
const db = new queryUnitORM(__dirname);

db.beginBuild().then((res) => {
  let art = new db.Query("articles");

  //设置结果需要的字段
  art.result_Field([
    "_id",
    "art_title",
    "art_intro",
    "art_view",
    "art_time",
    "art_img",
  ])
  .limit(5)
  .sort({ art_time: 1 })
  .and({ art_view: { $gt: 30 } });

  db.Find(art).then((res) => console.log(res));
});
