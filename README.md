# database-config

# 目录

* [步骤](#使用)
  * [创建文件](#创建文件)
  * [index.js](#indexjs)
  * [config.yml](#configyml)
  * [开始使用](#开始使用)
* [完整配置示例](#完整配置示例)
  * [mongodb](#mongodb)
  * [mysql](#mysql)

## 下载安装

> npm i database-config

> cnpm i database-config

## 使用

### 创建文件

> 创建一个目录用来存放两个配置文件，以 mongodb 为例

> 目录结构

* mongodb //目录名随意
  * index.js
  * config.yml

### index.js

> 用于加载并导出数据库对象

```javascript
const myDataBase = require('database-config');

let db = new myDataBase(__dirname);
//创建一个数据库连接对象
//设置__dirname 之后，可以自动读取同目录下的配置文件 config.yml，或者可以自行设置目录位置
db.Create();
//初始化数据库对象并连接

module.exports = db;
//导处该对象并在您想用的地方使用它
```

### config.yml

> 配置数据库及其集合、表的相关信息

> 以 mongodb 为例

```yml
# 数据库配置
DATABASE:
  name: mongodb
  # 指定数据库，目前支持 mongodb、mysql
  url: mongodb://localhost:27017/my_database
  # 连接地址 
  authorization:
  # 认证信息
    enable: true
    user: greatiga
    pass: 123456

# 集合映射 针对 mongodb
TABLE:
  
  # 集合名
  user:
    # 集合 user，存储用户信息的集合
    # 设置字段及其对应的类型，以数组的形式
    String: [ user_name, user_pwd, user_email ]
    Number: [ user_phone ]
    Array: [ user_friend ]
    ObjectId: [ _id ]
```

### 开始使用

> 导入上述例子中目录下的 index.js

```javascript
const db = require('./mongodb/index');

db.user.find({ }, {_id: 0}, function(err, data) {
  if(err) return;
  console.log(data);
})

// [
//   {
//     user_name: 'tom',
//     user_pwd: 123,
//     user_email: '123@qq.com',
//     user_phone: 111111,
//     user_friend: [
//       'jack', 'bob'
//     ]
//   },
//     {
//     user_name: 'jack',
//     user_pwd: 12344,
//     user_email: '12344@qq.com',
//     user_phone: 77777,
//     user_friend: [
//       'bob', 'tom'
//     ]
//   }
// ]
```

## 完整配置示例

### mongodb

> 无需在程序中编写 Schema 集合映射。可直接在 config.yml 中写入集合配置，会自动帮您生成对应的 Model 以供使用

* **index.js**

```javascript
const myDataBase = require('database-config');

let db = new myDataBase(__dirname);
db.Create();

module.exports = db;
```

* **config.yml**

```yml
DATABASE:
  name: mongodb
  url: mongodb://localhost:27017/my_database
  authorization:
    enable: true
    user: greatiga
    pass: 123456

TABLE:
  user:
    String: [ user_name, user_pwd, user_email ]
    Number: [ user_phone ]
    ObjectId: [ _id ]
    Array: [ user_friend ]
    ArrayObj:
      user_friend:
        String: [ user_friend_name, user_friend_age ]
        Number: [ user_friend_phone ]
```

* **使用**

```javascript
const db = require('./mongodb/index');

db.user.find({ }, {_id: 0}, function(err, data) {
  if(err) return;
  console.log(data);
})
```

### mysql

* **index.js**

```javascript
const myDataBase = require('database-config');

let db = new myDataBase(__dirname);
db.Create();

module.exports = db;
```

* **config.yml**

```yml
DATABASE:
  name: mysql
  host: localhost
  port: 3306
  dataBase: test
  authorization:
    enable: true
    user: greatiga
    pass: 123456
```

* **使用**

```javascript
const db = require('./mongodb/index');

db.dataBase.query('SELECT * FROM user_table where user_name = 'Greatiga'', function(err, data) {
  if(err) return;
  console.log(data);
})
```