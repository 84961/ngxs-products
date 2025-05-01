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
      <div class="header">
        <div>
          <h2 class="title">Products</h2>
        </div>
        <button routerLink="/products-ngxs/0" class="btn btn-primary">Add</button>
      </div>
      <ul role="list">
        @for (product of products(); track product.id) {
          <li>
            <div>
              <div>{{ product.name }}</div>
              <div>
                {{ product.price | currency }}
                @if (showProductCode()) {
                  <span>Product Code: {{ product.id }}</span>
                }
              </div>
            </div>
            <div>
              <button [routerLink]="['/products-ngxs', product.id]" class="btn">
                Edit
              </button>
            </div>
          </li>
        }
        <li>
          Total: {{ total() | currency }}
          <div>
            <input
              id="showProductCode"
              type="checkbox"
              (change)="toggleProductCode.emit()"
              [checked]="showProductCode()"
            />
            <label for="showProductCode">Show Product Code</label>
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