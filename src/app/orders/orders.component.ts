// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-orders',
//   templateUrl: './orders.component.html',
//   styleUrls: ['./orders.component.scss']
// })
// export class OrdersComponent {

// }


import { Component } from '@angular/core';
import { Order } from '../order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent {
  orders: any = [];
  selectedOrder: Order | null = null;

  constructor(private adminService: OrderService) {
    this.loadOrders();
  }

  loadOrders() {
    this.orders = this.adminService.getOrders();
  }

  viewOrder(order: Order) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }
}
