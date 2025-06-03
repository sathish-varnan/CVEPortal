import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface GoodsReceipt {
  id: string;
  data: any;
  expanded: boolean;
}

@Component({
  selector: 'app-goods-for-receipt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goods-receipt.component.html',
  styleUrl: './goods-receipt.component.css'
})
export class GoodsReceiptComponent implements OnInit {
  // Inject
  http = inject(HttpClient);

  // Signals aka Variables
  BASE_DATA: WritableSignal<GoodsReceipt[]> = signal<GoodsReceipt[]>([]);
  data: WritableSignal<GoodsReceipt[]> = signal<GoodsReceipt[]>([]);

  // Form Controls
  docNumber = new FormControl('');
  materialNumber = new FormControl('');
  poNumber = new FormControl('');
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

    // Material Number filter
    this.materialNumber.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => item.data.MaterialNumber.includes(searchText));
      this.data.set(filteredItems);
    });

    // PO Number filter
    this.poNumber.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
        .filter(item => (item.data.PoNumber || '').includes(searchText));
      this.data.set(filteredItems);
    });

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

    // Fetch goods receipts
    try {
      this.http.get<any>(`http://localhost:3000/vendor/goods-receipt?accountNumber=${accountNumber}`)
        .subscribe({
          next: (response) => {
            const goodsReceipts: GoodsReceipt[] = response.data.map((item: any) => ({
              id: uuid(),
              data: {
                ...item,
                DocNumber: removeZeros(item.DocNumber),
                MaterialNumber: removeZeros(item.MaterialNumber),
                ItemNumber: removeZeros(item.ItemNumber),
                PostDate: formatDateToDDMMYYYY(new Date(item.PostDate)),
                DocDate: formatDateToDDMMYYYY(new Date(item.DocDate))
              },
              expanded: false
            }));
            this.BASE_DATA.set(goodsReceipts);
            this.data.set(goodsReceipts);
          },
          error: (err) => {
            console.error("Failed to fetch goods receipts", err);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  onExpand(receipt: GoodsReceipt) {
    const updatedData = this.data().map(item => {
      if (item.id === receipt.id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.data.set(updatedData);
  }
}