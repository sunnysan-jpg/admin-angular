import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { Category } from '../category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  showAddCategory = false;
  categoryForm: FormGroup;
  editingCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private productService: ProductService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
      }
    );
  }

  // Stats methods
  getTotalProducts(): number {
    // You can fetch this from backend or calculate
    return 24; // Placeholder - update with real data
  }

  getRecentCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.categories.filter(cat => 
      new Date(cat.created_at) > oneWeekAgo
    ).length;
  }

  openAddCategory() {
    this.showAddCategory = true;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  closeAddCategory() {
    this.showAddCategory = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  submitCategory() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      if (this.editingCategory) {
        // Update existing category
        // this.productService.updateCategory(this.editingCategory.id, categoryData).subscribe({
        //   next: () => {
        //     this.snackBar.open('Category updated successfully! 🎉', 'Close', { duration: 3000 });
        //     this.loadCategories();
        //     this.closeAddCategory();
        //   },
        //   error: (err) => {
        //     this.snackBar.open(err.error.message || 'Update failed', 'Close', { duration: 3000 });
        //   }
        // });
      } else {
        // Create new category
        this.productService.createCategories(categoryData).subscribe({
          next: () => {
            this.snackBar.open('Category created successfully! 🎉', 'Close', { duration: 3000 });
            this.loadCategories();
            this.closeAddCategory();
          },
          error: (err) => {
            this.snackBar.open(err.error.message || 'Creation failed', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onEdit(category: Category) {
    this.editingCategory = category;
    this.showAddCategory = true;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  onDelete(categoryId: number) {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone. 🗑️')) {
      // this.productService.deleteCategory(categoryId).subscribe({
      //   next: () => {
      //     this.snackBar.open('Category deleted successfully!', 'Close', { duration: 3000 });
      //     this.loadCategories();
      //   },
      //   error: (err) => {
      //     this.snackBar.open(err.error.message || 'Delete failed', 'Close', { duration: 3000 });
      //   }
      // });
    }
  }
}