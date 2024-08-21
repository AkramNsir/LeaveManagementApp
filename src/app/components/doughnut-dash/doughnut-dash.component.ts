import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import { lastValueFrom } from 'rxjs';
import { PersonService } from '../../services/person.service';
import { Console } from 'node:console';

@Component({
  selector: 'app-doughnut-dash',
  templateUrl: './doughnut-dash.component.html',
  styleUrl: './doughnut-dash.component.css'
})
export class DoughnutDashComponent implements OnInit {
  isLoading = true;

  absences: any[] = [];
  currentUser: any[] = [];
  leaveTypeOptions: {Value: string, Description: string}[] = [];

  absencesByType: {type: string; val: number;}[] = [];

  totalAbsences = 0;


  constructor(private absenceService: AbsenceService, private personService: PersonService){}

  ngOnInit() {
    this.loadData()
  }

  async loadData() {
    try{
      await this.getCurrentUser()
      await this.getPickAbsenceType()
      await this.getAbsences()
      this.prepareDataSource()
    } catch(error) {
      console.error('Error in loading data: ', error);
    } finally {
      this.isLoading = false;
    }
  }

  async getCurrentUser() {
    try {
      const data = await lastValueFrom(this.personService.getCurrentUserTest());
      this.currentUser = data.map((person: { Id: string, FirstName: string, LastName: string, Position: string }) => ({
        ...person,
        FullName: `${person.FirstName} ${person.LastName}`
      }));
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }

  async getPickAbsenceType() {
    try {
      const data = await this.absenceService.getPickTest('Type').toPromise();
      this.leaveTypeOptions = data.Data;
    } catch (error) {
      console.error('Error fetching pick types:', error);
    }
  }

  async getAbsences() {
    try {
      const data = await this.absenceService.getAbsenceTest().toPromise();
      this.absences = data.filter((absence: any) => absence.ParentId === this.currentUser[0].Id);
    } catch (error) {
      console.error('Error fetching absences:', error);
    }
  }

  prepareDataSource() {
    const current = new Date()
    this.absencesByType = this.leaveTypeOptions.map(typeOption => {
      const totalDuration = this.absences
        .filter(absence => absence.Type === Number(typeOption.Value))
        .reduce((sum, absence) => {
          let start = new Date(absence.StartDate);
          let end = new Date(absence.EndDate);
  
          if(!this.compareDates(start,current) && !this.compareDates(end,current)) {
            // console.log('zouz mouch mriglin')
            return sum + 0;

          } else if(!this.compareDates(start,current)) {
            // console.log('start mouch mrigla')
            let count = 0
            let depart = new Date(current.getFullYear(),0,1);
            while(depart <= end) {
              count++;
              depart = this.addDays(depart, 1) 
            }
            return sum + count;

          } else if(!this.compareDates(end,current)) {
            // console.log('end mouch mrigla')
            let count = 0
            let arrival = this.addDays(new Date(current.getFullYear(),11,31),1);
            // let arrival = new Date(current.getFullYear(),11,31);
            while(start < arrival) {
              count++;
              start = this.addDays(start, 1) 
            }
            return sum + count;

          } else {
            // console.log('zouz mriglin')
            return sum + (Math.abs(absence.Days) || 0)
          }
        }, 0);
      return { type: typeOption.Description, val: totalDuration };
    });

    this.totalAbsences = this.absencesByType.reduce((sum, absence) => sum + absence.val, 0);
  }

  compareDates(year1: Date, year2: Date): boolean {
    return new Date (year1).getFullYear() === new Date (year2).getFullYear();
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
}
