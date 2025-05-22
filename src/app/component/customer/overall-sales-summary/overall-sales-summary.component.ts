import { Component, inject, OnInit, signal } from '@angular/core';
import CustomerInquiryData from "../../../types/customerInquiryData";
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import SalesSummary from '../../../types/salesSummaryData';

interface Summary {
  data: SalesSummary,
  id: string;
  expanded: boolean;
}

@Component({
  selector: 'app-overall-sales-summary',
  imports: [CommonModule],
  templateUrl: './overall-sales-summary.component.html',
  styleUrl: './overall-sales-summary.component.css'
})
export class OverallSalesSummaryComponent {
  http = inject(HttpClient);
  data = signal<Summary[]>([]);

  ngOnInit(): void {
    const id = localStorage.getItem("customer-id") ?? '';
    try {
      this.http.post<{ data: SalesSummary[]}>('http://localhost:3000/customer/sales-summary', {
        id: id
      }).subscribe({
        next: (response) => {
          const updatedInquiryData: Summary[] = response.data.map(item => {
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

  onExpand(inquiry: Summary) {
    const updatedData = this.data().map(item => {
      if (item.id == inquiry.id) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.data.set(updatedData);
  }
}