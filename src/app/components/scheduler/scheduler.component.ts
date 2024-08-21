import { Component } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import { PersonService } from '../../services/person.service';
import { start } from 'repl';

type EventType = 'Urlaub' | 'Krank' | 'Zeitausgleich' | 'Berufsschule' | 'Bildungsurlaub' | 'Sonderurlaub' | 
'Mutterschutz' | 'Elternzeit' | 'Krank (Kind)';

interface EventData {
  type: EventType;
  text: String;
  startDate: Date | null;
  endDate: Date |null;
  description: string;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css'
})
export class SchedulerComponent {
  isLoading: boolean = true;
  dataSource: EventData[] = [];
  leaveTypeOptions: any[] = [];
  absences: any[] = [];
  person: any[]=[];

  currentDate: Date = new Date();

  // eventTypes: { [key in EventType]: string } = {
  //   'Urlaub': '#B9F3FC', 
  //   'Krank': '#CDFADB', 
  //   'Zeitausgleich': '#FFC5C5',
  //   'Berufsschule': '#FDFDBD',
  //   'Bildungsurlaub': '#DBD5EF',
  //   'Sonderurlaub': '#E7D4B5',
  //   'Mutterschutz': '#FFC96F',
  //   'Elternzeit': '#B3C8CF',
  //   'Krank (Kind)': '#D2D180',
  // };

  eventTypes: { [key in EventType]: string } = {
    'Urlaub': '#94D1E4',  // Slightly darker blue
    'Krank': '#A0E4B6',  // Slightly darker green
    'Zeitausgleich': '#FF9999',  // Slightly darker red
    'Berufsschule': '#F7F39E',  // Slightly darker yellow
    'Bildungsurlaub': '#BFA4E6',  // Slightly darker purple
    'Sonderurlaub': '#D2B08D',  // Slightly darker sandy brown
    'Mutterschutz': '#FFB84D',  // Slightly darker orange
    'Elternzeit': '#8BA9B3',  // Slightly darker light blue
    'Krank (Kind)': '#B6C030'  // Slightly darker yellow-green
  };

  constructor(private absenceService: AbsenceService, private personService: PersonService){}

  ngOnInit() {
    this.prepareDataSource();
  }

  async getAbsences() {
    try {
      this.absences = await this.absenceService.getAbsenceTest().toPromise();
      // console.log(this.absences);
    } catch (error) {
      console.error('Error fetching absences:', error);
    }
  }

  async getPickAbsenceType() {
    try {
      const data = await this.absenceService.getPickTest('Type').toPromise();
      this.leaveTypeOptions = data.Data;
      // console.log("types:", this.leaveTypeOptions);
    } catch (error) {
      console.error('Error fetching pick types:', error);
    }
  }

  async prepareDataSource() {
    try {
      await this.getPickAbsenceType();
    await this.getAbsences();

     this.dataSource = [];

    for (const absence of this.absences) {
      let startDate = absence.StartDate ? new Date(absence.StartDate) : null;
      let endDate = absence.EndDate ? new Date(absence.EndDate) : null;
      const type = this.leaveTypeOptions[absence.Type]?.Description || '';
      const duration = absence.Days;

      if(startDate && endDate) {
        if(duration < 0) {
            startDate.setHours(9, 0, 0); 
            endDate.setHours(13, 0, 0); 
        } else if(duration == 0.5) {
            startDate.setHours(14, 0, 0); 
            endDate.setHours(18, 0, 0); 
        } else if(duration == 1) {
            startDate.setHours(0, 0, 0); 
            endDate.setHours(24, 0, 0); 
        } else {
            startDate.setHours(0, 0, 0); 
            endDate.setHours(23, 59, 59); 
        }
      }

      await this.getPersonById(absence.ParentId);
  
      this.dataSource.push({
        type: type,
        text: this.getPersonFullName(this.person) || '',
        startDate: startDate,
        endDate: endDate,
        description: type
      });
    }
  
    // console.log('DataSource:', this.dataSource);
    } catch(error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }  
  }

  async getPersonById(id: string) {
    try {
      const data = await this.personService.getPersonByIdTest(id).toPromise();
      this.person = data;
    } catch (error) {
      console.error('Error fetching person by id:', error);
    }
  }

  getPersonFullName(person: any) {
    if (!person || !person[0]) {
      return '';
    }
    return `${person[0].FirstName} ${person[0].LastName}`;
  }

  onAppointmentRendered(e: any) {
    const eventType = e.appointmentData.type as EventType;
    const color = this.eventTypes[eventType];
    if (color) {
      e.appointmentElement.style.backgroundColor = color;
    }
  }
}
