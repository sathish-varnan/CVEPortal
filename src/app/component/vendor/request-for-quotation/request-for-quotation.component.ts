import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { capitalize, formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface RFQ {
  id: string;
  data: any;
  expanded: boolean;
}

@Component({
  selector: 'app-request-for-quotation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-for-quotation.component.html',
  styleUrl: './request-for-quotation.component.css'
})
export class RequestForQuotationComponent implements OnInit {
  // Inject
  http = inject(HttpClient);

  // Signals
  BASE_DATA: WritableSignal<RFQ[]> = signal<RFQ[]>([]);
  data: WritableSignal<RFQ[]> = signal<RFQ[]>([]);

  // Form Controls
  description = new FormControl('');
  documentNumber = new FormControl('');
  date = new FormControl('');
  materialNumber = new FormControl('');

  ngOnInit(): void {
    // Get account number from localStorage or wherever it's stored
    const accountNumber = localStorage.getItem("vendor-account-number") ?? '100000';
    
    // Description filter
    this.description.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.Description.toLowerCase().includes(searchText));
      this.data.set(filteredItems);
    });

    // Document Number filter
    this.documentNumber.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.Documentnumber.includes(searchText));
      this.data.set(filteredItems);
    });

    // Material Number filter
    this.materialNumber.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.Materialnumber.includes(searchText));
      this.data.set(filteredItems);
    });

    // Date sorting
    this.date.valueChanges.subscribe(value => {
      if (value === 'asc') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(a.data.Docdate).getTime() - new Date(b.data.Docdate).getTime()
        ));
      } else if (value === 'desc') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(b.data.Docdate).getTime() - new Date(a.data.Docdate).getTime()
        ));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });

    // Fetch RFQs
    try {
      this.http.get<any>(`http://localhost:3000/vendor/roq?accountNumber=${accountNumber}`)
        .subscribe({
          next: (response) => {
            const rfqs: RFQ[] = response.data.map((item: any) => ({
              id: uuid(),
              data: {
                ...item,
                Documentnumber: removeZeros(item.Documentnumber),
                Materialnumber: removeZeros(item.Materialnumber),
                Itemnumber: removeZeros(item.Itemnumber),
                Description: capitalize(item.Description)
              },
              expanded: false
            }));
            this.BASE_DATA.set(rfqs);
            this.data.set(rfqs);
          },
          error: (err) => {
            console.error("Failed to fetch RFQs", err);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  onExpand(rfq: RFQ) {
    const updatedData = this.data().map(item => {
      if (item.id === rfq.id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.data.set(updatedData);
  }
}