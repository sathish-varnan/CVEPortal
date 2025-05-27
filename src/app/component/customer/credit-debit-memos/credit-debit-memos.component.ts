import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import creditDebitData from '../../../types/creditDebitData';
import { v4 as uuid } from 'uuid';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { formatDateToDDMMYYYY, formatAmPm, removeZeros, capitalize } from '../../../utils/util';

interface CreditDebit {
  data: creditDebitData,
  id: string;
  expanded: boolean;
  label: string;
};

@Component({
  selector: 'app-credit-debit-memos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credit-debit-memos.component.html',
  styleUrl: './credit-debit-memos.component.css'
})
export class CreditDebitMemosComponent {
  http = inject(HttpClient);
  BASE_DATA = signal<CreditDebit[]>([]);
  data = signal<CreditDebit[]>([]);
  description = new FormControl('');
  organization = new FormControl('');
  label = new FormControl('');

  ngOnInit(): void {
    const id = localStorage.getItem("customer-id") ?? '';

    this.description.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Arktx.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Item Type
    this.organization.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Vkorg.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Dates
    this.label.valueChanges.subscribe(value => {
      if (value === '' || value === null) {
        this.data.set(this.BASE_DATA());
      }
      const filterValue = value ?? '';
      const filteredItems = this.BASE_DATA()
      .filter(item => item.label.toLowerCase().includes(filterValue.toLowerCase()));
      this.data.set(filteredItems);
    });

    try {
      this.http.post<{ data: creditDebitData[]}>('http://localhost:3000/customer/credit-debit-memo', {
        id: id
      }).subscribe({
        next: (response) => {
          const updatedCreditDebitData: CreditDebit[] = response.data.map(item => {
            item.Vbeln = removeZeros(item.Vbeln);
            item.Knumv = removeZeros(item.Knumv);
            item.Posnr = removeZeros(item.Posnr);
            item.Vsbed = removeZeros(item.Vsbed);
            item.Fkdat = formatDateToDDMMYYYY(item.Fkdat);
            item.Erdat = formatDateToDDMMYYYY(item.Erdat);
            item.Erzet = formatAmPm(item.Erzet);
            item.Arktx = capitalize(item.Arktx);
            return {
              id: uuid(),
              data: item,
              expanded: false,
              label: item.Fkart == "G2" ? "credit" : "debit"
            };
          })
          this.BASE_DATA.set(updatedCreditDebitData);
          this.data.set(updatedCreditDebitData);
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