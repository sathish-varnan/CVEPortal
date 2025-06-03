import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { capitalize, formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface PurchaseOrder {
  id: string;
  data: any;
  expanded: boolean;
}

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
})
export class PurchaseOrderComponent implements OnInit {
  // Inject
  http = inject(HttpClient);

  // Signals aka Variables
  BASE_DATA: WritableSignal<PurchaseOrder[]> = signal<PurchaseOrder[]>([]);
  data: WritableSignal<PurchaseOrder[]> = signal<PurchaseOrder[]>([]);

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
        .filter(item => item.data.DocumentNumber.includes(searchText));
      this.data.set(filteredItems);
    });

    // Material Number filter
    this.materialNumber.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.MaterialNumber.includes(searchText));
      this.data.set(filteredItems);
    });

    // Date sorting
    this.date.valueChanges.subscribe(value => {
      if (value === 'asc') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(a.data.DocumentDate).getTime() - new Date(b.data.DocumentDate).getTime()
        ));
      } else if (value === 'desc') {
        this.data.set([...this.BASE_DATA()].sort((a, b) => 
          new Date(b.data.DocumentDate).getTime() - new Date(a.data.DocumentDate).getTime()
        ));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });

    // Fetch purchase orders
    try {
      this.http.get<any>(`http://localhost:3000/vendor/purchase-order?accountNumber=${accountNumber}`)
        .subscribe({
          next: (response) => {
            const purchaseOrders: PurchaseOrder[] = response.data.map((item: any) => ({
              id: uuid(),
              data: {
                ...item,
                DocumentNumber: removeZeros(item.DocumentNumber),
                MaterialNumber: removeZeros(item.MaterialNumber),
                ItemNumber: removeZeros(item.ItemNumber),
                Description: capitalize(item.Description)
              },
              expanded: false
            }));
            this.BASE_DATA.set(purchaseOrders);
            this.data.set(purchaseOrders);
          },
          error: (err) => {
            console.error("Failed to fetch purchase orders", err);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  onExpand(order: PurchaseOrder) {
    const updatedData = this.data().map(item => {
      if (item.id === order.id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.data.set(updatedData);
  }
}