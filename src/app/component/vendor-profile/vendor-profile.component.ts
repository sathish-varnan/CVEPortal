import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

interface Profile {
    "AccountNumber": string;
    "Password": string;
    "CountryKey": string;
    "Name": string;
    "City": string;
    "PostalCode": string;
    "Region": string;
    "SortField": string;
    "AddressPrefix": string;
    "AccountGroup": string
};

@Component({
  selector: 'app-vendor-profile',
  imports: [],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css'
})
export class VendorProfileComponent implements OnInit {
  http = inject(HttpClient);
  accountNumber = '';
  profile: Profile = {
    "AccountNumber": '',
    "Password": '',
    "CountryKey": '',
    "Name": '',
    "City": '',
    "PostalCode": '',
    "Region": '',
    "SortField": '',
    "AddressPrefix": '',
    "AccountGroup": '',  
  };
  
  ngOnInit(): void {
    this.accountNumber = localStorage?.getItem("vendor-id") ?? '';
    this.http.get<{ data: Profile }>(`http://localhost:3000/vendor/profile?accountNumber=${this.accountNumber}`)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.profile.AccountNumber = response.data.AccountNumber;
        this.profile.Password = response.data.Password;
        this.profile.CountryKey = response.data.CountryKey;
        this.profile.Name = response.data.Name;
        this.profile.City = response.data.City;
        this.profile.PostalCode = response.data.PostalCode;
        this.profile.Region = response.data.Region;
        this.profile.SortField = response.data.SortField;
        this.profile.AddressPrefix = response.data.AddressPrefix;
        this.profile.AccountGroup = response.data.AccountGroup;
        console.log(this.profile);
      },
      error: (err) => {
        console.log("Error", err);
      }
    });
  }
}