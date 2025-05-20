import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomerProfile } from '../../customer-profile';
import { HttpClient } from '@angular/common/http';
import { CustomerProfileData } from '../../types/customerProfileData';
@Component({
  selector: 'app-customer-profile',
  imports: [],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent implements OnInit {
  http = inject(HttpClient);
  profileDetails = signal<CustomerProfileData>({
    customerID: '', // kunnr
    countryKey: '', // land1
    firstName: '', // name1
    city: '', // ort01
    postalCode: '', // pstlz
    landmark: '', // stras
    region: '',
    phone: '',
});
  ngOnInit(): void {
    const id = localStorage.getItem("customer-id") ?? '0000000001';
    this.http.post<{ details: CustomerProfileData }>('http://localhost:3000/customer/profile', {
          id: id
        }).subscribe({
            next: (response) => {
              this.profileDetails.set(response.details);
            },
            error: (err) => {
              console.error('Login failed:', err);
              alert('An error occurred. Please try again later.');
            }
        });
  }
}