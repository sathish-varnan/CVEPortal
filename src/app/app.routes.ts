import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { CustomerDashboardComponent } from './component/customer-dashboard/customer-dashboard.component';
import { CustomerProfileComponent } from './component/customer-profile/customer-profile.component';
import { CustomerFinanceSheetComponent } from './component/customer-finance-sheet/customer-finance-sheet.component';
import { CustomerLoginComponent } from './component/customer-login/customer-login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent,
  },
  {
    path: 'customer/login',
    component: CustomerLoginComponent
  },
  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CustomerDashboardComponent
      },
      {
        path: 'dashboard',
        component: CustomerDashboardComponent
      },
      {
        path: 'profile',
        component: CustomerProfileComponent
      },
      {
        path: 'financesheet',
        component: CustomerFinanceSheetComponent
      },
    ]
  },
  {
    path: 'vendor',
    component: VendorComponent
  },
  {
    path: 'employee',
    component: EmployeeComponent
  }
];
