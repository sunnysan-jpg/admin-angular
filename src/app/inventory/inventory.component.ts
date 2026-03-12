import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  stockQuantity: number;
  minStock: number;
  maxStock: number;
  price: number;
  imageUrl: string;
  lastUpdated: Date;
}

interface StockMovement {
  id: number;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  user: string;
  timestamp: Date;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory: InventoryItem[] = [
    {
      id: 1,
      name: 'Premium Makhana',
      sku: 'MAK-PRM-001',
      categoryId: 1,
      stockQuantity: 145,
      minStock: 50,
      maxStock: 200,
      price: 250,
      imageUrl: 'https://via.placeholder.com/100',
      lastUpdated: new Date('2024-12-01')
    },
    {
      id: 2,
      name: 'Roasted Makhana',
      sku: 'MAK-RST-002',
      categoryId: 1,
      stockQuantity: 32,
      minStock: 50,
      maxStock: 200,
      price: 300,
      imageUrl: 'https://via.placeholder.com/100',
      lastUpdated: new Date('2024-12-03')
    },
    {
      id: 3,
      name: 'Raw Makhana',
      sku: 'MAK-RAW-003',
      categoryId: 1,
      stockQuantity: 0,
      minStock: 40,
      maxStock: 150,
      price: 200,
      imageUrl: 'https://via.placeholder.com/100',
      lastUpdated: new Date('2024-11-28')
    },
    {
      id: 4,
      name: 'Flavored Makhana (Peri Peri)',
      sku: 'MAK-FLV-004',
      categoryId: 2,
      stockQuantity: 78,
      minStock: 30,
      maxStock: 100,
      price: 350,
      imageUrl: 'https://via.placeholder.com/100',
      lastUpdated: new Date('2024-12-02')
    },
    {
      id: 5,
      name: 'Flavored Makhana (Cheese)',
      sku: 'MAK-FLV-005',
      categoryId: 2,
      stockQuantity: 15,
      minStock: 25,
      maxStock: 80,
      price: 350,
      imageUrl: 'https://via.placeholder.com/100',
      lastUpdated: new Date('2024-12-01')
    }
  ];

  categories = [
    { id: 1, name: 'Plain Makhana' },
    { id: 2, name: 'Flavored Makhana' },
    { id: 3, name: 'Premium Makhana' }
  ];

  recentMovements: StockMovement[] = [
    {
      id: 1,
      productName: 'Premium Makhana',
      type: 'in',
      quantity: 50,
      reason: 'Restock',
      user: 'Admin',
      timestamp: new Date('2024-12-03T10:30:00')
    },
    {
      id: 2,
      productName: 'Roasted Makhana',
      type: 'out',
      quantity: 25,
      reason: 'Sale',
      user: 'System',
      timestamp: new Date('2024-12-03T09:15:00')
    },
    {
      id: 3,
      productName: 'Raw Makhana',
      type: 'out',
      quantity: 40,
      reason: 'Sale',
      user: 'System',
      timestamp: new Date('2024-12-02T16:45:00')
    }
  ];

  filteredInventory: InventoryItem[] = [];
  viewMode: 'card' | 'table' = 'card';
  searchTerm: string = '';
  stockFilter: string = '';
  categoryFilter: string = '';

