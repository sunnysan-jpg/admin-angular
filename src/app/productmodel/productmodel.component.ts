import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../product.model';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-product-modal',
  templateUrl: './productmodel.component.html'
})
export class ProductmodelComponent {

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  categories = ['Fresh', 'Premium', 'Dried', 'Organic'];
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      image: [null],
      status: [true],
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.productForm.patchValue({ image: file });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
      this.productForm.reset();
    }
  }
  // @Output() save = new EventEmitter<Product>();
  // @Output() cancel = new EventEmitter<void>();

  // product: Product = {
  //   id: 0,
  //   name: '',
  //   category_id: 0,
  //   price: 0,
  //   stock_quantity: 0,
  //   description: '',
  //   image_url: ''
  // };

  // submit() {
  //   this.save.emit(this.product);
  // }

  // close() {
  //   this.cancel.emit();
  // }

  //   constructor(private dialogRef: MatDialogRef<ProductmodelComponent>) {}

  // close() {
  //   this.dialogRef.close();
  // }

  // saveProduct() {
  //   // TODO: save logic
  //   this.dialogRef.close();
  // }
}
