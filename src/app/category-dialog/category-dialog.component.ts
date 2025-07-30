import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
categories: any[] = [];
  categoryForm: FormGroup;
  showAddForm = false;

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    private productService: ProductService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  selectCategory(cat: any) {
    this.dialogRef.close(cat);
  }

  addCategory() {
    if (this.categoryForm.valid) {
      this.productService.createCategories(this.categoryForm.value).subscribe((newCat) => {
        this.dialogRef.close(newCat);  // return new category to caller
      });
    }
  }
}
