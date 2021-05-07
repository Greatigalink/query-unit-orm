const chalk = require('chalk');
const ERROR = chalk.bold.red;
const WARNING = chalk.bold.yellow;

interface ERROR {
  code: number;
  message: string;
}

interface WARNING {
  code: number,
  message: string
}

function QUOError(errorObj: ERROR): string {
  return ERROR(`\nquery-unit-orm[ERROR] errorCode: #${errorObj.code}\n<<<<\n  Message: ${errorObj.message}\n>>>>`);
}

function QUOWarning(warningObj: WARNING): string {
  return WARNING(`\nquery-unit-orm[WARNING] warningCode: #${warningObj.code}\n<<<<\n  Message: ${warningObj.message}\n>>>>`)
}

export {
  QUOError,
  QUOWarning
}
