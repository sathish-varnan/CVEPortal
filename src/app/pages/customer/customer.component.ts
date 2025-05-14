import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet],
  templateUrl: './customer.component.html',
  styles: ``
})
export class CustomerComponent {
  title = 'Customer Portal';
  router = inject(Router);

  onCustomerLogin() {
    this.router.navigate(['/customer']);
  }
}
