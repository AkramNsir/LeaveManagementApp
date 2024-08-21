import { Component } from '@angular/core';
import { LeavesComponent } from '../../components/leaves/leaves.component';

@Component({
  selector: 'app-all-leaves',
  templateUrl: './all-leaves.component.html',
  styleUrl: './all-leaves.component.css'
})
export class AllLeavesComponent {
  LeavesComponent = LeavesComponent;
}
