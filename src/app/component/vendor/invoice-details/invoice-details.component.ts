import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { formatDateToDDMMYYYY } from '../../../utils/util';

interface VendorInvoice {
  DocNumber: string;
  FinancialYr: string;
  DocDate: string;
  CompanyCode: string;
  RefDocNumber: string;
  CurrKey: string;
  Amount: string;
  TaxAmount: string;
  BaseDate: string;
  AccountNumber: string;
  DocItem: string;
  PdocNumber: string;
  ItemNumber: string;
  MaterialNumber: string;
  Plant: string;
  TotalAmount: string;
  Quantity: string;
  Unit: string;
  createdDate?: Date;
}

interface Invoice {
  data: VendorInvoice;
  id: string;
  expanded: boolean;
};

@Component({
  selector: 'app-vendor-invoice-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent implements OnInit {
  http = inject(HttpClient);
  BASE_DATA = signal<Invoice[]>([]);
  data = signal<Invoice[]>([]);
  description = new FormControl('');
  companyCode = new FormControl('');
  createdDate = new FormControl('');

  ngOnInit(): void {
    const accountNumber = localStorage.getItem("vendor-account-number") ?? '100000';
    
    // Description filter
    this.description.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.MaterialNumber?.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    
    // Company Code filter
    this.companyCode.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.CompanyCode?.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    
    // Date sorting
    this.createdDate.valueChanges.subscribe(value => {
      if (value === 'ascending') {
        this.data.set([...this.BASE_DATA()].sort((a: Invoice, b: Invoice): number => {
          if (a.data.createdDate && b.data.createdDate) {
            return a.data.createdDate.getTime() - b.data.createdDate.getTime();
          }
          return 0;
        }));
      } else if (value === 'descending') {
        this.data.set([...this.BASE_DATA()].sort((a: Invoice, b: Invoice): number => {
          if (a.data.createdDate && b.data.createdDate) {
            return b.data.createdDate.getTime() - a.data.createdDate.getTime();
          }
          return 0;
        }));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });
    
    this.fetchVendorInvoices(accountNumber);
  }

  fetchVendorInvoices(accountNumber: string) {
    try {
      this.http.get<{ data: VendorInvoice[] }>(`http://localhost:3000/vendor/invoice?accountNumber=${accountNumber}`)
        .subscribe({
          next: (response) => {
            const updatedInvoiceData: Invoice[] = response.data.map(item => {
              item.createdDate = new Date(item.DocDate) ?? undefined;
              item.DocDate = formatDateToDDMMYYYY(item.DocDate);
              item.BaseDate = formatDateToDDMMYYYY(item.BaseDate);
              
              return {
                id: uuid(),
                data: item,
                expanded: false,
              };
            });
            this.BASE_DATA.set(updatedInvoiceData);
            this.data.set(updatedInvoiceData);
          },
          error: (err) => {
            console.error("Fetch failed", err);
          }
        });
    } catch (err: any) {
      console.log(err);
    }
  }

  onExpand(invoice: Invoice) {
    const updatedData = this.data().map(item => {
      if (item.id === invoice.id) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.data.set(updatedData);
  }

  onPrint(invoice: Invoice) {
    this.http.get(
      `http://localhost:3000/vendor/invoice-pdf?invoiceNumber=${invoice.data.DocNumber}`,
      {
        responseType: 'blob'
      }
    ).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoice.data.DocNumber}.pdf`;
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