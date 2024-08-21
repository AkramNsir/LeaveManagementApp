export class QueryObjectsModel {
  OutputMode: string = 'JSON';
  Indent: boolean = true;
  ObjectQueries?: Query[];
}

export enum QueryColumnSortOrder {
  None = 'NONE',
  Ascending = 'Ascending',
  Descending = 'Descending',
}

export class QueryColumn {
  OPath?: string;
  Name?: string;
  SortOrder?: QueryColumnSortOrder | string = QueryColumnSortOrder.None;
  IsFilter?: boolean = false;
  IsHidden?: boolean = false;
  IsInvariant?: boolean = false;
  Format?: string;
  key?: number;
}

export class QueryBase {
  OPath?: string;
  Name?: string;
  LimitCount?: number;
  LimitOffset?: number;
  IsDistinct?: boolean = false;
  DefaultIfEmpty?: boolean = false;
  Columns?: QueryColumn[] = [];
  ObjectQueries?: QuerySpan[] = [];
  Mode?: PersistMode;
}

export enum PersistMode {
  Insert = 0,
  Update = 1,
  Merge,
  Delete = 3,
}

export class QuerySpan extends QueryBase {
  constructor() {
    super();
  }
}

export class Query extends QueryBase {
  ObjectType?: string;
  
  constructor() {
    super();
  }
}

export class PersistModelBase extends QueryBase {
  Parameters?: ParameterValue[];
}

export class PersistObjectModel extends PersistModelBase {
  Object?: TargetObjectData;
}
 
export class TargetObjectData {
  ObjectKey?: ObjectKey;
  Mode?: PersistMode;
  TargetColumns?: TargetColumnValue[];
}



/* pick list */

export class ParameterValue {
  Name: string;
  Value?: any;
 
  constructor(name: string, value?: any) {
    this.Name = name;
    this.Value = value;
  }
}

export class ReadListDataSourceModel extends QueryBase {
  Id?: string;
  ObjectKey?: ObjectKey;
  ColumnName?: string;
  ContextFilterExpression?: string;
  ObjectSpaceName?: string;
  Parameters?: ParameterValue[];
  TargetColumns?: TargetColumnValue[];
  CustomFilterExpression?: string;
  CustomColumns?: CustomColumn[];
}


export class QueryParameter extends ParameterValue {
  constructor(name: string, value?: any) {
    super(name, value);
  }
}

export class TargetColumnValue {
  Name?: string;
  Value: any;
}

export class CustomColumn {
  Name?: string;
  Caption?: string;
  OPath?: string;
}
 
export class ObjectKey {
  Id?: string;
  ObjectType?: string | number;
}






