import Error from "../util/Error";

function getType(obj: any): string {
  var x = Object.prototype.toString.call(obj);
  return x.replace(/(object|\[|\]|\s)/g, "").toLocaleLowerCase();
}

function itemTypeCheck(Enitiy: any, tableName: string, item_obj: any) {
  for (let item of item_obj) {
    if (!Enitiy[tableName][item]) {
      return {
        code: 105,
        message: `There is no "${item}" field in ${tableName}!`,
      };
    }
  }
  return false;
}

function columnsCheck(Enitiy: any, tableName: string, columns_obj: any) {
  for (let item in columns_obj) {
    if (!Enitiy[tableName][item]) {
      return {
        code: 105,
        message: `There is no "${item}" field in ${tableName}...`,
      };
    } else if (getType(columns_obj[item]) == "object") {
      continue;
    } else if (Enitiy[tableName][item] != getType(columns_obj[item])) {
      return {
        code: 106,
        message: `This { ${item}: ${columns_obj[item]} } value should be of "${Enitiy[tableName][item]}" type!`,
      };
    }
  }
  return false;
}

function manySaveCheck(obj: any) {
  return Array.isArray(obj)
    ? false
    : {
        code: 113,
        message:
          "This set_ManySave() or many_Save of value Must be of 'array' type!",
      };
}

function sortCheck(Enitiy: any, tableName: string, columns_obj: any) {
  for (let item in columns_obj) {
    if (getType(columns_obj[item]) == "object") {
      continue;
    } else if (!Enitiy[tableName][item]) {
      return {
        code: 105,
        message: `There is no "${item}" field in ${tableName}...`,
      };
    } else if (columns_obj[item] != 1 && columns_obj[item] != -1) {
      return {
        code: 107,
        message: `${item} is only going to be "1 or -1" in order!`,
      };
    }
  }
  return false;
}

export default function typeCheck(
  Enitiy: any,
  queryObj: any,
  Opera_Type: number
) {
  let tableName = queryObj.tableName;
  return new Promise((resolve, reject) => {
    if (!Enitiy[tableName]) {
      reject(
        Error({
          code: 104,
          message: `Not found table of "${tableName}"`,
        })
      );
    }

    if (
      Opera_Type == 1 &&
      !queryObj.one_Save &&
      Opera_Type == 1 &&
      !queryObj.many_Save
    ) {
      reject(
        Error({
          code: 109,
          message: "This save message not to be null!",
        })
      );
    }

    let OneSave =
      queryObj.one_Save && Opera_Type == 1
        ? columnsCheck(Enitiy, tableName, queryObj.one_Save)
        : false;

    let ManySave =
      queryObj.many_Save && Opera_Type == 1
        ? manySaveCheck(queryObj.many_Save)
        : false;

    let Result = queryObj.resultField
      ? itemTypeCheck(Enitiy, tableName, queryObj.resultField)
      : false;
    let UnResult = queryObj.unResultField
      ? itemTypeCheck(Enitiy, tableName, queryObj.unResultField)
      : false;
    let Upadte = queryObj.updateField
      ? columnsCheck(Enitiy, tableName, queryObj.updateField)
      : false;
    let And = queryObj.condition_And
      ? columnsCheck(Enitiy, tableName, queryObj.condition_And)
      : false;
    let Or = queryObj.condition_Or
      ? columnsCheck(Enitiy, tableName, queryObj.condition_Or)
      : false;
    let Link = queryObj.condition_Like
      ? itemTypeCheck(Enitiy, tableName, Object.keys(queryObj.condition_Like))
      : false;
    let Sort = queryObj.Sort
      ? sortCheck(Enitiy, tableName, queryObj.Sort)
      : false;
    let Limit = queryObj.Limit ? typeof queryObj.Limit : null;

    let JoinField = queryObj.joinField 
      ? itemTypeCheck(Enitiy, queryObj.joinName, queryObj.joinField)
      : false;
    let JoinUnField = queryObj.joinUnField
      ? itemTypeCheck(Enitiy, queryObj.joinName, queryObj.joinUnField)
      : false;

    !OneSave ? OneSave : reject(Error(OneSave));
    !ManySave ? ManySave : reject(Error(ManySave));
    !Result ? Result : reject(Error(Result));
    !UnResult ? UnResult : reject(Error(UnResult));
    !Upadte ? Upadte : reject(Error(Upadte));
    !And ? And : reject(Error(And));
    !Or ? Or : reject(Error(Or));
    !Link ? Link : reject(Error(Link));
    !Sort ? Sort : reject(Error(Sort));
    !JoinField ? JoinField : reject(Error(JoinField));
    !JoinUnField ? JoinUnField : reject(Error(JoinUnField));

    if (Limit) {
      Limit == "number"
        ? Limit
        : reject(
            Error({
              code: 108,
              message: 'This Limit should be of "number" type!',
            })
          );
    }

    resolve(null);
  });
}
