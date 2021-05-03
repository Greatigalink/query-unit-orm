export default class QueryCommon {
  public tableName: string;

  public resultField: Array<string>;
  public unResultField: Array<string>;
  public updateField: object;

  public Limit: number;
  public Sort: object;

  public condition_And: object;
  public condition_Or: object;
  public condition_Like: object;
  
  public one_Save: object;
  public many_Save: Array<object>;

  public link_Type: string;
  public removeAll: boolean;

  public joinName: string
  public joinField: Array<string>;
  public joinUnField: Array<string>;
  public newlyField: string;
  public masterRelationField: string;
  public fromRelationField: string

  constructor(tableName: string) {
    this.tableName = tableName;
    this.resultField = null;
    this.unResultField = null;
    this.updateField = null;
    this.Limit = null;
    this.Sort = null;
    this.condition_And = null;
    this.condition_Or = null;
    this.condition_Like = null;
    this.one_Save = null;
    this.many_Save = null;
    this.link_Type = null;
    this.removeAll = false;
    this.joinName = null
    this.joinField = null;
    this.joinUnField = null;
    this.newlyField = null;
    this.masterRelationField = null;
    this.fromRelationField = null;
  }

  /**
   * setTableName
   * 设置查询元表名
   */
  public setTableName(tableName: string) {
    this.tableName = tableName;
    return this;
  }
  /**
   * result_Field
   * 设置查询元结果字段
   */
  public result_Field(resultField: Array<string>) {
    this.resultField = resultField;
    return this;
  }
  /**
   * unResult_Field
   * 设置不显示的字段
   */
  public unResult_Field(unResultField: Array<string>) {
    this.unResultField = unResultField;
    return this;
  }
  /**
   * update_Field
   * 设置查询元修改字段
   */
  public update_Field(updateField: object) {
    this.updateField = updateField;
    return this;
  }
  /**
   * limit
   * 设置查询元查询结果数量限制
   */
  public limit(Limit: number) {
    this.Limit = Limit;
    return this;
  }
  /**
   * orderBy
   * 设置查询元结果排序
   */
  public orderBy(Sort: object) {
    this.Sort = Sort;
    return this;
  }
  /**
   * and
   * 设置查询元 And条件
   */
  public and(condition_And: object) {
    this.condition_And = condition_And;
    return this;
  }
  /**
   * or
   * 设置查询元 Or条件
   */
  public or(condition_Or: object) {
    this.condition_Or = condition_Or;
    return this;
  }
  /**
   * like
   * 设置查询元字符匹配字段
   */
  public like(condition_Like: object, link_Type = "or") {
    this.condition_Like = condition_Like;
    this.link_Type = link_Type;
    return this;
  }
  /**
   * oneSave
   * 创建一条插入语句
   */
  public oneSave(one_Save: object) {
    this.one_Save = one_Save;
  }
  /**
   * manySave
   * 创建多条插入语句
   */
  public manySave(many_Save: Array<object>) {
    this.many_Save = many_Save;
  }

  /**
   * join_Name
   */
  public join_Name(joinName: string) {
    this.joinName = joinName;
    return this;
  }

  /**
   * join_Field
   * 聚合管道从表结果展示字段
   */
  public join_Field(joinField: Array<string>) {
    this.joinField = joinField;
    return this;
  }

  /**
   * join_UnField
   * 聚合管道从表结果不展示字段
   */
  public join_UnField(joinUnField: Array<string>) {
    this.joinUnField = joinUnField;
    return this;
  }

  /**
   * newly_Field
   * 设置主表中要添加的关联查询结果字段名称
   */
  public newly_Field(newlyField: string) {
    this.newlyField = newlyField;
    return this;
  }

  /**
   * relation_Fields
   * 设置主从表的关联字段，请注意设置顺序
   * function(masterField: string, fromField: string){}
   */
  public relation_Fields(masterField: string, fromField: string) {
    this.masterRelationField = masterField;
    this.fromRelationField = fromField;
    return this;
  }
}