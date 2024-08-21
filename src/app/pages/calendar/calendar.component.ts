import { Component } from '@angular/core';
import { SchedulerComponent } from '../../components/scheduler/scheduler.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  SchedulerComponent = SchedulerComponent
}
