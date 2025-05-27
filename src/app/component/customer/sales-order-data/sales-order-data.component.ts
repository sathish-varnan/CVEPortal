import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SalesOrderData from '../../../types/customerSalesOrderData';
import {v4 as uuid} from "uuid";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { capitalize, formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface SalesOrder {
  data: SalesOrderData;
  expanded: boolean;
  id: string;
};

@Component({
  selector: 'app-sales-order-data',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-order-data.component.html',
  styleUrl: './sales-order-data.component.css'
})
export class SalesOrderDataComponent implements OnInit {
  http = inject(HttpClient);
  BASE_DATA = signal<SalesOrder[]>([]);
  data:WritableSignal<SalesOrder[]> = signal<SalesOrder[]>([]);
  description = new FormControl('');
  deliveryStatus = new FormControl('');
  deliveryDate = new FormControl('');

  getStatus(status: string) {
    switch(status) {
      case 'A':
        return "Not Started";
      case 'B':
        return "In Progress";
      case 'C':
        return "Completed";
      default:
        return "Not Relevant";
    }
  }

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

    // Delivery status
    this.deliveryStatus.valueChanges.subscribe(value => {
      let searchText = '';
      console.log("value: ", value);
      switch (value) {
        case 'progress':
          searchText = "In Progress";
          break;
        case 'complete':
          searchText = "Completed";
          break;
        case "not":
          searchText = "Not Started";
          break;
        default:
          searchText = "";
          break;
      }
      if (searchText === '') {
        this.data.set(this.BASE_DATA());
        return;
      }
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.deliveryStatus.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Plant
    // this.company.valueChanges.subscribe(value => {
    //   const searchText = (value ?? '').toLowerCase();
    //   const filteredItems = this.BASE_DATA()
    //   .filter(item => item.data.Bukrs.toLowerCase().includes(searchText.toLowerCase()));
    //   this.data.set(filteredItems);
    // });
    // // Dates
    this.deliveryDate.valueChanges.subscribe(value => {
      if (value === 'ascending') {
        this.data.set(this.BASE_DATA().sort((a: SalesOrder, b: SalesOrder): number => {
          if (a.data.deliveryDate !== undefined && b.data.deliveryDate !== undefined) {
            return (a.data.deliveryDate.getTime() - b.data.deliveryDate.getTime()) as number;
          }
          return 0;
        }));
      } else if (value === 'descending') {
        this.data.set(this.BASE_DATA().sort((a: SalesOrder, b: SalesOrder): number => {
          if (a.data.deliveryDate !== undefined && b.data.deliveryDate !== undefined) {
            return (b.data.deliveryDate.getTime() - a.data.deliveryDate.getTime()) as number;
          }
          return 0;
        }));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });

      try {
        this.http.post<{ data: SalesOrderData[]}>('http://localhost:3000/customer/sales-order', {
          id: id
        }).subscribe({
          next: (response) => {
            const updatedSalesOrderData: SalesOrder[] = response.data.map(item => {
              item.deliveryStatus = this.getStatus(item.Lfgsk);
              item.processingStatus = this.getStatus(item.Gbstk);
              item.deliveryDate = new Date(item.VdatuAna);
              item.Arktx = capitalize(item.Arktx);
              item.VdatuAna = formatDateToDDMMYYYY(item.VdatuAna);
              item.Vbeln = removeZeros(item.Vbeln);
              item.Posnr = removeZeros(item.Posnr);
              item.Erdat = formatDateToDDMMYYYY(item.Erdat);
              item.Lgort = removeZeros(item.Lgort);
              item.Spart = removeZeros(item.Spart);
              return {
                id: uuid(),
                data: item,
                expanded: false,
              };
            })
            this.BASE_DATA.set(updatedSalesOrderData);
            this.data.set(updatedSalesOrderData);
          },
          error: (err) => {
            console.error("Fetch failed", err);
          }
        })
      } catch (err: any) {
        console.log(err);
      }
    }
    onExpand(inquiry: SalesOrder) {
      const updatedData = this.data().map(item => {
        if (item.id == inquiry.id) {
          return {...item, expanded: !item.expanded};
        }
        return item;
      });
      this.data.set(updatedData);
    }

}