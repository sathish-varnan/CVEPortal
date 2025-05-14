import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-employee-sidenav',
  imports: [MatIconModule, MatListModule, RouterLink, RouterLinkActive],
  templateUrl: './employee-sidenav.component.html',
  styles: ``
})
export class EmployeeSidenavComponent {
  router = inject(Router);

  onLogout() {
    this.router.navigate(['/']);
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

