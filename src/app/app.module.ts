import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 

import { DxFormModule, DxTextBoxModule, DxButtonModule, DxValidatorModule, DxDrawerModule, DxToolbarModule, 
  DxListModule, DxDataGridModule, DxCalendarModule, DxSchedulerModule, DxSpeedDialActionModule, DxPopupModule,
  DxSelectBoxModule, DxDateBoxModule, DxNumberBoxModule, DxTemplateModule, DxPieChartModule,
  DxCircularGaugeModule, DxBarGaugeModule, DxChartModule} from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NavigationComponent } from './components/navigation/navigation.component';

import { AuthGuard } from './helpers/guards/auth.guard';
import { AuthService } from './services/auth.service';
import { LogComponent } from './pages/log/log.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './helpers/authInterceptor.interceptor';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { LeavesComponent } from './components/leaves/leaves.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { TeamComponent } from './pages/team/team.component';
import { PersonsComponent } from './components/persons/persons.component';
import { AllLeavesComponent } from './pages/all-leaves/all-leaves.component';
import { MyLeavesComponent } from './components/my-leaves/my-leaves.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DoughnutDashComponent } from './components/doughnut-dash/doughnut-dash.component';
import { BarDashComponent } from './components/bar-dash/bar-dash.component';
import { GaugeDashComponent } from './components/gauge-dash/gauge-dash.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { TestComponent } from './pages/test/test.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LogComponent,
    ResetPasswordComponent,
    NavigationComponent,
    UserPanelComponent,
    LeavesComponent,
    CalendarComponent,
    SchedulerComponent,
    TeamComponent,
    PersonsComponent,
    AllLeavesComponent,
    MyLeavesComponent,
    DashboardComponent,
    DoughnutDashComponent,
    BarDashComponent,
    GaugeDashComponent,
    NotFoundComponent,
    LogInComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DxFormModule,
    DxTextBoxModule,
    DxButtonModule,
    DxValidatorModule,
    DxDrawerModule,
    DxToolbarModule,
    DxListModule, 
    DxDataGridModule,
    DxCalendarModule,
    DxSchedulerModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxDateBoxModule, 
    DxNumberBoxModule,
    DxTemplateModule,
    DxPieChartModule,
    DxCircularGaugeModule,
    DxBarGaugeModule,
    DxChartModule,
    HttpClientModule  
  ],
  providers: [
    provideClientHydration(),
    AuthGuard, 
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
