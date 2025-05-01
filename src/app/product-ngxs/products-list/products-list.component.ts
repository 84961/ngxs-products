import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { Product } from '../product.model';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Products</h2>
      <button routerLink="/products-ngxs/0" class="btn btn-primary">Add</button>
    </div>
    <ul class="list-group list-group-flush">
      @for (product of products(); track product.id) {
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <div>{{ product.name }}</div>
            <div>
              {{ product.price | currency }}
              @if (showProductCode()) {
                <span class="text-muted ms-2">Product Code: {{ product.id }}</span>
              }
            </div>
          </div>
          <button [routerLink]="['/products-ngxs', product.id]" class="btn btn-outline-primary">
            Edit
          </button>
        </li>
      }
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <strong>Total: {{ total() | currency }}</strong>
        <div class="form-check">
          <input
            id="showProductCode"
            type="checkbox"
            class="form-check-input"
            (change)="toggleProductCode.emit()"
            [checked]="showProductCode()"
          />
          <label class="form-check-label" for="showProductCode">Show Product Code</label>
        </div>
      </li>
    </ul>
  </div>
  `,
})
export class ProductsListNgxsComponent {
  products = input<Product[]>([]);
  total = input<number>(0);
  showProductCode = input<boolean>(false);
  @Output() toggleProductCode = new EventEmitter<void>();
}