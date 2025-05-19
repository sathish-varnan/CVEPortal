import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CustomerSidenavComponent } from '../../component/customer-sidenav/customer-sidenav.component';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet,CustomerSidenavComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  router = inject(Router);
}
