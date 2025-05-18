import { Component } from '@angular/core';
import { CustomerProfile } from '../../customer-profile';
@Component({
  selector: 'app-customer-profile',
  imports: [],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {
  profileDetails: CustomerProfile = {
    customerID: 1,
    countryKey: 'IN',
    firstName: 'Sathish',
    city: 'Chennai',
    postalCode: '600063',
    landmark: 'Mudichur'
  };
}