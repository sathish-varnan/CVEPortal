import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
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