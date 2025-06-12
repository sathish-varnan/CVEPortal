import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-profile',
  imports: [],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css'
})
export class EmployeeProfileComponent implements OnInit {

  http = inject(HttpClient);
  profile = {
    "BirthPlace": '',
    "CompanyName": '',
    "CostCenter": '',
    "Country": '',
    "Dob": '',
    "EmpId": '',
    "FirstName": '',
    "Gender": '',
    "Job": '',
    "JobPosition": '',
    "LastName": '',
    "MaritalStatus": '',
    "NameInitial": '',
    "Nationality": '',
    "NickName": '',
    "State": '',
    "Title": '',
  };

  ngOnInit(): void {
    this.loadProfile(); // Load employee profile when component initializes
  }

  isAlpha(str: string): boolean {
    return /^[a-zA-Z]*$/.test(str);
  }

  async loadProfile() {
    const id = localStorage.getItem('employee-id');
    try {
      const response = await this.http.get<any>(
        `http://localhost:3000/employee/profile?employeeId=${id}`
      ).subscribe({
        next: (data) => {
          this.profile = data;
          console.log(this.profile);
        },
        error: (error) => {
          alert(`Error fetching employee profile: ${error}`);
        }
      })
    } catch (error: any) {
      alert(`Error fetching employee profile: ${error}`);
    }
  }

}