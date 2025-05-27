import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import InvoiceData from '../../../types/invoiceData';

interface Invoice {
  data: InvoiceData;
  id: string;
  expanded: boolean;
};

@Component({
  selector: 'app-invoice-details',
  imports: [CommonModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent implements OnInit {
http = inject(HttpClient);
  data = signal<Invoice[]>([]);

  ngOnInit(): void {
    const id = localStorage.getItem("customer-id") ?? '';
    try {
      this.http.post<{ data: InvoiceData[]}>('http://localhost:3000/customer/invoice', {
        id: id
      }).subscribe({
        next: (response) => {
          const updatedInvoiceData: Invoice[] = response.data.map(item => {
            return {
              id: uuid(),
              data: item,
              expanded: false,
            };
          })
          this.data.set(updatedInvoiceData);
        },
        error: (err) => {
          console.error("Fetch failed", err);
        }
      })
    } catch (err: any) {
      console.log(err);
    }
  }

  onExpand(invoice: Invoice) {
    const updatedData = this.data().map(item => {
      if (item.id == invoice.id) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.data.set(updatedData);
  }

  async onPrint(invoice: Invoice) {
    this.http.post(
      'http://localhost:3000/customer/invoice-pdf',
      {
        item_number: invoice.data.Posnr,
        document_number: invoice.data.Vbeln
      },
      {
        responseType: 'blob' // Important for handling binary PDF data
      }
    ).subscribe({
      next: (response: Blob) => {
        // Create a download link
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create anchor element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoice.data.Vbeln}_${invoice.data.Posnr}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
        // Handle error appropriately (show toast, etc.)
      }
    });
  }
}
