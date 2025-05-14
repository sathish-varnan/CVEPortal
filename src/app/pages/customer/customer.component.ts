import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenavComponent } from '../../component/custom-sidenav/custom-sidenav.component';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, CustomSidenavComponent],
  templateUrl: './customer.component.html',
  styles: ``
})
export class CustomerComponent {
  router = inject(Router);
  collapsed = signal(false);
  sideNavWidth = computed(() => this.collapsed() ? '56px' : '250px');
}
