import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  adminName: string = 'Admin';
  currentTime: string = '';
  currentDate: string = '';
  private timeInterval: any;
  
  revenueFilter: string = '30d';
  
  // Stats
  stats = {
    totalRevenue: 0,
    revenueTrend: 0,
    totalOrders: 0,
    ordersTrend: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    totalCustomers: 0,
    newCustomers: 0,
    avgDeliveryTime: '2.5 days',
    avgRating: '4.8',
    fulfillmentRate: 98
  };
  
  // Recent orders
  recentOrders: any[] = [];
  
  // Critical alerts
  criticalAlerts: any[] = [];

  // Revenue Sparkline
  revenueSparklineData: ChartData<'line'> = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{
      data: [65, 59, 80, 81, 56, 55, 70],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 0
    }]
  };

  sparklineOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  // Revenue Chart
  revenueChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Revenue',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Orders',
        data: [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  revenueChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: 'bold' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { font: { size: 11 } }
      }
    }
  };

  // Order Status Doughnut Chart
  orderStatusChartData: ChartData<'doughnut'> = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [12, 19, 8, 15, 3],
      backgroundColor: [
        '#fbbf24',
        '#3b82f6',
        '#8b5cf6',
        '#10b981',
        '#ef4444'
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11 }
        }
      }
    }
  };

  // Top Products Bar Chart
  topProductsChartData: ChartData<'bar'> = {
    labels: ['Oyster', 'Shiitake', 'Button', 'Portobello', 'Enoki'],
    datasets: [{
      label: 'Sales',
      data: [45, 38, 32, 28, 22],
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#8b5cf6',
        '#ec4899'
      ],
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        beginAtZero: true
      }
    }
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get admin name
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.adminName = user.name || 'Admin';
      }
    });

    // Update time every second
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);

    // Load dashboard data
    this.loadDashboardData();

    // Refresh data every 30 seconds
    setInterval(() => this.loadDashboardData(), 30000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    this.currentDate = now.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  loadDashboardData() {
    // Load products
    this.productService.getProducts().subscribe(
      (products: any[]) => {
        this.stats.totalProducts = products.length;
        this.stats.lowStockItems = products.filter(p => p.stock_quantity < 20).length;
      },
      error => console.error('Error loading products:', error)
    );

    // Load orders
    this.orderService.getOrders().subscribe(
      (orders: any[]) => {
        this.stats.totalOrders = orders.length;
        this.stats.pendingOrders = orders.filter(
          o => o.status === 'pending' || o.status === 'processing'
        ).length;
        
        // Calculate total revenue
        this.stats.totalRevenue = orders.reduce(
          (sum, order) => sum + (order.total_amount || 0), 0
        );
        
        // Get recent orders (last 5)
        this.recentOrders = orders
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(order => ({
            id: order.id,
            customerName: order.user_name || 'Guest',
            customerInitial: this.getInitial(order.user_name),
            amount: order.total_amount,
            status: order.status,
            date: order.created_at
          }));

        // Update order status chart
        this.updateOrderStatusChart(orders);
        
        // Generate revenue chart data
        this.generateRevenueChartData(orders);
      },
      error => console.error('Error loading orders:', error)
    );

    // Generate critical alerts
    this.generateAlerts();
  }

  updateOrderStatusChart(orders: any[]) {
    const statusCount = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      const status = order.status.toLowerCase();
      if (status in statusCount) {
        statusCount[status as keyof typeof statusCount]++;
      }
    });

    this.orderStatusChartData.datasets[0].data = [
      statusCount.pending,
      statusCount.processing,
      statusCount.shipped,
      statusCount.delivered,
      statusCount.cancelled
    ];
  }

  generateRevenueChartData(orders: any[]) {
    // Generate last 7 days data
    const days = 7;
    const labels: string[] = [];
    const revenueData: number[] = [];
    const orderCountData: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      revenueData.push(dayRevenue);
      orderCountData.push(dayOrders.length);
    }

    this.revenueChartData.labels = labels;
    this.revenueChartData.datasets[0].data = revenueData;
    this.revenueChartData.datasets[1].data = orderCountData;
  }

  generateAlerts() {
    this.criticalAlerts = [];

    if (this.stats.lowStockItems > 0) {
      this.criticalAlerts.push({
        id: 1,
        title: 'Low Stock Alert',
        message: `${this.stats.lowStockItems} products are running low on stock`,
        time: 'Just now'
      });
    }

    if (this.stats.pendingOrders > 5) {
      this.criticalAlerts.push({
        id: 2,
        title: 'Pending Orders',
        message: `You have ${this.stats.pendingOrders} pending orders to process`,
        time: '5 min ago'
      });
    }
  }

  setRevenueFilter(filter: string) {
    this.revenueFilter = filter;
    // Reload chart data with new filter
    // Implementation depends on your backend
  }

  getStockProgress(): string {
    const total = this.stats.totalProducts;
    const inStock = total - this.stats.lowStockItems;
    const percentage = total > 0 ? (inStock / total) * 100 : 0;
    const circumference = 2 * Math.PI * 25;
    const offset = circumference - (percentage / 100) * circumference;
    return `${circumference} ${offset}`;
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  viewOrder(orderId: number) {
    // Navigate to order details
    console.log('View order:', orderId);
  }

  resolveAlert(alertId: number) {
    this.criticalAlerts = this.criticalAlerts.filter(a => a.id !== alertId);
  }
}