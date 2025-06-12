import { HttpClient } from '@angular/common/http';
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
  http = inject(HttpClient);

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

  async onClick() {
    let id = this.userDetails.value.id ?? '';
    let password = this.userDetails.value.password ?? '';
    console.log(id, password);

    try {
      const response = await this.http.get<{"status": string}>(
        `http://localhost:3000/employee/login?employeeId=${id}&password=${password}`
      ).subscribe({
        next: (res) => {
          const status = res.status;
          if (status === "SUCCESS") {
            localStorage.setItem("employee-id", id);
            this.router.navigate(['/employee/profile']);
          } else {
            alert("Invalid credentials. Please try again.");
          }
        },
        error: (err) => {
          console.error(err);
          alert("Something went wrong. Please try again later. Error: " + err.message);
        }
      });
    } catch (error: any) {
      alert("Something went wrong. Please try again later. Error: " + error.message);
    }
  }
}
