import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../product.model';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product[] = [];
  categories: any = [];
  showAddProduct = false;
  addProductForm: FormGroup;
  editingProduct: Product | null = null;
  previewUrls: string[] = [];
  selectedFiles: File[] = [];
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      image: [[]],
      status: [true],
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadProducts() {
    this.productService.getProducts({}).subscribe(data => {
      this.product = data;
    });
  }

  // Stats methods
  getLowStockCount(): number {
    return this.product.filter(p => p.stock_quantity < 20).length;
  }

  getTotalValue(): string {
    const total = this.product.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);
    return total.toLocaleString('en-IN');
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c: any) => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  getFirstImage(imageUrl: string): string {
    try {
      const images = JSON.parse(imageUrl);
      return images[0] || 'assets/placeholder.png';
    } catch {
      return imageUrl || 'assets/placeholder.png';
    }
  }

  openAddProduct() {
    this.showAddProduct = true;
    this.editingProduct = null;
    this.addProductForm.reset({ status: true });
    this.previewUrls = [];
    this.selectedFiles = [];
  }

  closeAddProduct() {
    this.showAddProduct = false;
    this.editingProduct = null;
    this.addProductForm.reset();
    this.previewUrls = [];
    this.selectedFiles = [];
  }

  onFileChange(event: any) {
    this.previewUrls = [];
    this.selectedFiles = [];

    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  submitAddProduct() {
    if (this.addProductForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addProductForm.get('name')?.value);
      formData.append('category_id', this.addProductForm.get('category')?.value);
      formData.append('price', this.addProductForm.get('price')?.value);
      formData.append('stock_quantity', this.addProductForm.get('stock')?.value);
      formData.append('description', this.addProductForm.get('description')?.value);
      formData.append('status', this.addProductForm.get('status')?.value);

      this.selectedFiles.forEach((file) => {
        formData.append('image', file);
      });

      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.snackBar.open('🎉 Product created successfully!', 'Close', { duration: 3000 });
          this.loadProducts();
          this.closeAddProduct();
        },
        error: (err) => {
          this.snackBar.open(err.error.message || 'Product creation failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onEdit(product: Product) {
    this.editingProduct = product;
    this.showAddProduct = true;
    this.addProductForm.patchValue({
      name: product.name,
      category: product.category_id,
      price: product.price,
      stock: product.stock_quantity,
      description: product.description,
      status: product.status
    });
  }

  onDelete(productId: number) {
    if (confirm('Are you sure you want to delete this product? 🗑️')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully!', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open('Delete failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categories.push(result);
        this.addProductForm.patchValue({ category: result.id });
        this.loadCategories();
      }
    });
  }
}