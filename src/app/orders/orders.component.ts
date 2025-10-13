import { Component, OnInit } from '@angular/core';
import { Order } from '../order.model';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: any = null;
  
  viewMode: 'card' | 'table' = 'card';
  statusFilter: string = '';
  dateFilter: string = '';
  searchTerm: string = '';

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
      },
      error: (err) => {
        this.snackBar.open('Error loading orders', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilters() {
    this.filteredOrders = this.orders.filter(order => {
      // Search filter
      const searchMatch = !this.searchTerm || 
        order.id.toString().includes(this.searchTerm) ||
        order.user?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status filter
      const statusMatch = !this.statusFilter || order.status === this.statusFilter;

      // Date filter
      let dateMatch = true;
      if (this.dateFilter) {
        const orderDate = new Date(order.created_at);
        const today = new Date();
        
        switch(this.dateFilter) {
          case 'today':
            dateMatch = orderDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateMatch = orderDate >= weekAgo;
            break;
          case 'month':
            dateMatch = orderDate.getMonth() === today.getMonth() && 
                       orderDate.getFullYear() === today.getFullYear();
            break;
        }
      }

      return searchMatch && statusMatch && dateMatch;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
    this.filteredOrders = [...this.orders];
  }

  getStatusCount(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }

  getNewOrdersCount(): number {
    const today = new Date();
    return this.orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === today.toDateString();
    }).length;
  }

  getTotalRevenue(): string {
    const total = this.orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    return total.toLocaleString('en-IN');
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'pending': '⏳',
      'processing': '⚙️',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return icons[status] || '📦';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getFirstThreeItems(items: any[]): any[] {
    return items.slice(0, 3);
  }

  getItemImage(item: any): string {
    try {
      const images = JSON.parse(item.image_url);
      return images[0] || 'assets/placeholder.png';
    } catch {
      return item.image_url || 'assets/placeholder.png';
    }
  }

  viewOrder(order: any) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  updateStatus(order: any) {
    // Open modal in edit mode
    this.selectedOrder = order;
  }

  onStatusUpdated(updatedOrder: any) {
    const index = this.orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
      this.applyFilters();
    }
  }

  exportOrders() {
    this.snackBar.open('Exporting orders...', 'Close', { duration: 2000 });
    // Implement export functionality
  }
}