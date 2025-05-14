import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './vendor-login.component.html',
  styles: ``
})
export class VendorLoginComponent {
  router = inject(Router);
  userDetails = new FormGroup({
    id: new FormControl(''),
    password: new FormControl('')
  });

  onClick() {
    let id = this.userDetails.value.id ?? '';
    let password = this.userDetails.value.password ?? '';
    console.log(id, password);
    this.router.navigate(['/vendor/']);
  }
}
