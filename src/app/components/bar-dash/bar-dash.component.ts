import { Component } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';


@Component({
  selector: 'app-bar-dash',
  templateUrl: './bar-dash.component.html',
  styleUrl: './bar-dash.component.css'
})
export class BarDashComponent {
  isLoading = true;

  absences: any[] = [];
  dataSource: {month: string, value: number}[] = [];

  constructor(private absenceService: AbsenceService){}


  ngOnInit() {
    this.loadData()
  }

  async loadData() {
    try{
      await this.getAbsences()
      this.prepareDataSource()
    } catch(error) {
      console.error('Error in loading data: ', error);
    } finally {
      this.isLoading = false;
    }
  }

  async getAbsences() {
    try {
      const data = await this.absenceService.getAbsenceTest().toPromise();
      this.absences = data
      // console.log(this.absences)
    } catch (error) {
      console.error('Error fetching absences:', error);
    }
  }

  getDaysInMonth(monthIndex: number, year: number): number {
    const date = new Date(year, monthIndex + 1, 0); 
    return date.getDate(); 
  }

  prepareDataSource() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthTotals: { [key: string]: number } = {};
    monthNames.forEach(month => monthTotals[month] = 0);

    const currentYear = new Date().getFullYear();
     
    this.absences.map(absence => {
      const startDate = new Date(absence.StartDate);
      const endDate = new Date(absence.EndDate);
      const startDay = startDate.getDate()
      const endDay = endDate.getDate()
      const startMonth = startDate.getMonth()
      const endMonth = endDate.getMonth()
      const startYear = startDate.getFullYear()
      const endYear = endDate.getFullYear()

      if(startYear == currentYear || endYear == currentYear) {
        if(startMonth == endMonth && startYear == endYear){
            monthTotals[monthNames[startMonth]] += Math.abs(absence.Days);
        } else if(startMonth != endMonth && startYear == endYear) {
          monthTotals[monthNames[startMonth]] += this.getDaysInMonth(startMonth, startYear) - startDay +1;
          monthTotals[monthNames[endMonth]] += endDay;
        } else if(startYear != currentYear) {
          monthTotals[monthNames[0]] += endDay;
        } else if(endYear != currentYear) {
          monthTotals[monthNames[11]] += this.getDaysInMonth(11, currentYear) - startDay +1;
        }
      } else {
        for(let i=0; i<12; i++) {
          monthTotals[monthNames[i]] += this.getDaysInMonth(i, currentYear);
        }
      }
    });

     this.dataSource = Object.keys(monthTotals).map(month => ({
      month: month,
      value: monthTotals[month]
    }));
    this.isLoading = false;
    // console.log('datasource: ', this.dataSource)
  }
}
