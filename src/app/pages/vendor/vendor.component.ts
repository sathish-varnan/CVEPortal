import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { VendorSidenavComponent } from '../../component/vendor-sidenav/vendor-sidenav.component';

@Component({
  selector: 'app-vendor',
  imports: [RouterOutlet, MatIconModule, VendorSidenavComponent],
  templateUrl: './vendor.component.html',
  styles: ``
})
export class VendorComponent {
  router = inject(Router);
}
