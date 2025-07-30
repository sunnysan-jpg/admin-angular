
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';
import { Product } from '../product.model';
import { ProductmodelComponent } from '../productmodel/productmodel.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent  {
 product : Product[] = [ ];



  categories : any = [];
  showAddProduct = false;
  addProductForm: FormGroup;

  // For editing
  editingProduct: Product | null = null;

  constructor(private fb: FormBuilder,private snackBar: MatSnackBar,private productService: ProductService,private router: Router,private dialog: MatDialog) {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      category: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      image: [[]],
      status: [true],
    });
  }
  ngOnInit(){
    this.productService.getCategories().subscribe(data =>{
      this.categories = data
    })
    this.productService.getProducts({}).subscribe(data=>{
      this.product = data
    })
  }

  openAddProduct() {
    this.showAddProduct = true;
    this.editingProduct = null;
    this.addProductForm.reset();
  }
previewUrls: string[] = [];
selectedFiles: File[] = [];
  // Add or Edit product
  submitAddProduct() {
  if (this.addProductForm.valid) {
    const formData = new FormData();
    formData.append('name', this.addProductForm.get('name')?.value);
    formData.append('category_id', this.addProductForm.get('category')?.value);
    formData.append('price', this.addProductForm.get('price')?.value);
    formData.append('stock_quantity', this.addProductForm.get('stock')?.value);
    formData.append('description', this.addProductForm.get('description')?.value);
    formData.append('status', this.addProductForm.get('status')?.value);

    this.selectedFiles.forEach((file, index) => {
      console.log("file",file)
      formData.append('image', file); // 👈 'images' should match backend multer field
    });
    console.log("formadata",formData)

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.snackBar.open('Product Created Successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.log(err)
        this.snackBar.open(err.error.message || 'Product creation failed', 'Close', { duration: 3000 });
      }
    });

    this.showAddProduct = false;
    this.addProductForm.reset();
    this.previewUrls = [];
    this.selectedFiles = [];
  }
}


  onEdit(product: any) {
    this.editingProduct = product;
    this.showAddProduct = true;
    this.addProductForm.patchValue({...product});
  }

  onDelete(productId: number) {
    this.product = this.product.filter((p) => p.id !== productId);
  }

  

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Just for demo, preview in-memory (for real: upload or save as Base64, etc)
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.addProductForm.patchValue({ image: reader.result as string });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }


  openCategoryDialog() {
  const dialogRef = this.dialog.open(CategoryDialogComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.categories.push(result);
      this.addProductForm.patchValue({ category: result.id });
          this.productService.getCategories().subscribe(data =>{
      this.categories = data
    })
    }
  });
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
  console.log("select",this.selectedFiles)
  console.log("sle",this.previewUrls)
}


}