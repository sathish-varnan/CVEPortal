import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EmployeeSidenavComponent } from '../../component/employee-sidenav/employee-sidenav.component';

@Component({
  selector: 'app-employee',
  imports: [MatButtonModule, MatIconModule, RouterOutlet, MatToolbarModule, MatSidenavModule, EmployeeSidenavComponent],
  templateUrl: './employee.component.html',
  styles: ``
})
export class EmployeeComponent {
  router = inject(Router);
  collapsed = signal(false);
  sideNavWidth = computed(() => this.collapsed() ? '56px' : '250px');

}
