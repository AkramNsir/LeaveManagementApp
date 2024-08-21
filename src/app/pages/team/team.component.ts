import { Component, OnInit } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  PersonsComponent = PersonsComponent
}
