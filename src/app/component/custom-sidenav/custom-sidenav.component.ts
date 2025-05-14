import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-custom-sidenav',
  imports: [MatIconModule, MatListModule, RouterLink, RouterLinkActive],
  templateUrl: './custom-sidenav.component.html',
  styles: ``
})
export class CustomSidenavComponent {
  router = inject(Router);

  onLogout() {
    this.router.navigate(['/']);
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'person',
      label: 'Profile',
      route: 'profile'
    },
    {
      icon: 'receipt',
      label: 'Invoice',
      route: 'invoice-details'
    },
    {
      icon: 'currency_rupee',
      label: 'Payments',
      route: 'payments-and-aging'
    },
    {
      icon: 'bar_chart',
      label: 'Sales Summary',
      route: 'overall-sales-summary'
    },
    {
      icon: 'save',
      label: 'Inquiry',
      route: 'inquiry-data'
    },
    {
      icon: 'real_estate_agent',
      label: 'Sales Order',
      route: 'sales-order-data'
    },
    {
      icon: 'event_note',
      label: 'Credit/Debit',
      route: 'credit-debit-memos'
    },
    {
      icon: 'local_shipping',
      label: 'List of Delivery',
      route: 'list-of-delivery'
    }
  ]);
}
