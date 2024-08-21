import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { AuthService } from '../../services/auth.service';
import { AbsenceService } from '../../services/absence.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.css'
})
export class LeavesComponent implements OnInit{
  isLoading: boolean = true;

  dataSource: any[] = [];
  absences: any[] = [];  
  substitutesMap: Map<string, string> = new Map();

  substitutes: any[] = [];
  
  processStatesOptions: {Value: string, Description: string}[] = [];
  leaveTypeOptions: {Value: string, Description: string}[] = [];
  isApprovedOptions: {Value: string, Description: string}[] = [];

  constructor(private personService: PersonService, private absenceService: AbsenceService, private authService: AuthService, private router: Router){}

  ngOnInit(){
    this.loadData()
  }

  
  getPersons() {
    this.personService.getPersonTest().subscribe(
      data => {
        this.substitutes = data
          .map((person: { Id: string, FirstName: string, LastName: string, Position: string }) => ({
            ...person,
            FullName: `${person.FirstName} ${person.LastName}`
          }));
          this.substitutes.forEach(person => {
          this.substitutesMap.set(person.Id, person.FullName);
        });
          //console.log('substitues:', this.substitutes);
          // console.log('substitues map',this.substitutesMap)
      },
      error => {
        console.error('Error fetching persons:', error);
      }
    );
  }

  getAbsences() {
    this.absenceService.getAbsenceTest().subscribe(data=> {
      this.absences = data
      // console.log('Absence Id:',data)
    }, error => {
        console.error('Error fetching absences:', error);
      });
  }

  async getPickAbsenceType() {
    try {
      const data = await this.absenceService.getPickTest('Type').toPromise();
      this.leaveTypeOptions = data.Data;
      // console.log("types :", this.leaveTypeOptions);
    } catch (error) {
      console.error('Error fetching pick types:', error);
    }
  }

  getPickProcessStateType() {
    this.absenceService.getPickTest('ProcessState').subscribe(data=> {
      this.processStatesOptions = data.Data
      // console.log("process states:",this.processStatesOptions)
    }, error => {
        console.error('Error fetching pick process states:', error);
      });  
  }

  async getPickIsApprovedType() {
    try {
      const data = await this.absenceService.getPickTest('IsApproved').toPromise();
      this.isApprovedOptions = data.Data;
      // console.log("isApproved states:", this.isApprovedOptions);
    } catch (error) {
      console.error('Error fetching pick isApproved states:', error);
    }
  }

  getPickAbsenceIsApproved() {
    this.absenceService.getPickTest('IsApproved').subscribe(data=> {
      this.isApprovedOptions = data.Data
      // console.log("isApproved:",this.isApprovedOptions)
    }, error => {
        console.error('Error fetching pick isApproved:', error);
      });  
  }

  async loadData() {
    try { 
      await this.getPickAbsenceType()
      await this.getPickIsApprovedType()
      this.getAbsences()
      this.getPersons()  
      this.getPickProcessStateType() 
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false
    }
  }

  getSubstituteName(id: string): string {
    return this.substitutesMap.get(id) || '';
  }

  substituteCellTemplate = (cellElement: any, cellInfo: any) => {
    const substituteName = this.getSubstituteName(cellInfo.data.IdRefPersonSubstitution);
    cellElement.textContent = substituteName;
  }
  
  getDurationDisplayValue(rowData: any){
    return Math.abs(rowData.Days)
  }

  onCellPrepared(e: any) {
    if (e.rowType === 'data' && e.column.dataField === 'IsApproved') {
      const status = e.data.IsApproved
      e.cellElement.style.textTransform = "capitalize";
      if (status == 1) {
        e.cellElement.style.backgroundColor = '#90EE90';
      } else if (status == 2) {
        e.cellElement.style.backgroundColor = '#FF7F7F';
      }
      else if (status == 0) {
        e.cellElement.style.backgroundColor = '#FFFDAF';
      }
    }
  }
}
