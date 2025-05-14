import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-login',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './customer-login.component.html',
  styles: ``
})
export class CustomerLoginComponent {
  router = inject(Router);
  userDetails = new FormGroup({
    id: new FormControl(''),
    password: new FormControl('')
  });
  onClick() {
    let name = this.userDetails.value.id ?? '';
    let password = this.userDetails.value.password ?? '';
    console.log(name, password);
    this.router.navigate(['/customer/']);
  }
}
