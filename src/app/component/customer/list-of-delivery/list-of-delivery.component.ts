import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import DeliveryData from '../../../types/customerDeliveryData';
import { v4 as uuid } from "uuid";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { capitalize, formatDateToDDMMYYYY, removeZeros } from '../../../utils/util';

interface Delivery {
  data: DeliveryData;
  id: string;
  expanded: boolean;
};

@Component({
  selector: 'app-list-of-delivery',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-of-delivery.component.html',
  styleUrl: './list-of-delivery.component.css'
})
export class ListOfDeliveryComponent {
  http = inject(HttpClient);
  BASE_DATA = signal<Delivery[]>([]);
  data:WritableSignal<Delivery[]> = signal<Delivery[]>([]);
  description = new FormControl('');
  plant = new FormControl('');
  deliveryDate = new FormControl('');
  deliveryStatus = new FormControl('');


  getStatus() {
    const _list = ["Not Started", "In Progress", "Completed"];
    return _list[Math.floor(Math.random() * _list.length)];
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
    // Plant
    this.plant.valueChanges.subscribe(value => {
      const searchText = (value ?? '').toLowerCase();
      const filteredItems = this.BASE_DATA()
      .filter(item => item.data.Werks.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });
    // Dates
    this.deliveryDate.valueChanges.subscribe(value => {
      if (value === 'ascending') {
        this.data.set(this.BASE_DATA().sort((a: Delivery, b: Delivery): number => {
          if (a.data.deliveryDate !== undefined && b.data.deliveryDate !== undefined) {
            return (a.data.deliveryDate.getTime() - b.data.deliveryDate.getTime()) as number;
          }
          return 0;
        }));
      } else if (value === 'descending') {
        this.data.set(this.BASE_DATA().sort((a: Delivery, b: Delivery): number => {
          if (a.data.deliveryDate !== undefined && b.data.deliveryDate !== undefined) {
            return (b.data.deliveryDate.getTime() - a.data.deliveryDate.getTime()) as number;
          }
          return 0;
        }));
      } else {
        this.data.set(this.BASE_DATA());
      }
    });
    // delivery status
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
      .filter(item => item.data.Bestk.toLowerCase().includes(searchText.toLowerCase()));
      this.data.set(filteredItems);
    });

      try {
        this.http.post<{ data: DeliveryData[]}>('http://localhost:3000/customer/list-of-delivery', {
          id: id
        }).subscribe({
          next: (response) => {
            const updatedDeliveryData: Delivery[] = response.data.map(item => {
              item.deliveryDate = new Date(item.Lfdat) ?? ``;
              item.Bestk = this.getStatus();
              item.Arktx = capitalize(item.Arktx);
              item.Lfdat = formatDateToDDMMYYYY(item.Lfdat);
              item.Vbeln = removeZeros(item.Vbeln);
              item.Posnr = removeZeros(item.Posnr);
              item.Matnr = removeZeros(item.Matnr);
              item.Vstel = removeZeros(item.Vstel);
              item.Lgort = removeZeros(item.Lgort);
              return {
                id: uuid(),
                data: item,
                expanded: false,
              };
            })
            this.BASE_DATA.set(updatedDeliveryData);
            this.data.set(updatedDeliveryData);
          },
          error: (err) => {
            console.error("Fetch failed", err);
          }
        })
      } catch (err: any) {
        console.log(err);
      }
    }
    onExpand(inquiry: Delivery) {
      const updatedData = this.data().map(item => {
        if (item.id == inquiry.id) {
          return {...item, expanded: !item.expanded};
        }
        return item;
      });
      this.data.set(updatedData);
    }
}
