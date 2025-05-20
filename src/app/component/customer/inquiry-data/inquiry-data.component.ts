import { Component, inject, OnInit, signal } from '@angular/core';
import CustomerInquiryData from "../../../types/customerInquiryData";
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';

const dummy: CustomerInquiryData = {
    Kunnr: '',
    Erdat: '19-01-2025',
    Auart: '',
    Angdt: '19-01-2025',
    Bnddt: '22-01-2025',
    Vbeln: '0001',
    Posnr: '0001',
    Netwr: '100',
    Waerk: 'INR',
    Arktx: 'Marie Gold',
    Posar: 'biscuit',
    Vrkme: 'Dozen',
    Kwmeng: '2',
  };

interface Inquiry {
  id: string;
  data: CustomerInquiryData;
  expanded: boolean;
}

@Component({
  selector: 'app-inquiry-data',
  imports: [CommonModule],
  templateUrl: './inquiry-data.component.html',
  styleUrl: './inquiry-data.component.css'
})
export class InquiryDataComponent implements OnInit {
  http = inject(HttpClient);
  data = signal<Inquiry[]>([]);
  ngOnInit(): void {
    const id = localStorage.getItem("customer-id") ?? '';
    try {
      this.http.post<{ data: CustomerInquiryData[]}>('http://localhost:3000/customer/inquiry', {
        id: id
      }).subscribe({
        next: (response) => {
          const updatedInquiryData: Inquiry[] = response.data.map(item => {
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

  onExpand(inquiry: Inquiry) {
    const updatedData = this.data().map(item => {
      if (item.id == inquiry.id) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.data.set(updatedData);
  }
}
