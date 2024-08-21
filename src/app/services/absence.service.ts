import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';import{ Query, QueryObjectsModel, ReadListDataSourceModel, ObjectKey, 
  PersistObjectModel, TargetColumnValue, TargetObjectData} from '../models/QueryObjectsModel.Model'
import { environment } from '../../../environment';


interface Absence {
  Mode: number;
  Person?:string,
  StartDate?: Date,
  EndDate?: Date,
  Type?: string,
  Duration?: number,
  Status?: string,
  IsApproved?: string,
  RequestDate?: Date,
  Substitute?: string,
  ObjectType?: string;
  Id?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private apiUrlReadList = environment.apiUrlReadList
  private apiUrlReadObject = environment.apiUrlReadObject
  private apiUrlPersistObject = environment.apiUrlPersistObject

  constructor(private http: HttpClient) { }


  public getAbsenceTest(): Observable<any> {
    const query = this.QueryObjectsModelAbsence('Absence');
    return this.http.post(this.apiUrlReadObject, query);
  }

  public QueryObjectsModelAbsence(objectType?: string): QueryObjectsModel {
    const queryAbsence: QueryObjectsModel = new QueryObjectsModel();
    const absenceQuery: Query = new Query();
    absenceQuery.ObjectType = objectType;
    absenceQuery.Columns = [
      {Name: 'Id', OPath: 'Id'},
      { Name:'ParentId', OPath: 'ParentId'},
      { Name: 'StartDate', OPath: 'StartDate' },
      { Name: 'EndDate', OPath: 'EndDate' },
      { Name: 'Type', OPath: 'Type' },
      { Name: 'Days', OPath: 'Days' },
      { Name: 'ProcessState', OPath: 'ProcessState' },
      { Name: 'IsApproved', OPath: 'IsApproved'},
      { Name: 'ApplicantDate', OPath: 'ApplicantDate' },
      { Name: 'IdRefPersonSubstitution', OPath:'IdRefPersonSubstitution'}
    ];
    queryAbsence.ObjectQueries = [absenceQuery];

    return queryAbsence;
  }

  public insertAbsenceTest(absence: Absence): Observable<any> {
    absence.ObjectType = 'Absence'
    const query = this.QueryObjectsModelAbsenceInsert(absence);
    return this.http.post(this.apiUrlPersistObject, query);
  }

  public QueryObjectsModelAbsenceInsert(absence: Absence): PersistObjectModel {
    const targetColumns: TargetColumnValue[] = [
      // { Name: 'Person', Value: absence.Person },
      { Name:'ParentId', Value: absence.Person},
      { Name: 'Type', Value: absence.Type},
      { Name: 'StartDate', Value: absence.StartDate},
      { Name: 'EndDate', Value: absence.EndDate},
      { Name: 'Days', Value: absence.Duration},
      { Name: 'ProcessState', Value: absence.Status},
      { Name: 'IsApproved', Value: absence.IsApproved},
      { Name: 'ApplicantDate', Value: absence.RequestDate},
      { Name: 'IdRefPersonSubstitution', Value:absence.Substitute}
    ];

    const assetPersistQuery: TargetObjectData = new TargetObjectData();
    assetPersistQuery.ObjectKey = new ObjectKey();
    assetPersistQuery.ObjectKey.ObjectType = absence.ObjectType;
    assetPersistQuery.Mode = absence.Mode;
    if(absence.Mode == 0) {
      assetPersistQuery.TargetColumns = targetColumns;
    } else if(absence.Mode == 1) {
      assetPersistQuery.TargetColumns = targetColumns;
      assetPersistQuery.ObjectKey.Id = absence.Id;
    } else if(absence.Mode == 3) {
      assetPersistQuery.ObjectKey.Id = absence.Id;
    }

    const persistObject: PersistObjectModel = new PersistObjectModel();
    persistObject.Object = assetPersistQuery;
    

    return persistObject;
  }

  public getPickTest(listName: string): Observable<any> {
    const query = this.createReadListDataSourceModel(listName, 'Absence');
    return this.http.post(this.apiUrlReadList, query);
  }


  public createReadListDataSourceModel(listName:string, objectType?: string): ReadListDataSourceModel {
    const readListModel = new ReadListDataSourceModel();
    readListModel.ObjectKey = new ObjectKey();
    readListModel.ObjectKey.ObjectType = objectType;
  
    readListModel.ColumnName = listName;

    return readListModel;
  }
}
