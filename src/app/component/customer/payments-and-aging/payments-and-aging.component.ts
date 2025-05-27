import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import paymentAging from '../../../types/paymentData';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface Payment {
  data: paymentAging;
  expanded: boolean;
  id: string;
};

@Component({
  selector: 'app-payments-and-aging',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payments-and-aging.component.html',
  styleUrl: './payments-and-aging.component.css'
})
export class PaymentsAndAgingComponent implements OnInit {
  http = inject(HttpClient);
  BASE_DATA = signal<Payment[]>([]);
  data = signal<Payment[]>([]);
  fiYear = new FormControl('');
  company = new FormControl('');
  deadlineDate = new FormControl('');
  
    ngOnInit(): void {
      const id = localStorage.getItem("customer-id") ?? '';

      /* Adding filters */
    // Description
    this.fiYear.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Gjahr.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Plant
    this.company.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Bukrs.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Dates
    this.deadlineDate.valueChanges.subscribe(value => {
      if (value === 'ascending') {
        this.data.set(this.BASE_DATA().sort((a: Payment, b: Payment): number => {
          if (a.data.deadlineDate !== undefined && b.data.deadlineDate !== undefined) {
            return (a.data.deadlineDate.getTime() - b.data.deadlineDate.getTime()) as number;
          }
          return 0;
        }));
      } else if (value === 'descending') {
        this.data.set(this.BASE_DATA().sort((a: Payment, b: Payment): number => {
          if (a.data.deadlineDate !== undefined && b.data.deadlineDate !== undefined) {
            return (b.data.deadlineDate.getTime() - a.data.deadlineDate.getTime()) as number;
          }
          return 0;
        }));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });

      try {
        this.http.post<{ data: paymentAging[]}>('http://localhost:3000/customer/payment', {
          id: id
        }).subscribe({
          next: (response) => {
            const updatedPaymentData: Payment[] = response.data.map(item => {
              item.deadlineDate = new Date(item.Zfbdt) ?? '';
              item.Kunnr = removeZeros(item.Kunnr);
              item.Augbl = removeZeros(item.Augbl);
              item.Bldat = formatDateToDDMMYYYY(item.Bldat);
              item.Zfbdt = formatDateToDDMMYYYY(item.Zfbdt);
              item.Buzei = removeZeros(item.Buzei);
              return {
                id: uuid(),
                data: item,
                expanded: false,
              };
            })
            this.BASE_DATA.set(updatedPaymentData);
            this.data.set(updatedPaymentData);
          },
          error: (err) => {
            console.error("Fetch failed", err);
          }
        })
      } catch (err: any) {
        console.log(err);
      }
    }
  
    onExpand(payment: Payment) {
      const updatedData = this.data().map(item => {
        if (item.id == payment.id) {
          return {...item, expanded: !item.expanded};
        }
        return item;
      });
      this.data.set(updatedData);
    }
}
