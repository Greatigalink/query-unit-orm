const chalk = require('chalk');
const ERROR = chalk.bold.red;

interface ERROR {
  code: number;
  message: string;
}

export default function Error(errorObj: ERROR): string {
  return ERROR(`\n   query-unit-orm[ERROR] errorCode: ${errorObj.code}\n   <<<<\n\tMessage: ${errorObj.message}\n   >>>>`);
}
