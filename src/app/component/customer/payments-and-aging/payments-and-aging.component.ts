import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import paymentAging from '../../../types/paymentData';

interface Payment {
  data: paymentAging;
  expanded: boolean;
  id: string;
};

@Component({
  selector: 'app-payments-and-aging',
  imports: [CommonModule],
  templateUrl: './payments-and-aging.component.html',
  styleUrl: './payments-and-aging.component.css'
})
export class PaymentsAndAgingComponent implements OnInit {
  http = inject(HttpClient);
  data = signal<Payment[]>([]);
  
    ngOnInit(): void {
      const id = localStorage.getItem("customer-id") ?? '';
      try {
        this.http.post<{ data: paymentAging[]}>('http://localhost:3000/customer/payment', {
          id: id
        }).subscribe({
          next: (response) => {
            const updatedPaymentData: Payment[] = response.data.map(item => {
              return {
                id: uuid(),
                data: item,
                expanded: false,
              };
            })
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
