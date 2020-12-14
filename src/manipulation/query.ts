export default class QueryCommon {
  public tableName: string;

  public resultField: Array<string>;
  public unResultField: Array<string>;
  public updateField: object;

  public limit: number;
  public sort: object;

  public condition_And: object;
  public condition_Or: object;
  public condition_Link: object;
  
  public one_Save: object;
  public many_Save: Array<object>;

  public link_Type: string;
  public removeAll: boolean;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.resultField = null;
    this.unResultField = null;
    this.updateField = null;
    this.limit = null;
    this.sort = null;
    this.condition_And = null;
    this.condition_Or = null;
    this.condition_Link = null;
    this.one_Save = null;
    this.many_Save = null;
    this.link_Type = null;
    this.removeAll = false;
  }

  /**
   * set_tableName
   * 设置查询元表名
   */
  public set_tableName(tableName: string) {
    this.tableName = tableName;
  }
  /**
   * set_ResultField
   * 设置查询元结果字段
   */
  public set_ResultField(resultField: Array<string>) {
    this.resultField = resultField;
  }
  /**
   * set_UnResultField
   * 设置不显示的字段
   */
  public set_UnResultField(unResultField: Array<string>) {
    this.unResultField = unResultField;
  }
  /**
   * set_UpdateField
   * 设置查询元修改字段
   */
  public set_UpdateField(updateField: object) {
    this.updateField = updateField;
  }
  /**
   * set_Limit
   * 设置查询元查询结果数量限制
   */
  public set_Limit(limit: number) {
    this.limit = limit;
  }
  /**
   * set_Sort
   * 设置查询元结果排序
   */
  public set_Sort(sort: object) {
    this.sort = sort;
  }
  /**
   * set_ConditionAnd
   * 设置查询元 And条件
   */
  public set_ConditionAnd(condition_And: object) {
    this.condition_And = condition_And;
  }
  /**
   * set_ConditionOr
   * 设置查询元 Or条件
   */
  public set_ConditionOr(condition_Or: object) {
    this.condition_Or = condition_Or;
  }
  /**
   * set_ConditionLink
   * 设置查询元字符匹配字段
   */
  public set_ConditionLink(condition_Link: object, link_Type = "or") {
    this.condition_Link = condition_Link;
    this.link_Type = link_Type;
  }
  /**
   * set_OneSave
   * 创建一条插入语句
   */
  public set_OneSave(one_Save: object) {
    this.one_Save = one_Save;
  }
  /**
   * set_ManySave
   * 创建多条插入语句
   */
  public set_ManySave(many_Save: Array<object>) {
    this.many_Save = many_Save;
  }

}