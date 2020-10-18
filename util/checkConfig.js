
function checkMongodb(dataBaseConfig) {
  if(!dataBaseConfig.DATABASE.url)
    return {
      type: 0,
      message: 'must to set URL!'
    }
  else 
    return {
      type: 1,
      message: 'successful!'
    }
}

function checkMySql(dataBaseConfig) {
  if(!dataBaseConfig.DATABASE.host)
    return {
      type: 0,
      message: 'must to set Host!'
    }
  else if(!dataBaseConfig.DATABASE.port)
    return {
      type: 0,
      message: 'must to set port!'
    }
  else if(!dataBaseConfig.DATABASE.database)
    return {
      type: 0,
      message: 'must to set database!'
    }
  else
    return {
      type: 1,
      message: 'successful!'
    }
}

function checkConfigFile(dataBaseConfig) {

  return new Promise((resolve, reject) => {
    if(!dataBaseConfig.DATABASE) 
      reject({
        type: 0,
        message: '缺少数据库配置'
      }) 

    else if(!dataBaseConfig.DATABASE.name) 
      reject({
        type: 0,
        message: 'must to set dataBase Type!'
      })

    else if(!dataBaseConfig.DATABASE.authorization) 
      reject({
        type: 0,
        message: 'must to set dataBase Authorization!'
      })
  
    else if(!dataBaseConfig.TABLE)
      reject({
        type: -1,
        message: '没有发现集合的信息'
      })
  
    else {
      let checkMsg;
      switch(dataBaseConfig.DATABASE.name) {
        case 'mongodb': checkMsg = checkMongodb(dataBaseConfig); break;
        case 'mysql': checkMsg = checkMySql(dataBaseConfig); break;
        default: checkMsg = {
          type: 0,
          message: 'not found the dataBase!'
        };
      }
      if(checkMsg.type == 1) {
        resolve(checkMsg)
      } else {
        reject(checkMsg)
      }
    }

  });

}

module.exports = checkConfigFile;