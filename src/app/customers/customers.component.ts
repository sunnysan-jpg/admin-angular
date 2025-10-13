import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      segment: 'vip',
      status: 'active',
      totalOrders: 45,
      totalSpent: 125000,
      joinedDate: new Date('2023-01-15')
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 98765 43211',
      segment: 'regular',
      status: 'active',
      totalOrders: 28,
      totalSpent: 67000,
      joinedDate: new Date('2023-03-20')
    },
    {
      id: 3,
      name: 'Amit Singh',
      email: 'amit.singh@email.com',
      phone: '+91 98765 43212',
      segment: 'new',
      status: 'active',
      totalOrders: 5,
      totalSpent: 8500,
      joinedDate: new Date('2024-11-10')
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 98765 43213',
      segment: 'regular',
      status: 'inactive',
      totalOrders: 15,
      totalSpent: 32000,
      joinedDate: new Date('2023-06-05')
    },
  ];

  filteredCustomers = [...this.customers];
  viewMode: 'card' | 'table' = 'card';
  searchTerm: string = '';
  statusFilter: string = '';
  segmentFilter: string = '';

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredCustomers = this.customers.filter(customer => {
      const searchMatch = !this.searchTerm || 
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const statusMatch = !this.statusFilter || customer.status === this.statusFilter;
      const segmentMatch = !this.segmentFilter || customer.segment === this.segmentFilter;

      return searchMatch && statusMatch && segmentMatch;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.segmentFilter = '';
    this.applyFilters();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getNewCustomersThisMonth(): number {
    const thisMonth = new Date().getMonth();
    return this.customers.filter(c => new Date(c.joinedDate).getMonth() === thisMonth).length;
  }

  getActiveCustomers(): number {
    return this.customers.filter(c => c.status === 'active').length;
  }

  getActivePercentage(): number {
    return Math.round((this.getActiveCustomers() / this.customers.length) * 100);
  }

  getAvgLifetimeValue(): number {
    const total = this.customers.reduce((sum, c) => sum + c.totalSpent, 0);
    return Math.round(total / this.customers.length);
  }

  getRepeatCustomers(): number {
    return this.customers.filter(c => c.totalOrders > 1).length;
  }

  getRepeatPercentage(): number {
    return Math.round((this.getRepeatCustomers() / this.customers.length) * 100);
  }

  viewCustomer(customer: any) {
    this.snackBar.open(`Viewing ${customer.name}`, 'Close', { duration: 2000 });
  }

  editCustomer(customer: any) {
    this.snackBar.open(`Editing ${customer.name}`, 'Close', { duration: 2000 });
  }

  addCustomer() {
    this.snackBar.open('Add customer functionality', 'Close', { duration: 2000 });
  }

  exportCustomers() {
    this.snackBar.open('Exporting customers...', 'Close', { duration: 2000 });
  }
}