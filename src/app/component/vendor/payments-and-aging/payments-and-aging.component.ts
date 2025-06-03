import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, combineLatest } from 'rxjs';
import { formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface PaymentAging {
  id: string;
  data: any;
  expanded: boolean;
}

@Component({
  selector: 'app-payment-and-aging',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payments-and-aging.component.html',
  styleUrl: './payments-and-aging.component.css'
})
export class PaymentsAndAgingComponent implements OnInit {
  // Inject
  http = inject(HttpClient);

  // Signals aka Variables
  BASE_DATA: WritableSignal<PaymentAging[]> = signal<PaymentAging[]>([]);
  data: WritableSignal<PaymentAging[]> = signal<PaymentAging[]>([]);

  // Form Controls
  docNumber = new FormControl('');
  docType = new FormControl('');
  minAmount = new FormControl<number | null>(null);
  maxAmount = new FormControl<number | null>(null);
  date = new FormControl('');
  financialYear = new FormControl('');

  ngOnInit(): void {
    // Get account number from localStorage or wherever it's stored
    const accountNumber = localStorage.getItem("vendor-account-number") ?? '100000';

    // Set up combined filter
    combineLatest([
      this.docNumber.valueChanges,
      this.docType.valueChanges,
      this.minAmount.valueChanges,
      this.maxAmount.valueChanges,
      this.date.valueChanges,
      this.financialYear.valueChanges
    ]).pipe(debounceTime(300)).subscribe(([
      docNumber, docType, minAmount, maxAmount, date, financialYear
    ]) => {
      let filteredData = [...this.BASE_DATA()];

      // Apply filters
      if (docNumber) {
        filteredData = filteredData.filter(item => 
          item.data.DocNumber.includes(docNumber)
        );
      }

      if (docType) {
        filteredData = filteredData.filter(item => 
          item.data.DocType.includes(docType)
        );
      }

      if (minAmount !== null) {
        filteredData = filteredData.filter(item => 
          parseFloat(item.data.Amount) >= minAmount
        );
      }

      if (maxAmount !== null) {
        filteredData = filteredData.filter(item => 
          parseFloat(item.data.Amount) <= maxAmount
        );
      }

      if (financialYear) {
        filteredData = filteredData.filter(item => 
          item.data.FinancialYr.includes(financialYear)
        );
      }

      // Apply sorting
      if (date === 'asc') {
        filteredData.sort((a, b) => 
          new Date(a.data.PostingDate).getTime() - new Date(b.data.PostingDate).getTime()
        );
      } else if (date === 'desc') {
        filteredData.sort((a, b) => 
          new Date(b.data.PostingDate).getTime() - new Date(a.data.PostingDate).getTime()
        );
      }

      this.data.set(filteredData);
    });

    // Fetch payment and aging data
    try {
      this.http.get<any>(`http://localhost:3000/vendor/payment-aging?accountNumber=${accountNumber}`)
        .subscribe({
          next: (response) => {
            const payments: PaymentAging[] = response.data.map((item: any) => ({
              id: uuid(),
              data: {
                ...item,
                DocNumber: removeZeros(item.DocNumber),
                ItemNumber: removeZeros(item.ItemNumber),
                PostingDate: formatDateToDDMMYYYY(new Date(item.PostingDate)),
                DocDate: formatDateToDDMMYYYY(new Date(item.DocDate))
              },
              expanded: false
            }));
            this.BASE_DATA.set(payments);
            this.data.set(payments);
          },
          error: (err) => {
            console.error("Failed to fetch payment and aging data", err);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  onExpand(payment: PaymentAging) {
    const updatedData = this.data().map(item => {
      if (item.id === payment.id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.data.set(updatedData);
  }
}