import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { VendorSidenavComponent } from '../../component/vendor-sidenav/vendor-sidenav.component';

@Component({
  selector: 'app-vendor',
  imports: [RouterOutlet,VendorSidenavComponent],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent {
  router = inject(Router);
}
