import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { EmployeeSidenavComponent } from '../../component/employee-sidenav/employee-sidenav.component';

@Component({
  selector: 'app-employee',
  imports: [ RouterOutlet,EmployeeSidenavComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  router = inject(Router);
}
