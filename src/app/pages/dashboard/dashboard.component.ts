import { Component } from '@angular/core';
import { DoughnutDashComponent } from '../../components/doughnut-dash/doughnut-dash.component';
import { BarDashComponent } from '../../components/bar-dash/bar-dash.component';
import { GaugeDashComponent } from '../../components/gauge-dash/gauge-dash.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  DoughnutDashComponent = DoughnutDashComponent;
  BarDashComponent = BarDashComponent;
  GaugeDashComponent = GaugeDashComponent;
}
