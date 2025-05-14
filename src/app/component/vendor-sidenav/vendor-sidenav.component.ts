import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
};

@Component({
  selector: 'app-vendor-sidenav',
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './vendor-sidenav.component.html',
  styles: ``
})
export class VendorSidenavComponent {

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
      icon: 'receipt_long',
      label: 'Goods Receipt',
      route: 'goods-receipt'
    },
    {
      icon: 'shopping_cart',
      label: 'Purchase Order',
      route: 'purchase-order'
    },
    {
      icon: 'request_quote',
      label: 'Quotation request',
      route: 'request-for-quotation'
    },
    {
      icon: 'receipt',
      label: 'Invoice details',
      route: 'invoice-details'
    },
    {
      icon: 'currency_rupee',
      label: 'Payments',
      route: 'payments-and-aging'
    },
    {
      icon: 'event_note',
      label: 'Credit/Debit',
      route: 'credit-debit-memos'
    }
  ]);

}
