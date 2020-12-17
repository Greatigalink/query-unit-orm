const { simplyORM } = require("simply-orm");
const db = new simplyORM(__dirname);

db.beginBuild().then((res) => {
  let art = new db.Query("articles");

  //设置结果需要的字段
  art.set_ResultField([
    "_id",
    "art_title",
    "art_intro",
    "art_view",
    "art_time",
    "art_img",
  ]);
  //前5条数据
  art.set_Limit(5);
  //按时间正序排列
  art.set_Sort({ art_time: 1 });
  //观看次数大于 30
  art.set_ConditionAnd({ art_view: { $gt: 30 } });

  db.Find(art).then((res) => console.log(res));
});
