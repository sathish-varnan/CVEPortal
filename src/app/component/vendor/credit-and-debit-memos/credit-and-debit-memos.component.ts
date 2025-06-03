import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface CreditDebitMemo {
  id: string;
  data: any;
  expanded: boolean;
}

@Component({
  selector: 'app-credit-debit-memos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credit-and-debit-memos.component.html',
  styleUrl: './credit-and-debit-memos.component.css'
})
export class CreditAndDebitMemosComponent implements OnInit {
  // Inject
  http = inject(HttpClient);

  // Signals aka Variables
  BASE_DATA: WritableSignal<CreditDebitMemo[]> = signal<CreditDebitMemo[]>([]);
  data: WritableSignal<CreditDebitMemo[]> = signal<CreditDebitMemo[]>([]);

  // Form Controls
  docNumber = new FormControl('');
  memoType = new FormControl('');
  glAccount = new FormControl('');
  minAmount = new FormControl<number | null>(null);
  maxAmount = new FormControl<number | null>(null);
  date = new FormControl('');

  ngOnInit(): void {
    // Get account number from localStorage or wherever it's stored
    const accountNumber = localStorage.getItem("vendor-account-number") ?? '100000';
    
    // Document Number filter
    this.docNumber.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.DocNumber.includes(searchText));
      this.data.set(filteredItems);
    });

    // Memo Type filter
    this.memoType.valueChanges.subscribe(value => {
      if (!value) {
        this.data.set(this.BASE_DATA());
      } else {
        const filteredItems = this.BASE_DATA()
          .filter(item => item.data.LabelName === value);
        this.data.set(filteredItems);
      }
    });

    // GL Account filter
    this.glAccount.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.GlAccNo.includes(searchText));
      this.data.set(filteredItems);
    });

    // Amount Range filter
    this.minAmount.valueChanges.subscribe(() => this.applyAmountFilter());
    this.maxAmount.valueChanges.subscribe(() => this.applyAmountFilter());

    // Date sorting
    this.date.valueChanges.subscribe(value => {
      if (value === 'asc') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(a.data.DocDate).getTime() - new Date(b.data.DocDate).getTime()
        ));
      } else if (value === 'desc') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(b.data.DocDate).getTime() - new Date(a.data.DocDate).getTime()
        ));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });

    // Fetch credit/debit memos
    try {
      this.http.get<any>(`http://localhost:3000/vendor/credit-debit?accountNumber=${accountNumber}`)
        .subscribe({
          next: (response) => {
            const memos: CreditDebitMemo[] = response.data.map((item: any) => ({
              id: uuid(),
              data: {
                ...item,
                DocNumber: removeZeros(item.DocNumber),
                GlAccNo: removeZeros(item.GlAccNo),
                ItemNumber: removeZeros(item.ItemNumber),
                PostingDate: formatDateToDDMMYYYY(new Date(item.PostingDate)),
                DocDate: formatDateToDDMMYYYY(new Date(item.DocDate))
              },
              expanded: false
            }));
            this.BASE_DATA.set(memos);
            this.data.set(memos);
          },
          error: (err) => {
            console.error("Failed to fetch credit/debit memos", err);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  private applyAmountFilter(): void {
    const min = this.minAmount.value;
    const max = this.maxAmount.value;
    
    if (min === null && max === null) {
      this.data.set(this.BASE_DATA());
      return;
    }

    const filteredItems = this.BASE_DATA().filter(item => {
      const amount = parseFloat(item.data.Amount);
      const meetsMin = min === null || amount >= min;
      const meetsMax = max === null || amount <= max;
      return meetsMin && meetsMax;
    });

    this.data.set(filteredItems);
  }

  onExpand(memo: CreditDebitMemo) {
    const updatedData = this.data().map(item => {
      if (item.id === memo.id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.data.set(updatedData);
  }
}