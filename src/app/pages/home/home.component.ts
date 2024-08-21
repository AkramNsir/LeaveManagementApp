import { Component } from '@angular/core';
import { MyLeavesComponent } from '../../components/my-leaves/my-leaves.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  MyLeavesComponent = MyLeavesComponent;
}
