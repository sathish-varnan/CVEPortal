import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  title = input('');
  loginHandler = input();
}
