import { Component, OnInit } from '@angular/core';
import { DxCircularGaugeTypes } from 'devextreme-angular/ui/circular-gauge';
import { AbsenceService } from '../../services/absence.service';
import { lastValueFrom } from 'rxjs';
import { PersonService } from '../../services/person.service';
import { log } from 'console';

@Component({
  selector: 'app-gauge-dash',
  templateUrl: './gauge-dash.component.html',
  styleUrl: './gauge-dash.component.css'
})
export class GaugeDashComponent implements OnInit {
  isLoading = true;

  absences: any[] = [];
  currentUser: any[] = [];

  AvgValue = 0;
  TargetValue = 9;
  color = '#fff';
  indecatorColor = '#808080';
  target = `Target < ${this.TargetValue}.0%`

  customizeText(arg: any): string {
    return `${arg.value}%`;
}

  constructor(private absenceService: AbsenceService, private personService: PersonService){}


  ngOnInit() {
    this.loadData()
  }

  async loadData() {
    try {
      await this.getCurrentUser()
      await this.getAbsences()
      this.countWorkingDaysInCurrentYear()
      this.setAvgValue()
      this.setColor()
    } catch(error) {
      console.error('Error in loading data: ', error)
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

  async getAbsences() {
    try {
      const data = await this.absenceService.getAbsenceTest().toPromise();
      // console.log('Raw data:', data);
      this.absences = data.filter((absence: any) => absence.ParentId === this.currentUser[0].Id);
    } catch (error) {
      console.error('Error fetching absences:', error);
    }
  }

  countWorkingDaysInCurrentYear(): number {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); 
    const endDate = new Date(currentYear, 11, 31); 
    let workingDaysCount = 0;
  
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
        workingDaysCount++;
      }
    }
  
    return workingDaysCount;
  }

  getAbsencesDays(): number {
    if (!this.absences || this.absences.length === 0) {
      return 0;
    }
  
    const current = new Date()

    const totalDuration = this.absences.reduce((sum, absence) => {
      let start = new Date(absence.StartDate);
      let end = new Date(absence.EndDate);

      if(!this.compareDates(start,current) && !this.compareDates(end,current)) {
        return sum + 0;

      } else if(!this.compareDates(start,current)) {
        let count = 0
        let depart = new Date(current.getFullYear(),0,1);
        while(depart <= end) {
          count++;
          depart = this.addDays(depart, 1) 
        }
        return sum + count;

      } else if(!this.compareDates(end,current)) {
        let count = 0
        let arrival = this.addDays(new Date(current.getFullYear(),11,31),1);
        while(arrival >= start) {
          count++;
          start = this.addDays(start, 1) 
        }
        return sum + count;

      } else {
        return sum + (Math.abs(absence.Days) || 0)
      }
    }, 0);

    // console.log('absenteeisem:', totalDuration)
  
    return totalDuration;
  }

  compareDates(year1: Date, year2: Date): boolean {
    return new Date (year1).getFullYear() === new Date (year2).getFullYear();
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  setAvgValue() {
    const workingDays = this.countWorkingDaysInCurrentYear()
    const absencesDays = this.getAbsencesDays()
    this.AvgValue = (absencesDays/workingDays) * 100;
    this.AvgValue = parseFloat(this.AvgValue.toFixed(1))
        // console.log('absenteeisem rate:', this.AvgValue)
  }

  setColor(){
    if(this.AvgValue > this.TargetValue) {
      this.color = '#FF7F7F'
    } else {
      this.color = '#90EE90'
    }
    return this.color
  }
}
