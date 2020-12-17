const { simplyORM } = require("simply-orm");

const db = new simplyORM(__dirname);

db.beginBuild().then(
  (res) => Test(),
  (err) => console.log(err)
);

async function Test() {
  let std = new db.Query("sys_student");
  // std.set_ConditionAnd({
  //   student_name: "李华",
  // });
  // std.set_UpdateField({
  //   student_age: 20,
  //   student_hobby: "请别人帮忙写英语作文"
  // })

  std.set_OneSave({
    student_name: "李晓",
    student_age: 18,
    student_sex: "女",
    student_hobby: "写作文",
    student_birthday: new Date("2001/09/23").toLocaleString(),
  })
  // std.set_ManySave([
  //   {
  //     student_name: "李华",
  //     student_age: 23,
  //     student_sex: "男",
  //     student_hobby: "写英语作文",
  //     student_birthday: new Date("2002/1/11").toLocaleString(),
  //   },
  //   {
  //     student_name: "小明",
  //     student_age: 21,
  //     student_sex: "男",
  //     student_hobby: "看电视",
  //     student_birthday: new Date("2002/2/5").toLocaleString(),
  //   },
  // ]);
  let result = await db.Save(std);
  console.log(result);
}