  // Adjustment modal
  showAdjustModal: boolean = false;
  selectedItem: InventoryItem | null = null;
  adjustmentType: 'add' | 'remove' | 'set' = 'add';
  adjustmentQuantity: number = 0;
  adjustmentReason: string = '';
  adjustmentNotes: string = '';

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.filteredInventory = [...this.inventory];
    this.snackBar.open('Inventory refreshed', 'Close', { duration: 2000 });
  }

  applyFilters() {
    this.filteredInventory = this.inventory.filter(item => {
      // Search filter
      const searchMatch = !this.searchTerm || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Stock status filter
      let stockMatch = true;
      if (this.stockFilter === 'in-stock') {
        stockMatch = item.stockQuantity > item.minStock;
      } else if (this.stockFilter === 'low-stock') {
        stockMatch = item.stockQuantity > 0 && item.stockQuantity <= item.minStock;
      } else if (this.stockFilter === 'out-of-stock') {
        stockMatch = item.stockQuantity === 0;
      }

      // Category filter
      const categoryMatch = !this.categoryFilter || 
        item.categoryId.toString() === this.categoryFilter;

      return searchMatch && stockMatch && categoryMatch;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.stockFilter = '';
    this.categoryFilter = '';
    this.applyFilters();
  }

  // Stats calculations
  getTotalUnits(): number {
    return this.inventory.reduce((sum, item) => sum + item.stockQuantity, 0);
  }

  getLowStockCount(): number {
    return this.inventory.filter(item => 
      item.stockQuantity > 0 && item.stockQuantity <= item.minStock
    ).length;
  }

  getOutOfStockCount(): number {
    return this.inventory.filter(item => item.stockQuantity === 0).length;
  }

  getTotalStockValue(): number {
    return this.inventory.reduce((sum, item) => 
      sum + (item.price * item.stockQuantity), 0
    );
  }

  // Helper functions
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getProductImage(url: string): string {
    return url || 'assets/placeholder.png';
  }

  getStockStatus(item: InventoryItem): string {
    if (item.stockQuantity === 0) return 'out-of-stock';
    if (item.stockQuantity <= item.minStock) return 'low-stock';
    return 'in-stock';
  }

  getStockBadgeText(item: InventoryItem): string {
    if (item.stockQuantity === 0) return 'Out of Stock';
    if (item.stockQuantity <= item.minStock) return 'Low Stock';
    return 'In Stock';
  }

  getStockPercentage(item: InventoryItem): number {
    return Math.min((item.stockQuantity / item.maxStock) * 100, 100);
  }

  // Actions
  restockItem(item: InventoryItem) {
    this.selectedItem = item;
    this.adjustmentType = 'add';
    this.adjustmentQuantity = item.minStock - item.stockQuantity;
    this.adjustmentReason = 'restock';
    this.showAdjustModal = true;
  }

  adjustItemStock(item: InventoryItem) {
    this.selectedItem = item;
    this.adjustmentType = 'add';
    this.adjustmentQuantity = 0;
    this.adjustmentReason = '';
    this.adjustmentNotes = '';
    this.showAdjustModal = true;
  }

  viewHistory(item: InventoryItem) {
    this.snackBar.open(`Viewing history for ${item.name}`, 'Close', { duration: 2000 });
  }

  closeAdjustModal() {
    this.showAdjustModal = false;
    this.selectedItem = null;
    this.adjustmentQuantity = 0;
    this.adjustmentReason = '';
    this.adjustmentNotes = '';
  }

  getNewStockLevel(): number {
    if (!this.selectedItem) return 0;
    
    switch (this.adjustmentType) {
      case 'add':
        return this.selectedItem.stockQuantity + this.adjustmentQuantity;
      case 'remove':
        return Math.max(0, this.selectedItem.stockQuantity - this.adjustmentQuantity);
      case 'set':
        return this.adjustmentQuantity;
      default:
        return this.selectedItem.stockQuantity;
    }
  }

  submitAdjustment() {
    if (!this.selectedItem || !this.adjustmentQuantity || !this.adjustmentReason) {
      return;
    }

    const newStockLevel = this.getNewStockLevel();
    const item = this.inventory.find(i => i.id === this.selectedItem!.id);
    
    if (item) {
      item.stockQuantity = newStockLevel;
      item.lastUpdated = new Date();
      
      // Add to movements history
      this.recentMovements.unshift({
        id: this.recentMovements.length + 1,
        productName: item.name,
        type: this.adjustmentType === 'remove' ? 'out' : 'in',
        quantity: this.adjustmentQuantity,
        reason: this.adjustmentReason,
        user: 'Admin',
        timestamp: new Date()
      });

      this.snackBar.open('✅ Stock adjusted successfully!', 'Close', { duration: 3000 });
      this.closeAdjustModal();
      this.applyFilters();
    }
  }

  adjustStock() {
    this.snackBar.open('Bulk stock adjustment', 'Close', { duration: 2000 });
  }

  openReorderModal() {
    this.snackBar.open('Opening reorder report', 'Close', { duration: 2000 });
  }

  bulkUpdate() {
    this.snackBar.open('Bulk update functionality', 'Close', { duration: 2000 });
  }

  importStock() {
    this.snackBar.open('Import stock data', 'Close', { duration: 2000 });
  }

  exportStock() {
    this.snackBar.open('Exporting stock data...', 'Close', { duration: 2000 });
  }

  printLabels() {
    this.snackBar.open('Printing labels...', 'Close', { duration: 2000 });
  }

  viewAllHistory() {
    this.snackBar.open('Viewing complete stock history', 'Close', { duration: 2000 });
  }
}