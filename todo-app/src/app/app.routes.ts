import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { OtpComponent } from './otp/otp.component';   
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ResetComponent } from './reset/reset.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'otp', component: OtpComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'inventory', component: InventoryComponent},
  { path: 'reset', component: ResetComponent}
];