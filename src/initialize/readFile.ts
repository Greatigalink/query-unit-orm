const fs = require("fs");

export default function readFile(filePath: string) {
  if(!/.config\.yml/g.test(filePath)) {
    filePath = `${filePath}/config.yml`;
  }
  return new Promise((resolve: (value: string) => void, reject) => {
    fs.readFile(filePath, function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        let str: string = data.toString();
        resolve(str);
      }
    });
  });
}