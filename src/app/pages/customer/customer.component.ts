import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CustomSidenavComponent } from '../../component/custom-sidenav/custom-sidenav.component';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet,CustomSidenavComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  router = inject(Router);
}
