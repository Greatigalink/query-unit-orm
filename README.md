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
  
* [接口文档](#接口文档)
  * [配置连接基础](#配置连接基础)
    * [simplyORM](#simplyORM)
    * [setPath](#setPath)
    * [setConfigFile](#setConfigFile)
    * [setDataBaseConfig](#setDataBaseConfig)
    * [beginBuild](#beginBuild)
    * [配置连接的几种方式](#配置连接的几种方式)
  * [配置文件 config.yml 说明](#配置文件config.yml说明)
    * [DATABASE](#DATABASE)
    * [ENTITYMAP](#ENTITYMAP)
  * [查询元](#查询元)
    * [前言](#前言)
    * [Query](#Query)
    * [result_Field](#result_Field)
    * [unResult_Field](#unResult_Field)
    * [update_Field](#update_Field)
    * [and](#and)
    * [or](#or)
    * [like](#like)
  * [操作](#操作)
    * [Find](#Find)
    * [Update](#Update)
    * [Remove](#Remove)
    * [Save](#Save)



## 下载安装

> npm i simply-orm

> cnpm i simply-orm

## 创建文件

> 选择一个目录用来存放两个基础配置文件，目录结构如下

* dataBase //目录名随意
  * index.js
  * config.yml

### index.js

> 加载数据库对象

```javascript
const { simplyORM } = require('simply-orm');

let db = new simplyORM(__dirname);
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
const { simplyORM } = require('simply-orm');

//读取目录下的 config.yml 配置文件
let db = new simplyORM(__dirname);

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

## 接口文档

### 配置连接基础

#### Simply_DataBase

> 构造函数，用于创建一个数据库对象

```javascript
const { simplyORM } = require('simply-orm');
let db = new simplyORM(); 
```

#### setPath

> 设置配置文件路径，在需要动态改变时在使用它，否则建议 beginBuild() 时用 __dirname 作为参数传入，让程序帮你读取

```javascript
db.setPath('../../dataBase/config.yml');
```

#### setConfigFile

> 设置配置文件原始内容，即全为字符串的原始文件内容，这里不建议使用这种方式传入配置文件

```javascript
let configFile = "...(原始字符串内容)"
db.setConfigFile(configFile);
```

#### setDataBaseConfig

> 设置可以解析的配置对象。本步骤旨在不使用 config.yml 的前提下，自行设置可执行的 JavaScript对象

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
      String: ["user_name", "user_pwd", "user_email"],
      Number: ["user_phone"]
    }
  }
}
db.setDataBaseConfig(config);
```

#### beginBuild

> 设置完配置文件或配置对象后， 开始构建连接，程序会帮您连接数据库并初始化

#### 配置连接的几种方式

* 方式一

```javascript
const { simplyORM } = require('simply-orm');
let db = new simplyORM(); 
db.setPath("../../dataBase/config.yml");
db.beginBuild();
```

* 方式二

```javascript
const { simplyORM } = require('simply-orm');
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
      String: ["user_name", "user_pwd", "user_email"],
      Number: ["user_phone"]
    }
  }
}
let db = new simplyORM();
db.setDataBaseConfig(config)//setDataBaseConfig 的方式配置对象
db.beginBuild();
```

* 方式三(推荐方式)

> 将配置文件 config.yml 放在当前目录下。 __dirname值为当前目录路径，全局变量直接使用，不需要定义；当然也可以自己传入指定的路径作为参数，若采用第二种情况则与方式一没什么区别。

```javascript
const { simplyORM } = require('simply-orm');
let db = new simplyORM(__dirname);
//Or
//let db = new Simply_DataBase("../../dataBase/config.yml");
db.beginBuild();
```

### 配置文件config.yml说明

#### DATABASE

> 数据库连接和其他查询配置

```yml
DATABASE:
  name: mongodb
  url: mongodb://localhost:27017/my_database
  # Or
  # host: localhost
  # port: 27017
  # database: my_database
  authorization:
    user: greatiga
    pass: 123456

####################
####################
DATABASE:
  name: mysql
  host: 127.0.0.1
  port: 3306
  database: my_database
  authorization:
    user: greatiga
    pass: 123456
```

* name
  * 数据库名
  * mongodb | mysql

* url
  * mongodb 连接地址
  * mongodb 特有方式，mysql 必须严格指定 ip，端口
  * mongodb://XXX(host):(XXX)port/XXX(dataBase Name)

* host
  * IP: mongodb 和 mysql 都可以这样指定
  * 例如 127.0.0.1

* port
  * 端口: mongodb 和 mysql 都可以这样指定
  * 例如 3306

* dataBase
  * 数据库名: mongodb 和 mysql 都可以这样指定 
  * 例如 my_database

* authorization
  * 认证信息
  * user
    * 用户名
  * password
    * 密码

* type_check
  * 是否开启查询语句检查，开启后将会检查-**查询语句字段是否存在，以及字段类型是否正确**。但是这会损耗查询效率
  * true | false

> **mongodb 可以使用 url 的方式设置连接信息，也可以通过分别设置 host,port等指定。两种方式同时存在时程序以 url 为准**

> **mysql 只能通过设置 host,port等来指定连接信息**

#### ENTITYMAP

> 配置数据库中的表或集合，以及对应字段的类型。type_check 开启后，会根据该配置信息进行检查

```yml
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

* 一级缩进为 ENTITYMAP
* 二级缩进为表名
* 三级缩进为类型，代表后面数组中的字段都是该类型

### Curd

#### 前言

> simply-orm 与其他 ORM 框架一样，主张将原生的 sql 语句与实体对象做映射。

> 首先，每一个不可继续细分的查询语句，都应该包括(属性)和(动作)

* 属性
  * 表名或集合名: 即所要查询的集合或者表格--必须
  * 结果字段: 即查询结果后应展示哪一些表中字段--必须
  * insert数据: 插入时提供的数据--可选
  * 修改字段: 当需要修改时指定修改数据--当修改操作时必须
  * 查询条件: 包括(AND, OR, LIKE)--可选
  * 结果排序: orderBy--可选
  * 数量限制: limit--可选

* 动作
  * find: 根据 **查询条件 + 结果排序(可选) + 数量限制(可选)** 查找
  * update: 根据 **查询条件 + 修改字段** 修改
  * remove: 根据 **查询条件 + 数量限制(可选)** 删除
  * save: 根据 **insert数据** 存储

> 在此基础上，扩展至级联查询(目前还没有做......)

> simply-orm 将这样的一个不可继续细分的查询语句称为**查询元**。对该查询元进行属性约束后，用不同的动作即可对它进行 curd

#### 逻辑谓词

> 参考 mongoose 的写法

```yml
  $gt: >
  $lt: <
  $gte: >=
  $lte: <=
  $ne: !=
```

> **以下为属性部分的操作，由 new db.Query("XX") 产生的对象所拥有**

#### Query

> 请使用上述创建的数据库对象来定义。

* 接受一个参数，值为表格名或者集合名

```yml
DATABASE:
  name: mysql
  ...
  ...
ENTITYMAP:
  user:
    String: [ user_name, user_pwd, user_email ]
    Number: [ user_phone, user_age, user_class ]
    ObjectId: [ _id ]
    Array: [ user_friend ]
```

```javascript
const { simplyORM } = require('simply-orm');
let db = new simplyORM(__dirname);
db.beginBuild().then(() => Test());

async function Test() {
  let user = new db.Query("user");
}
```

> 上述代码创建了一个新的 user(表格/集合) 查询元

#### result_Field

> 结果字段，采用数组的形式指定结果应该包含哪些字段

* 接受一个数组作为参数

> **SQL--SELECT user_name, user_phone, user_email FROM user;**

```javascript
const { simplyORM } = require('simply-orm');
let db = new simplyORM(__dirname);
db.beginBuild().then(() => Test());

async function Test() {
  let user = new db.Query("user");

  user.result_Field(["user_name", "user_phone", "user_email"]);

  let result = await db.Find(user);
  console.log(result);
}
// [
//   {
//     user_name: 'tom',
//     user_email: '123@qq.com',
//     user_phone: 111111,
//   },
//     {
//     user_name: 'bob',
//     user_email: '12344@qq.com',
//     user_phone: 77777,
//   }
// ]
```

#### unResult_Field

> 除指定字段外的所有字段，即: 删除指定的字段，其余都展示

* 接受一个数组作为参数

> **SQL--SELECT _id, user_name, user_pwd, user_friend FROM user;**

```javascript
let user = new db.Query("user");
user.unResult_Field(["user_phone", "user_email"]);
let result = await db.Find(user);
console.log(result);
// [
//   {
//     _id_: 1,
//     user_name: 'tom',
//     user_pwd: 123,
//     user_friend: ['bob'],
//     user_age: 18,
//     user_class: 101
//   },
//   {
//     _id_: 2,
//     user_name: 'bob',
//     user_pwd: 456,
//     user_friend: ['tom'],
//     user_age: 19,
//     user_class: 101
//   },
//   {
//     _id_: 3,
//     user_name: 'hello',
//     user_pwd: xc123,
//     user_friend: ['bob'],
//     user_age: 20,
//     user_class: 102
//   },
// ]
```

> 上述 user_phone 和 user_email 不要，其他都展示

#### update_Field

> 指定修改字段

* 接受一个对象作为参数

> **SQL--UPDATE user SET user_pwd = 789 WHERE user_name = "tom";**

```javascript
let user = new db.Query("user");

user.update_Field({ user_pwd: 789 });
user.and({ user_name: 'tom' });

db.Update(user).then(
  //....
)
```

#### and

> 指定并列条件，优先级最高

* 接受一个对象作为参数

> **SQL--SELECT user_name, user_pwd, user_phone FROM user WHERE user_class = 101 AND user_age > 18;**

```javascript
let user = new db.Query("user");

user.update_Field({ user_pwd: 789 });
user.and({ 
  user_age: { $gt: 18 },
  user_class: 101 
});

let result = await db.Find(user);
consoel.log(result)
//[
//   {
//     _id_: 2,
//     user_name: 'bob',
//     user_pwd: 456,
//     user_friend: ['tom'],
//     user_age: 19,
//     user_class: 101
//   },
//]
```

#### or

> 条件 or

* 接受一个对象作为参数

> **SQL--SELECT user_name, user_pwd, user_phone FROM user WHERE user_class = 101 OR user_age > 18;**

```javascript
let user = new db.Query("user");

user.update_Field({ user_pwd: 789 });
user.or({ 
  user_age: { $gt: 18 },
  user_class: 101 
});

let result = await db.Find(user);
consoel.log(result)
//[
//   {
//     _id_: 1,
//     user_name: 'tom',
//     user_pwd: 123,
//     user_friend: ['bob'],
//     user_age: 18,
//     user_class: 101
//   },
//   {
//     _id_: 2,
//     user_name: 'bob',
//     user_pwd: 456,
//     user_friend: ['tom'],
//     user_age: 19,
//     user_class: 101
//   },
//]
```

#### link

> 模糊匹配

* 接受一个对象作为参数

> **SQL--SELECT user_name, user_pwd, user_phone FROM user WHERE user_name LIKE "he%"**

```javascript
let user = new db.Query("user");

user.like({ user_name: "he%" });

let result = await db.Find(user);
consoel.log(result)
//[
//   {
//     _id_: 3,
//     user_name: 'hello',
//     user_pwd: xc123,
//     user_friend: ['bob'],
//     user_age: 20,
//     user_class: 102
//   },
//]
```

### 操作

> **以下为数据库对象 db(名字取决于你的定义，不代表必须是这个名字) 所拥有，即 new simplyORM() 所创对象**

#### Find

> 对传入的查询元执行查找。

* 异步操作，可使用 await 或 then()

```javascript
let user = new db.Query("user");
//...
db.Find(user);
```

#### Update

> 对传入的查询元执行修改。

* 异步操作，可使用 await 或 then()

```javascript
let user = new db.Query("user");
//...
db.Update(user);
```

#### Remove

> 对传入的查询元执行删除。

* 异步操作，可使用 await 或 then()

```javascript
let user = new db.Query("user");
//...
db.Remove(user);
```

#### Save

> 对传入的查询元执行存储。

* 异步操作，可使用 await 或 then()

```javascript
let user = new db.Query("user");
//...
db.Save(user);
```

