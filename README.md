# simply-db

# 目录

* [快速开始](#下载安装)
  * [创建文件](#创建文件)
    * [index.js](#indexjs)
    * [config.yml](#configyml)
  * [开始使用](#开始使用)
* [完整配置示例](#完整配置示例)
  * [mongodb](#mongodb)
  * [mysql](#mysql)
* [详细文档](#详细文档)
  * [配置与连接](#配置与连接)
    * [setPath](#setPath)
    * [setConfigFile](#setConfigFile)
    * [setDataBaseConfig](#setDataBaseConfig)
    * [beginBuild](#beginBuild)
  * [Query](#Query)



## 下载安装

> npm i simply-db

> cnpm i simply-db

## 创建文件

> 选择一个目录用来存放两个基础配置文件，目录结构如下

* dataBase //目录名随意
  * index.js
  * config.yml

### index.js

> 加载数据库对象

```javascript
const { Simply_DataBase } = require('simply-db');

let db = new Simply_DataBase(__dirname);
//创建一个数据库连接对象
//设置__dirname 之后，可以自动读取同目录下的配置文件 config.yml，或者可以自行设置目录位置
db.beginBuild();
//初始化数据库对象并连接

module.exports = db;
//导处该对象并在您想用的地方使用它
```

### config.yml

> 配置数据库及实体映射

```yml
# 数据库配置
DATABASE:

  # 指定数据库，目前支持 mongodb、mysql
  name: mongodb

  # 连接地址
  url: mongodb://localhost:27017/my_database

  # 对于 mysql
  # host: 127.0.0.1
  # port: 3306
  # database: ry

  # 认证信息
  authorization:
    user: greatiga
    pass: 123456

# 实体映射
ENTITYMAP:

  # 表名或者集合名
  user:
    # 集合 user，存储用户信息的集合
    # 设置字段及其对应的类型，以数组的形式
    String: [ user_name, user_pwd, user_email ]
    Number: [ user_phone ]
    Array: [ user_friend ]
    ObjectId: [ _id ]
```

## 开始使用

> 简单实例

```javascript
const { Simply_DataBase } = require('simply-db');

//读取目录下的 config.yml 配置文件
let db = new Simply_DataBase(__dirname);

//开始构建连接
db.beginBuild().then(
  res => Select(),
  err => console.log(err)
)

//查询 user 集合中指定结果字段的两条数据
async function Select() {
  let user = new db.Query("user");
  user.set_ResultField(["user_name", "user_pwd", "user_email", "user_phone", "user_friend"]);
  user.set_Limit(2)
  let result = await db.Find(user);
  console.log(result);
}
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

* 假定有两个集合，可以如下配置

* user

| _id | user_name | user_pwd | user_email | user_phone | user_age | user_friend |
|  :----:  | :----:  | :----: | :----: | :----: | :----: | :----: |
| 1 | greatiga | 123456 | greatiga@126.com | 10086 | 21 | ['bob', 'tom'] |
| 2 | tom | 123 | tom@126.com | 1008611 | 22 | ['bob', 'tom'] |

* food

| id | food_price | food_id | food_intro | food_classify | food_name |
|  :----:  | :----:  | :----: | :----: | :----: | :----: |
| 1 | $6 | 2020 | 美味 | 水果 | 21 | 火龙果 |

```yml
DATABASE:
  name: mongodb
  url: mongodb://localhost:27017/my_database
  authorization:
    user: greatiga
    pass: 123456

ENTITYMAP:
  user:
    String: [ user_name, user_pwd, user_email ]
    Number: [ user_phone ]
    ObjectId: [ _id ]
    Array: [ user_friend ]

  food:
    String: [food_intro, food_classify, food_name]
    Number: [id, food_price, food_id]
```

### mysql

> 假定有表 sys_food 和 sys_student ；与上面同理，相同的设置方式

```yml
DATABASE:
  name: mysql
  host: localhost
  port: 3306
  dataBase: test
  authorization:
    user: greatiga
    pass: 123456

ENTITYMAP:
  sys_food:
    String: [food_intro, food_classify, food_name]
    Number: [id, food_price, food_id]
  sys_student:
    String: [student_name, student_hobby, student_sex, student_birthday]
    Number: [student_id, student_age]
```

## 详细文档

### 连接与配置

#### setPath

> 设置配置文件路径，在需要动态改变时在使用它，否则建议 beginBuild() 时用 __dirname 作为参数传入，让程序帮你读取

```javascript
db.setPath('../../dataBase/config.yml');
```

#### setConfigFile

> 设置配置文件原始内容，即全为字符串的原始文件内容，这里依然建议使用 beginBuild() 传入并让程序读取文件内容

```javascript
let configFile = "...(原始字符串内容)"
db.setConfigFile(configFile);
```

#### setDataBaseConfig

> 设置可以解析的配置对象。本步骤旨在不使用 config.yml 的前提下，自行传入可执行配置对象

```javascript
let config = {
  DATABASE: {
    name: "mongodb",
    url: "mongodb://localhost:27017/great_blog",
    type_check: true,
    authorization: {
      user: "greatiga",
      pass: 123
    }
  },
  ENTITYMAP: {
    user: {
      String: "user_name, user_pwd, user_email",
      Number: "user_phone",
    }
  }
}
db.setDataBaseConfig(config);
```

#### beginBuild

> 开始构建连接，并初始化

```javascript
//方式一
const { Simply_DataBase } = require('simply-db');
let db = new Simply_DataBase(); 
db.setPath("../../dataBase/config.yml");
db.beginBuild();

//方式二
const { Simply_DataBase } = require('simply-db');
let db = new Simply_DataBase();
db.setConfigFile(configFile)//setConfigFile 的方式
db.beginBuild();

//方式三
const { Simply_DataBase } = require('simply-db');
let db = new Simply_DataBase();
db.setDataBaseConfig(config)//setDataBaseConfig 的方式配置对象
db.beginBuild();

//推荐方式 __dirname 作为参数传入
const { Simply_DataBase } = require('simply-db');
let db = new Simply_DataBase(__dirname);
db.beginBuild();
```

> __dirname是当前目录路径，全局变量直接使用，不需要定义，当然也可以自己传入别的路径作为参数

### Query