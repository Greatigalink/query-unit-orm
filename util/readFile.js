const fs = require('fs');

let deployMsg = (path) => new Promise((resolve, reject) => {
  fs.readFile(`${path}/config.yml`, function(err, data) {
    if(err) {
      reject(err);
    } else {
      resolve(data.toString())
    }
  });
});

module.exports = deployMsg;