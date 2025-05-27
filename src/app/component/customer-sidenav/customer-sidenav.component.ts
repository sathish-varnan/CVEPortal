import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Location } from '@angular/common';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-customer-sidenav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './customer-sidenav.component.html',
  styleUrl: './customer-sidenav.component.css'
})
export class CustomerSidenavComponent {
  router = inject(Router);
  routerNavigator = inject(Location);
  localPrimaryColor = "#1a1f38";
  secondaryColor = "#0075ff";

  onLogout() {
    localStorage.removeItem("customer-id");
    localStorage.removeItem("customer-token");
    this.router.navigate(['/']);
  }

  onBack() {
    this.routerNavigator.back();
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
