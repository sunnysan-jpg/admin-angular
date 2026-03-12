import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  filteredCustomers: any[] = [];
  viewMode: 'card' | 'table' = 'card';
  searchTerm: string = '';
  statusFilter: string = '';
  segmentFilter: string = '';
  isLoading = false;

  constructor(private snackBar: MatSnackBar, private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe(
      (data: any[]) => {
        this.customers = data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          segment: this.getSegment(Number(u.total_orders)),
          status: 'active',
          totalOrders: Number(u.total_orders),
          totalSpent: Number(u.total_spent),
          joinedDate: new Date(u.createdAt)
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      (error: any) => {
        this.snackBar.open('Error loading customers', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  getSegment(totalOrders: number): string {
    if (totalOrders === 0) return 'new';
    if (totalOrders >= 10) return 'vip';
    return 'regular';
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
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }

  getNewCustomersThisMonth(): number {
    const thisMonth = new Date().getMonth();
    return this.customers.filter(c => new Date(c.joinedDate).getMonth() === thisMonth).length;
  }

  getActiveCustomers(): number {
    return this.customers.filter(c => c.status === 'active').length;
  }

  getActivePercentage(): number {
    if (!this.customers.length) return 0;
    return Math.round((this.getActiveCustomers() / this.customers.length) * 100);
  }

  getAvgLifetimeValue(): number {
    if (!this.customers.length) return 0;
    const total = this.customers.reduce((sum, c) => sum + c.totalSpent, 0);
    return Math.round(total / this.customers.length);
  }

  getRepeatCustomers(): number {
    return this.customers.filter(c => c.totalOrders > 1).length;
  }

  getRepeatPercentage(): number {
    if (!this.customers.length) return 0;
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
