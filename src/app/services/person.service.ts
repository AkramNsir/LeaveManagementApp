import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, Observable } from 'rxjs';
import { environment } from '../../../environment';
import{ Query, QueryObjectsModel, ReadListDataSourceModel, ObjectKey, QueryParameter, PersistMode, 
  PersistObjectModel, TargetColumnValue, TargetObjectData} from '../models/QueryObjectsModel.Model'

interface Person {
  Mode: number;
  FirstName?: string;
  LastName?: string;
  Position?: string;
  ObjectType?: string;
  Id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private apiUrlReadList = environment.apiUrlReadList
  private apiUrlReadObject = environment.apiUrlReadObject
  private apiUrlPersistObject = environment.apiUrlPersistObject

  
  constructor(private http: HttpClient) {}

  

  public getPersonTest(): Observable<any> {
    const query = this.QueryObjectsModelPersonRead('Person');
    return this.http.post(this.apiUrlReadObject, query);
  }

  public QueryObjectsModelPersonRead(objectType?: string): QueryObjectsModel {
    const queryPerson: QueryObjectsModel = new QueryObjectsModel();
    const personQuery: Query = new Query();
    personQuery.ObjectType = objectType;
    personQuery.Columns = [
      { Name: 'Id', OPath: 'Id' },
      { Name:'ParentId', OPath: 'ParentId'},
      { Name: 'FirstName', OPath: 'FirstName' },
      { Name: 'LastName', OPath: 'LastName' },
      { Name: 'Position', OPath: 'Position' }
    ];
    queryPerson.ObjectQueries = [personQuery];

    return queryPerson;
  }

  public getCurrentUserTest(): Observable<any> {
    const query = this.QueryObjectsModelCurrentUser('Person');
    return this.http.post(this.apiUrlReadObject, query);
  }

  public QueryObjectsModelCurrentUser(objectType?: string): QueryObjectsModel {
    const queryPerson: QueryObjectsModel = new QueryObjectsModel();
    const personQuery: Query = new Query();
    personQuery.ObjectType = objectType;
    personQuery.OPath = "Id = $CurrentUserId"
    personQuery.Columns = [
      { Name: 'Id', OPath: 'Id' },
      { Name:'ParentId', OPath: 'ParentId'},
      { Name: 'FirstName', OPath: 'FirstName' },
      { Name: 'LastName', OPath: 'LastName' },
      { Name: 'Position', OPath: 'Position' }
    ];
    queryPerson.ObjectQueries = [personQuery];

    return queryPerson;
  }

  public getPersonByIdTest(id: string): Observable<any> {
    const query = this.QueryObjectsModelPersonByIdRead(id,'Person');
    return this.http.post(this.apiUrlReadObject, query);
  }

  public QueryObjectsModelPersonByIdRead(id: string, objectType?: string): QueryObjectsModel {
    const queryPerson: QueryObjectsModel = new QueryObjectsModel();
    const personQuery: Query = new Query();
    personQuery.ObjectType = objectType;
    personQuery.OPath = `Id = '${id}'`
    personQuery.Columns = [
      { Name: 'Id', OPath: 'Id' },
      { Name: 'FirstName', OPath: 'FirstName' },
      { Name: 'LastName', OPath: 'LastName' },
      { Name: 'Position', OPath: 'Position' }
    ];
    queryPerson.ObjectQueries = [personQuery];

    return queryPerson;
  }

  public insertPersonTest(person: Person): Observable<any> {
    person.ObjectType = 'Person'
    const query = this.QueryObjectsModelPersonInsert(person);
    return this.http.post(this.apiUrlPersistObject, query);
  }

  public QueryObjectsModelPersonInsert(person: Person): PersistObjectModel {
    const targetColumns: TargetColumnValue[] = [
      { Name: 'FirstName', Value: person.FirstName },
      { Name: 'LastName', Value: person.LastName},
      { Name: 'Position', Value: person.Position},
    ];

    const assetPersistQuery: TargetObjectData = new TargetObjectData();
    assetPersistQuery.ObjectKey = new ObjectKey();
    assetPersistQuery.ObjectKey.ObjectType = person.ObjectType;
    assetPersistQuery.Mode = person.Mode;
    if(person.Mode == 0) {
      assetPersistQuery.TargetColumns = targetColumns;
    } else if(person.Mode == 1) {
      assetPersistQuery.TargetColumns = targetColumns;
      assetPersistQuery.ObjectKey.Id = person.Id;
    } else if(person.Mode == 3) {
      assetPersistQuery.ObjectKey.Id = person.Id;
    }

    const persistObject: PersistObjectModel = new PersistObjectModel();
    persistObject.Object = assetPersistQuery;
    

    return persistObject;
  }


  public getPickTest(): Observable<any> {
    const query = this.createReadListDataSourceModel('Person');
    return this.http.post(this.apiUrlReadList, query);
  }


  public createReadListDataSourceModel(objectType?: string): ReadListDataSourceModel {
    const readListModel = new ReadListDataSourceModel();
    readListModel.ObjectKey = new ObjectKey();
    readListModel.ObjectKey.ObjectType = objectType;
  
    readListModel.ColumnName = 'Position';

    return readListModel;
  }


}
