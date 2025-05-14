import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './welcome.component.html',
  styles: ``
})
export class WelcomeComponent {
  router = inject(Router);

  goToCustomer() {
    this.router.navigate(['/customer/login']);
  }

  goToVendor() {
    this.router.navigate(['/vendor/login']);
  }

  goToEmployee() {
    this.router.navigate(['/employee/login']);
  }
}

