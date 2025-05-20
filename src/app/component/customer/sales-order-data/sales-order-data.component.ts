import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SalesOrderData from '../../../types/customerSalesOrderData';
import {v4 as uuid} from "uuid";
import { CommonModule } from '@angular/common';

interface SalesOrder {
  data: SalesOrderData;
  expanded: boolean;
  id: string;
};

@Component({
  selector: 'app-sales-order-data',
  imports: [CommonModule],
  templateUrl: './sales-order-data.component.html',
  styleUrl: './sales-order-data.component.css'
})
export class SalesOrderDataComponent {
  http = inject(HttpClient);
  data:WritableSignal<SalesOrder[]> = signal<SalesOrder[]>([]);

  getStatus(status: string) {
    switch(status) {
      case 'A':
        return "Not Started";
      case 'B':
        return "In Progress";
      case 'C':
        return "Completed";
      default:
        return "Not Relevant";
    }
  }

  ngOnInit(): void {
      const id = localStorage.getItem("customer-id") ?? '';
      try {
        this.http.post<{ data: SalesOrderData[]}>('http://localhost:3000/customer/sales-order', {
          id: id
        }).subscribe({
          next: (response) => {
            const updatedInquiryData: SalesOrder[] = response.data.map(item => {
              return {
                id: uuid(),
                data: item,
                expanded: false,
              };
            })
            this.data.set(updatedInquiryData);
          },
          error: (err) => {
            console.error("Fetch failed", err);
          }
        })
      } catch (err: any) {
        console.log(err);
      }
    }
    onExpand(inquiry: SalesOrder) {
      const updatedData = this.data().map(item => {
        if (item.id == inquiry.id) {
          return {...item, expanded: !item.expanded};
        }
        return item;
      });
      this.data.set(updatedData);
    }

}