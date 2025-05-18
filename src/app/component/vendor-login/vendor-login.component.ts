import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-login',
  imports: [ReactiveFormsModule],
  templateUrl: './vendor-login.component.html',
  styleUrl: './vendor-login.component.css'
})
export class VendorLoginComponent {
  router = inject(Router);
  showPassword = signal(false);
  userDetails = new FormGroup({
    id: new FormControl(''),
    password: new FormControl('')
  });

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

  onClick() {
    let id = this.userDetails.value.id ?? '';
    let password = this.userDetails.value.password ?? '';
    console.log(id, password);
    this.router.navigate(['/vendor/profile']);
  }
}
