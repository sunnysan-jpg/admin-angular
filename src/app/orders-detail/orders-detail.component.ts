import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders-detail-modal',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrderDetailsModalComponent {
  @Input() order!: any;
  @Output() close = new EventEmitter<void>();
  @Output() statusUpdated = new EventEmitter<any>();

  newStatus: string = '';
  
  statusOrder = ['pending', 'processing', 'shipped', 'delivered'];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.newStatus = this.order.status;
  }

  closeModal() {
    this.close.emit();
  }

  isStatusActive(status: string): boolean {
    return this.order.status === status;
  }

  isStatusCompleted(status: string): boolean {
    const currentIndex = this.statusOrder.indexOf(this.order.status);
    const checkIndex = this.statusOrder.indexOf(status);
    return checkIndex < currentIndex;
  }

  getItemImage(item: any): string {
    try {
      const images = JSON.parse(item.image_url);
      return images[0] || 'assets/placeholder.png';
    } catch {
      return item.image_url || 'assets/placeholder.png';
    }
  }

  getSubtotal(): number {
    return this.order.items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );
  }

  updateOrderStatus() {
    if (this.newStatus === this.order.status) {
      this.snackBar.open('Status is already ' + this.newStatus, 'Close', { duration: 2000 });
      return;
    }

    this.orderService.updateOrderStatus(this.order.id, this.newStatus).subscribe({
      next: (updatedOrder) => {
        this.order.status = this.newStatus;
        this.statusUpdated.emit(this.order);
        this.snackBar.open('Order status updated successfully! 🎉', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
      }
    });
  }

  printInvoice() {
    window.print();
    this.snackBar.open('Preparing invoice...', 'Close', { duration: 2000 });
  }
}