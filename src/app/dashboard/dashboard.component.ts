import { Component, Input } from '@angular/core';
import { Product } from '../product.model';
import { Order } from '../order.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

      orders = [
    { name: 'Rahul Sharma', amount: 540, status: 'pending' },
    { name: 'Priya Patel', amount: 720, status: 'completed' },
    { name: 'Amit Singh', amount: 360, status: 'processing' }
  ];
  // @Input() products: Product[] = [];
  // @Input() orders: Order[] = [];

  // get totalRevenue() {
  //   return this.orders.reduce((acc, order) => acc + order.total, 0);
  // }

  // get lowStockCount() {
  //   return this.products.filter(p => p.stock_quantity < 20).length;
  // }


}
