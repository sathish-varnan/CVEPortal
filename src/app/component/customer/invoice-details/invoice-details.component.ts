import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import InvoiceData from '../../../types/invoiceData';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { capitalize, formatDateToDDMMYYYY } from '../../../utils/util';

interface Invoice {
  data: InvoiceData;
  id: string;
  expanded: boolean;
};

@Component({
  selector: 'app-invoice-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent implements OnInit {
http = inject(HttpClient);
BASE_DATA = signal<Invoice[]>([]);
data = signal<Invoice[]>([]);
description = new FormControl('');
organisation = new FormControl('');
createdDate = new FormControl('');


  ngOnInit(): void {
    const id = localStorage.getItem("customer-id") ?? '';
    
    /* Adding filters */
    // Description
    this.description.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Arktx.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Organisation
    this.organisation.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Vkorg.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Dates
    this.createdDate.valueChanges.subscribe(value => {
      if (value === 'ascending') {
        this.data.set(this.BASE_DATA().sort((a: Invoice, b: Invoice): number => {
          if (a.data.createdDate !== undefined) {
            return (a.data.createdDate.getTime() - b.data.createdDate.getTime()) as number;
          }
          return 0;
        }));
      } else if (value === 'descending') {
        this.data.set(this.BASE_DATA().sort((a: Invoice, b: Invoice): number => {
          if (a.data.createdDate !== undefined && b.data.createdDate !== undefined) {
            return (b.data.createdDate.getTime() - a.data.createdDate.getTime()) as number;
          }
          return 0;
        }));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });
    
    try {
      this.http.post<{ data: InvoiceData[]}>('http://localhost:3000/customer/invoice', {
        id: id
      }).subscribe({
        next: (response) => {
          const updatedInvoiceData: Invoice[] = response.data.map(item => {
            item.createdDate = new Date(item.Erdat) ?? ``;
            item.Matnr = item.Matnr.replace(/^0+/, '');
            item.Spart = item.Spart.replace(/^0+/, '');
            item.Kunrg = item.Kunrg.replace(/^0+/, '');
            item.Posnr = item.Posnr.replace(/^0+/, '');
            item.Vtweg = item.Vtweg.replace(/^0+/, '');
            item.Erdat = formatDateToDDMMYYYY(item.Erdat);
            item.Fkdat = formatDateToDDMMYYYY(item.Fkdat);
            item.Arktx = capitalize(item.Arktx);
            return {
              id: uuid(),
              data: item,
              expanded: false,
            };
          })
          this.BASE_DATA.set(updatedInvoiceData);
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
