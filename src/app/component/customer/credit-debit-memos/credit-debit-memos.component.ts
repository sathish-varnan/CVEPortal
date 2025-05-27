import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import creditDebitData from '../../../types/creditDebitData';
import { v4 as uuid } from 'uuid';

interface CreditDebit {
  data: creditDebitData,
  id: string;
  expanded: boolean;
  label: string;
};

@Component({
  selector: 'app-credit-debit-memos',
  imports: [CommonModule],
  templateUrl: './credit-debit-memos.component.html',
  styleUrl: './credit-debit-memos.component.css'
})
export class CreditDebitMemosComponent {
  http = inject(HttpClient);
  data = signal<CreditDebit[]>([]);

  ngOnInit(): void {
    const id = localStorage.getItem("customer-id") ?? '';
    try {
      this.http.post<{ data: creditDebitData[]}>('http://localhost:3000/customer/credit-debit-memo', {
        id: id
      }).subscribe({
        next: (response) => {
          const updatedInquiryData: CreditDebit[] = response.data.map(item => {
            return {
              id: uuid(),
              data: item,
              expanded: false,
              label: item.Fkart
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

  onExpand(creditDebit: CreditDebit) {
    const updatedData = this.data().map(item => {
      if (item.id == creditDebit.id) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.data.set(updatedData);
  }
}