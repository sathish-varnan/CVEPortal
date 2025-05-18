import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-login',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-login.component.html',
  styleUrl: './employee-login.component.css'
})
export class EmployeeLoginComponent {
  router = inject(Router);

  showPassword = signal(false);
  eyeIcon = computed(() => {
    if (this.showPassword()) {
      return "visibility"
    } else {
      return "visibility_off"
    }
  });

  passwordInputType = computed(() => {
    if (this.showPassword()) {
      return "text";
    } else {
      return "password";
    }
  })

  onEyeClick() {
    this.showPassword.set(!this.showPassword());
  }

  userDetails = new FormGroup({
    id: new FormControl(''),
    password: new FormControl('')
  });

  onClick() {
    let id = this.userDetails.value.id ?? '';
    let password = this.userDetails.value.password ?? '';
    console.log(id, password);
    this.router.navigate(['/employee/profile']);
  }
}
