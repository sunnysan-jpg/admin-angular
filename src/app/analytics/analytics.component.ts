import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  selectedPeriod: string = 'month';
  
  analytics = {
    totalRevenue: 485000,
    revenueGrowth: 12.5,
    totalOrders: 1250,
    orderGrowth: 8.3,
    newCustomers: 342,
    customerGrowth: 15.2,
    avgOrderValue: 388,
    conversionRate: 3.2,
    repeatPurchaseRate: 42,
    avgDeliveryTime: 3.5,
    customerSatisfaction: 4.6,
    topProducts: [
      { rank: 1, name: 'Premium Makhana', soldCount: 450, revenue: 112500 },
      { rank: 2, name: 'Roasted Makhana', soldCount: 380, revenue: 114000 },
      { rank: 3, name: 'Flavored Makhana (Peri Peri)', soldCount: 320, revenue: 112000 },
      { rank: 4, name: 'Flavored Makhana (Cheese)', soldCount: 280, revenue: 98000 },
      { rank: 5, name: 'Raw Makhana', soldCount: 195, revenue: 39000 }
    ],
    orderStatus: [
      { name: 'delivered', count: 850, percentage: 68 },
      { name: 'shipped', count: 200, percentage: 16 },
      { name: 'processing', count: 125, percentage: 10 },
      { name: 'pending', count: 75, percentage: 6 }
    ]
  };

  ngOnInit() {
    this.loadAnalytics();
    this.initCharts();
  }

  loadAnalytics() {
    // Load analytics based on selected period
    console.log('Loading analytics for:', this.selectedPeriod);
  }

  initCharts() {
    // Initialize charts using Chart.js or similar library
    console.log('Initializing charts...');
  }

  exportReport() {
    console.log('Exporting report...');
  }
}