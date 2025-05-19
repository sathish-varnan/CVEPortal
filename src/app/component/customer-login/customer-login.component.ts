import { HttpClient} from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-login',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.css'
})
export class CustomerLoginComponent {
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
  onClick() {
    let name = this.userDetails.value.id ?? '';
    let password = this.userDetails.value.password ?? '';
    this.http.post<{status: string}>('http://localhost:3000/customer/login', {
      id: name,
      password: password
    }).subscribe({
    next: (response) => {
      console.log(response);
      if (response.status === 'S') {
        this.router.navigate(['/customer/profile']);
      } else {
        alert('Check your credentials!!');
      }
    },
      error: (err) => {
        console.error('Login failed:', err);
        alert('An error occurred. Please try again later.');
      }
    });
    console.log(name, password);
  }
}
