import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer-login',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './customer-login.component.html',
  styles: ``
})
export class CustomerLoginComponent {
  router = inject(Router);
  onClick() {
    this.router.navigate(['/customer/dashboard']);
  }
}
