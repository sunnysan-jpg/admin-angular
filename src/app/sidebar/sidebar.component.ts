import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  activeTab: string = 'dashboard';
  isAdmin: boolean = false;
  adminName: string = 'Admin User';
  
  // Dynamic counts
  productCount: number = 0;
  pendingOrdersCount: number = 0;
  lowStockCount: number = 0;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Check admin status
    this.authService.isAdmins$.subscribe((status) => {
      this.isAdmin = status;
    });

    // Get admin name from auth service
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.adminName = user.name || 'Admin User';
      }
    });

    // Load dynamic counts
    this.loadCounts();

    // Refresh counts every 30 seconds
    setInterval(() => {
      this.loadCounts();
    }, 30000);
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`/${tab}`]);
  }

  loadCounts() {
    // Load product count
    this.productService.getProducts().subscribe(
      (products: any[]) => {
        this.productCount = products.length;
        this.lowStockCount = products.filter(p => p.stock_quantity < 20).length;
      }
    );

    // Load pending orders count
    this.orderService.getOrders().subscribe(
      (orders: any[]) => {
        this.pendingOrdersCount = orders.filter(
          o => o.status === 'pending' || o.status === 'processing'
        ).length;
      }
    );
  }

  getInitials(): string {
    if (!this.adminName) return 'A';
    
    const names = this.adminName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return this.adminName.substring(0, 2).toUpperCase();
  }
}