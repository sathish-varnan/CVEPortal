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
    console.log(name, password);
    // if (name === 'Sathish' && password === 'Welcome@123') {
      this.router.navigate(['/customer/profile']);
    //} else {
    //  alert("Check your credentials!!");
    //}
  }
}
