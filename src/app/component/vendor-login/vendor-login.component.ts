import { HttpClient } from '@angular/common/http';
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
  http = inject(HttpClient);

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
    try {
      this.http.get<{ status: string }>(`http://localhost:3000/vendor/login?accountNumber=${id}&password=${password}`)
      .subscribe({
        next: (res) => {
          const status = res.status;
          if (status === "SUCCESS") {
            localStorage.setItem("vendor-id", id);
            this.router.navigate(['vendor/profile']);
          } else {
            alert("Check your credentials");
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } catch (error: any) {
      console.log("Error: ", error);
    }
  }
}