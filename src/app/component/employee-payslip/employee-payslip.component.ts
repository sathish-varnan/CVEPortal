// employee-payslip.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { formatDateToDDMMYYYY } from '../../utils/util';

interface Payslip {
  EmpId: string;
  CompanyCode: string;
  CostCenter: string;
  Stell: string;
  Name: string;
  Gender: string;
  Dob: string;
  Nationality: string;
  PsGroup: string;
  PsLevel: string;
  Amount: string;
  WageType: string;
  CurrencyKey: string;
  WorkingHours: string;
  expanded: boolean;
}

@Component({
  selector: 'app-employee-payslip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-payslip.component.html',
  styleUrls: ['./employee-payslip.component.css']
})
export class EmployeePayslipComponent implements OnInit {
  http = inject(HttpClient);
  BASE_DATA = signal<Payslip[]>([]);
  data = signal<Payslip[]>([]);
  nameFilter = new FormControl('');
  costCenterFilter = new FormControl('');
  dateSort = new FormControl('');

  ngOnInit(): void {
    const employeeId = localStorage.getItem("employee-id") ?? '1';
    
    // Name filter
    this.nameFilter.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.Name.toLowerCase().includes(searchText));
      this.data.set(filteredItems);
    });
    
    // Cost Center filter
    this.costCenterFilter.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.CostCenter.toLowerCase().includes(searchText));
      this.data.set(filteredItems);
    });
    
    // Date sorting
    this.dateSort.valueChanges.subscribe(value => {
      if (value === 'ascending') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(a.Dob).getTime() - new Date(b.Dob).getTime()
        ));
      } else if (value === 'descending') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(b.Dob).getTime() - new Date(a.Dob).getTime()
        ));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });
    
    this.fetchPayslips(employeeId);
  }

  fetchPayslips(employeeId: string) {
    try {
      this.http.get<{ payslips: Payslip[] }>(
        `http://localhost:3000/employee/payslip?employeeId=${employeeId}`
      ).subscribe({
        next: (response) => {
          const payslips = response.payslips.map(item => ({
            ...item,
            Dob: formatDateToDDMMYYYY(item.Dob),
            expanded: false
          }));
          this.BASE_DATA.set(payslips);
          this.data.set(payslips);
        },
        error: (err) => {
          console.error("Fetch failed", err);
        }
      });
    } catch (err: any) {
      console.log(err);
    }
  }

  onExpand(payslip: Payslip) {
    const updatedData = this.data().map(item => {
      if (item.EmpId === payslip.EmpId) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.data.set(updatedData);
  }

  onEmail(employeeId: string) {
    this.http.get(
      `http://localhost:3000/employee/email?employeeId=${employeeId}`,
    ).subscribe({
      next: (response) => {
        alert("Email sent successfully");
      },
      error: (error) => {
        alert(error);
      }
    })
  }

  onPrint(employeeId: string) {
    this.http.get(
      `http://localhost:3000/employee/payslip-pdf?employeeId=${employeeId}`,
      {
        responseType: 'blob'
      }
    ).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `payslip_${employeeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
      }
    });
  }
}