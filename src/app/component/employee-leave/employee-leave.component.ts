import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, combineLatest } from 'rxjs';
import { formatDateToDDMMYYYY } from '../../utils/util';

interface LeaveRequest {
  data: any;
  id: string;
  expanded: boolean;
};

@Component({
  selector: 'app-employee-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.css']
})
export class EmployeeLeaveComponent implements OnInit {
  http = inject(HttpClient);
  BASE_DATA = signal<LeaveRequest[]>([]);
  data = signal<LeaveRequest[]>([]);
  
  // Filters
  leaveTypeFilter = new FormControl('');
  startDateFilter = new FormControl('');
  endDateFilter = new FormControl('');
  sortBy = new FormControl('');
  formatDate = formatDateToDDMMYYYY;

  ngOnInit(): void {
    const employeeId = localStorage.getItem("employee-id") ?? '1';
    
    // Set up filter subscriptions
    combineLatest([
      this.startDateFilter.valueChanges,
      this.endDateFilter.valueChanges,
      this.sortBy.valueChanges
    ]).pipe(debounceTime(300)).subscribe(([startDate, endDate, sort]) => {
      this.applyFilters(startDate, endDate, sort);
    });
    this.fetchLeaveRequests(employeeId);

    this.leaveTypeFilter.valueChanges.subscribe(value => {
      if (value === '') {
        this.data.set([...this.BASE_DATA()]);
        return;
      }
      let filteredData = [...this.BASE_DATA()];
      filteredData = filteredData.filter(item => item.data.LeaveType === value);
      this.data.set(filteredData);
    });
  }

  fetchLeaveRequests(employeeId: string) {
    this.http.get<any[]>(`http://localhost:3000/employee/leave-request?employeeId=${employeeId}`)
      .subscribe({
        next: (response) => {
          const leaveRequests: LeaveRequest[] = response.map(item => ({
            id: uuid(),
            data: item,
            expanded: false
          }));
          this.BASE_DATA.set(leaveRequests);
          this.data.set(leaveRequests);
        },
        error: (err) => {
          console.error("Failed to fetch leave requests", err);
        }
      });
  }

  applyFilters(startDate: string | null, endDate: string | null, sort: string | null) {
    let filteredData = [...this.BASE_DATA()];
    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate);
      filteredData = filteredData.filter(item => new Date(item.data.StartDate) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filteredData = filteredData.filter(item => new Date(item.data.EndDate) <= end);
    }

    // Apply sorting
    if (sort) {
      const [sortField, sortDirection] = sort.split('-');
      filteredData.sort((a, b) => {
        if (sortField === 'startDate') {
          const dateA = new Date(a.data.StartDate).getTime();
          const dateB = new Date(b.data.StartDate).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortField === 'duration') {
          const durationA = parseFloat(a.data.LeaveDays);
          const durationB = parseFloat(b.data.LeaveDays);
          return sortDirection === 'asc' ? durationA - durationB : durationB - durationA;
        }
        return 0;
      });
    }

    this.data.set(filteredData);
  }

  getLeaveTypeName(typeCode: string): string {
    const types: {[key: string]: string} = {
      '0300': 'Annual Leave',
      '0720': 'Sick Leave',
      '0500': 'Maternity Leave',
      '0400': 'Unpaid Leave'
    };
    return types[typeCode] || typeCode;
  }

  onExpand(leave: LeaveRequest) {
    const updatedData = this.data().map(item => {
      if (item.id === leave.id) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.data.set(updatedData);
  }

  onRequestNewLeave() {
    // Implement navigation or modal opening for new leave request
    console.log('Request new leave');
  }
}