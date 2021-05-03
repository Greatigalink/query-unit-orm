const predicate: any = {
  $gt: ">",
  $lt: "<",
  $gte: ">=",
  $lte: "<=",
  $ne: "!=",
};

function createValue(value: any) {
  return typeof value == "string" ? `"${value}"` : value;
}

//SQL语句: 谓词转换
function createPredicate(obj: any): string {
  let key = Object.keys(obj),
    result = "";
  if (key.length != 1) {
    return "";
  } else {
    key.forEach(
      (item) => (result = `${predicate[item]}${createValue(obj[item])}`)
    );
  }
  return result;
}

//SQL语句: where 条件
function createCondition(queryObj: any): string {
  let str_Or = [],
    str_Like = [],
    str_And = [];
  let [OR, AND, LINK] = [
    queryObj.condition_Or,
    queryObj.condition_And,
    queryObj.condition_Like,
  ];

  if (OR) {
    for (let item in OR) {
      str_Or.push(
        typeof OR[item] == "object"
          ? `${item}${createPredicate(OR[item])}`
          : `${item}=${createValue(OR[item])}`
      );
    }
    str_And.push(`(${str_Or.join(" OR ")})`);
  }

  if (LINK) {
    for (let item in LINK) {
      str_Like.push(`${item} LIKE "${LINK[item]}"`);
    }
    str_And.push(
      `(${str_Like.join(` ${queryObj.link_Type} `.toLocaleUpperCase())})`
    );
  }

  if (AND) {
    for (let item in AND) {
      str_And.push(
        typeof AND[item] == "object"
          ? `${item}${createPredicate(AND[item])}`
          : `${item}=${createValue(AND[item])}`
      );
    }
  }

  return str_And.join(" AND ");
}

//SQL语句: 插入一条数据
function createInsertOne(queryObj: any) {
  let field = [],
    value = [];
  for (let item in queryObj.one_Save) {
    field.push(item);
    value.push(createValue(queryObj.one_Save[item]));
  }
  return `(${field.join(",")}) VALUES (${value.join(",")});`;
}

//SQL语句: 插入多条数据
function createInsertMany(queryObj: any) {
  let FIELD: any = [], VALUES: any = [];
  let fieldDate = queryObj.many_Save[0];
  for(let item in fieldDate) {
    FIELD.push(item);
  }
  queryObj.many_Save.forEach((item: any) => {
    let value: any = [];
    FIELD.forEach((post: any) => {
      value.push(createValue(item[post]))
    })
    VALUES.push(
      `(${value.join(",")})`
    )
  });

  return `(${FIELD.join(",")}) VALUES ${VALUES.join(",")}`
}

//SQL语句: 结果字段
function createResultField(queryObj: any, enitiy: any): string {
  let result = [];
  if (queryObj.unResultField) {
    for (let item in enitiy[queryObj.tableName]) {
      if (queryObj.unResultField.indexOf(item) == -1) {
        result.push(item);
      }
    }
  } else {
    result = queryObj.resultField ? queryObj.resultField : ["*"];
  }

  return result.join(",");
}

//SQL语句: 修改字段
function createUpdateField(queryObj: any) {
  let result = [];
  for (let item in queryObj.updateField) {
    result.push(`${item}=${createValue(queryObj.updateField[item])}`);
  }

  return result.join(",");
}

//SQL语句: 排序和数量限制
function createSortAndLimit(queryObj: any) {
  let sort = [],
    Limit = null;

  for (let item in queryObj.Sort) {
    sort.push(`
      ${item} ${queryObj.Sort[item] == 1 ? "ASC" : "DESC"}
    `);
  }
  Limit = queryObj.Limit;

  return {
    SORT: sort.join(","),
    LIMIT: Limit,
  };
}

export {
  createCondition,
  createInsertOne,
  createInsertMany,
  createResultField,
  createUpdateField,
  createSortAndLimit
}