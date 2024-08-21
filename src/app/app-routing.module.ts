import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { LogComponent } from './pages/log/log.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './helpers/guards/auth.guard';
import { LeavesComponent } from './components/leaves/leaves.component';
import { TeamComponent } from './pages/team/team.component';
import { AllLeavesComponent } from './pages/all-leaves/all-leaves.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { TestComponent } from './pages/test/test.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  // {
  //   path: 'log-in',
  //   component: LoginComponent,
  // },
  // {
  //   path: 'log',
  //   component: LogComponent,
  // },
  {
    path: 'login',
    component: LogInComponent,
  },
  // {
  //   path: 'test',
  //   component: TestComponent,
  // },
  // {
  //   path: 'resetPassword',
  //   component: ResetPasswordComponent,
  // },
  {
    path: 'myAbsences',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'allAbsences',
    component: AllLeavesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'team',
    component: TeamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notFound',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'home/leaves',
  //   component: LeavesComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: '**',
    redirectTo: 'notFound',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
