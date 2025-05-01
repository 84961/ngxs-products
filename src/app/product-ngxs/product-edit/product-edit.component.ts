import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product } from '../product.model';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="card">
    <div class="card-header">
      <h2 class="mb-0">Product Detail</h2>
    </div>
    <div class="card-body">
      <form [formGroup]="productForm" (submit)="onSubmit()">
        <div class="mb-3">
          <label for="name" class="form-label">Name:</label>
          <input type="text" class="form-control" id="name" formControlName="name" />
          @if (productForm.get('name')?.touched && productForm.get('name')?.hasError('required')) {
            <div class="invalid-feedback d-block">Name is required.</div>
          }
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price:</label>
          <input
            type="number"
            class="form-control"
            id="price"
            min="0"
            formControlName="price"
          />
          @if (productForm.get('price')?.touched && productForm.get('price')?.hasError('min')) {
            <div class="invalid-feedback d-block">Price must be 0 or greater.</div>
          }
        </div>
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">Save</button>
          @if (oldProduct && oldProduct.id > 0) {
            <button
              type="button"
              class="btn btn-danger"
              (click)="delete.emit(oldProduct.id)"
            >
              Delete
            </button>
          }
          <button routerLink="/products-ngxs" type="button" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
})
export class ProductEditNgxsComponent {
  oldProduct: Product | null | undefined = null;
  @Output() add = new EventEmitter<Product>();
  @Output() update = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<number>();
  @Input() set product(product: Product | null | undefined) {
    this.productForm.reset({ name: '', price: 0 });
    if (product && product.id !== 0) {
      this.productForm.setValue({
        name: product.name,
        price: product.price,
      });
    }
    this.oldProduct = product;
  }

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.min(0)),
  });

  onSubmit() {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) return;

    const product = {
      id: this.oldProduct?.id ?? 0,
      name: this.productForm.value.name ?? '',
      price: this.productForm.value.price ?? 0,
    };

    this.oldProduct ? this.update.emit(product) : this.add.emit(product);
  }
}
