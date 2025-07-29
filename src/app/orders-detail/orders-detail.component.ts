// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-orders-detail',
//   templateUrl: './orders-detail.component.html',
//   styleUrls: ['./orders-detail.component.scss']
// })
// export class OrdersDetailComponent {

// }

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from '../order.model';


@Component({
selector: 'app-orders-detail-modal',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrderDetailsModalComponent {
  @Input() order!: Order;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}

