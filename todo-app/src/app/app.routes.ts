import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { OtpComponent } from './otp/otp.component';   
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ResetComponent } from './reset/reset.component';
import { StepComponent } from './step/step.component';
import { SaleComponent } from './sale/sale.component';
import { HistoryComponent } from './history/history.component';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'otp', component: OtpComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'inventory', component: InventoryComponent},
  { path: 'reset', component: ResetComponent},
  { path: 'step', component: StepComponent},
  { path: 'sale', component: SaleComponent},
  { path : 'history', component: HistoryComponent},
  { path: 'employee', component: EmployeeComponent}
];