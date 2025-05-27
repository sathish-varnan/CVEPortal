import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import CustomerInquiryData from "../../../types/customerInquiryData";
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { capitalize, formatDate, formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface Inquiry {
  id: string;
  data: CustomerInquiryData;
  expanded: boolean;
}

@Component({
  selector: 'app-inquiry-data',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry-data.component.html',
  styleUrl: './inquiry-data.component.css'
})
export class InquiryDataComponent implements OnInit {
  // Inject
  http = inject(HttpClient);

  // Signals aka Variables
  BASE_DATA: WritableSignal<Inquiry[]> = signal<Inquiry[]>([]);
  data:WritableSignal<Inquiry[]> = signal<Inquiry[]>([]);

  // Variables
  description = new FormControl('');
  date = new FormControl('');
  itemType = new FormControl('');

  useFormatDate(date: Date | undefined): string {
    return formatDate(date);
  }
  
  // OnInit
  ngOnInit(): void {

    /** Remove this part **/
    // populateUsingDummies(this.BASE_DATA, 20); /* Remove this */
    // this.data.set(this.BASE_DATA());
    /**END*/
    
    // loading the customer credentials
    const id = localStorage.getItem("customer-id") ?? '';
    
    /* Adding filters */
    // Description
    this.description.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Arktx.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Item Type
    this.itemType.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Posar.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Dates
    this.date.valueChanges.subscribe(value => {
      if (value === 'validFrom') {
        this.data.set(this.BASE_DATA().sort((a: Inquiry, b: Inquiry): number => {
          if (a.data.validFrom !== undefined && b.data.validFrom !== undefined) {
            return (a.data.validFrom.getTime() - b.data.validFrom.getTime()) as number;
          }
          return 0;
        }));
      } else if (value == 'validTo') {
        this.data.set(this.BASE_DATA().sort((a: Inquiry, b: Inquiry): number => {
          if (a.data.validTo !== undefined && b.data.validTo !== undefined) {
            return (a.data.validTo.getTime() - b.data.validTo.getTime()) as number;
          }
          return 0;
        }));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });

    // Initial fetch to the SAP Server
    try {
      this.http.post<{ data: CustomerInquiryData[]}>('http://localhost:3000/customer/inquiry', {
        id: id
      }).subscribe({
        next: (response) => {
          const updatedInquiryData: Inquiry[] = response.data.map(item => {
            item.validFrom = (new Date(item.Angdt).toDateString() == "Invalid Date") ? new Date() : new Date(item.Angdt);
            item.validTo = (new Date(item.Bnddt).toDateString() == "Invalid Date") ? new Date() : new Date(item.Bnddt);
            item.Erdat = formatDateToDDMMYYYY(item.Erdat);
            item.Vbeln = removeZeros(item.Vbeln);
            item.Posnr = removeZeros(item.Posnr);
            item.Kunnr = removeZeros(item.Kunnr);
            item.Arktx = capitalize(item.Arktx);
            return {
              id: uuid(),
              data: item,
              expanded: false,
            };
          })
          this.BASE_DATA.set(updatedInquiryData);
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

  // handlers
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
