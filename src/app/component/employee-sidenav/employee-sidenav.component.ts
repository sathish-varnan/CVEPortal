import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Location } from '@angular/common';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-employee-sidenav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employee-sidenav.component.html',
  styleUrl: './employee-sidenav.component.css'
})
export class EmployeeSidenavComponent {
  router = inject(Router);
  routerNavigator = inject(Location);
  localPrimaryColor = "#1a1f38";
  secondaryColor = "#0075ff";

  onLogout() {
    localStorage.removeItem("employee-id");
    this.router.navigate(['/']);
  }

  onBack() {
    this.routerNavigator.back();
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'account_circle',
      label: 'Profile',
      route: 'profile'
    },
    {
      icon: 'group_remove',
      label: 'Leave data',
      route: 'leave-data'
    },
    {
      icon: 'receipt_long',
      label: 'Pay Slip',
      route: 'pay-slip'
    }

  ]);

}

