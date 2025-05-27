import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import DeliveryData from '../../../types/customerDeliveryData';
import { v4 as uuid } from "uuid";

interface Delivery {
  data: DeliveryData;
  id: string;
  expanded: boolean;
};

@Component({
  selector: 'app-list-of-delivery',
  imports: [CommonModule],
  templateUrl: './list-of-delivery.component.html',
  styleUrl: './list-of-delivery.component.css'
})
export class ListOfDeliveryComponent {
  http = inject(HttpClient);
  data:WritableSignal<Delivery[]> = signal<Delivery[]>([]);
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
        this.http.post<{ data: DeliveryData[]}>('http://localhost:3000/customer/list-of-delivery', {
          id: id
        }).subscribe({
          next: (response) => {
            const updatedDeliveryData: Delivery[] = response.data.map(item => {
              return {
                id: uuid(),
                data: item,
                expanded: false,
              };
            })
            this.data.set(updatedDeliveryData);
          },
          error: (err) => {
            console.error("Fetch failed", err);
          }
        })
      } catch (err: any) {
        console.log(err);
      }
    }
    onExpand(inquiry: Delivery) {
      const updatedData = this.data().map(item => {
        if (item.id == inquiry.id) {
          return {...item, expanded: !item.expanded};
        }
        return item;
      });
      this.data.set(updatedData);
    }
}
