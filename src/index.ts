import { analyFile, readFile, checkConfig } from "./initialize/index";
import connect from "./connect/index";
import createModel from "./create_model/index";
import QueryCommon from "./manipulation/query";
import { Save, Remove, Update, Find, typeCheck } from "./manipulation/index";

interface DB {
  name?: string;
  version?: string;
}

interface DBCONFIG {
  [propName: string]: any;
}

export class queryUnitORM {
  public path: string;
  public configFile: string;
  public dataBaseConfig: DBCONFIG;
  private _db: DB;
  public dataBase: any;
  public Query: object;
  public Enitiy: object;
  private TypeCheck: boolean
  constructor(path: string) {
    this.path = path;
    //配置文件路径--Configuration file path
    this.configFile = null;
    //配置文件内容--Profile contents
    this.dataBaseConfig = null;
    //配置文件解析后生成的数据库配置对象--The database configuration object generated after the configuration file is parsed
    this._db = null;
    //数据库信息
    this.dataBase = null;
    //数据库原生对象--Database native object
    this.Query = QueryCommon;
    //查询元
    this.Enitiy = null;
    //实体映射
    this.TypeCheck = null;
  }

  private async ReadFile() {
    this.configFile = this.configFile || (await readFile(this.path));
  }

  private async AnalyFile() {
    this.dataBaseConfig =
      this.dataBaseConfig || (await analyFile(this.configFile));
  }

  private async CheckConfig() {
    this._db = await checkConfig(this.dataBaseConfig);
    let type_check = this.dataBaseConfig.DATABASE.type_check;
    this.TypeCheck = type_check && type_check == "true" ? true : false;
  }

  private async Connect() {
    this.dataBase = await connect(this._db, this.dataBaseConfig);
  }

  private async CreateModel() {
    this.Enitiy = await createModel(this);
    this.addConfig();
  }

  private addConfig() {
    let config = this.dataBaseConfig.DATABASE;
    let keys = Object.keys(config);
    keys.forEach((item) => {
      switch (item) {
        case "type_check":
          this.dataBase[item] = config[item];
          break;
      }
    });
  }

  /**
   * setPath
   * 设置配置文件文件路径
   */
  public setPath(path: string): void {
    this.path = path;
  }
  /**
   * setConfigFile
   * 设置配置文件内容
   */
  public setConfigFile(configFile: string): void {
    this.configFile = configFile;
  }
  /**
   * setDataBaseConfig
   * 设置配置对象
   */
  public setDataBaseConfig(dataBaseConfig: object): void {
    this.dataBaseConfig = dataBaseConfig;
  }
  /**
   * Save
   * 对查询元执行存储操作
   */
  public async Save(query_obj: any) {
    this.TypeCheck ? await typeCheck(this.Enitiy, query_obj, 1) : this.TypeCheck;
    return await Save(this._db, this.dataBase, query_obj);
  }
  /**
   * Remove
   * 对查询元执行删除操作
   */
  public async Remove(query_obj: any) {
    this.TypeCheck ? await typeCheck(this.Enitiy, query_obj, 2) : this.TypeCheck;
    return await Remove(this._db, this.dataBase, query_obj);
  }
  /**
   * Update
   * 对查询元执行修改操作
   */
  public async Update(query_obj: any) {
    this.TypeCheck ? await typeCheck(this.Enitiy, query_obj, 3) : this.TypeCheck;
    return await Update(this._db, this.dataBase, query_obj);
  }
  /**
   * Find
   * 对查询元执行查找操作
   */
  public async Find(query_obj: any) {
    this.TypeCheck ? await typeCheck(this.Enitiy, query_obj, 4) : this.TypeCheck;
    return await Find(this._db, this.dataBase, query_obj, this.Enitiy);
  }

  /**
   * FindOne
   * 执行查询一次操作
   */
  public async FindOne(query_obj: any) {
    this.TypeCheck ? await typeCheck(this.Enitiy, query_obj, 4) : this.TypeCheck;
    let result: any = await Find(this._db, this.dataBase, query_obj, this.Enitiy);
    return result.length > 0 ? result[0] : [];
  }
  /**
   * beginBuild
   * 初始化链接并生成实体映射
   */
  public async beginBuild() {
    await this.ReadFile();
    await this.AnalyFile();
    await this.CheckConfig();
    await this.Connect();
    await this.CreateModel();
  }
}
