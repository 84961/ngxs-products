import { Component, inject } from '@angular/core';
import { ProductsListSignalComponent } from '../products-list/products-list.component';
import { ProductsStore } from '../store/products.store';

@Component({
  standalone: true,
  selector: 'app-products-page-signal',
  imports: [ProductsListSignalComponent],
  template: `
    @if (store.errorMessage()) {
      <div class="alert alert-danger">
        Error: {{ store.errorMessage() }}
      </div>
    }
    @if (!store.loading()) {
      <app-products-list-signal
        [products]="store.products()"
        [total]="store.totalPrice()"
        [showProductCode]="store.showProductCode()"
        (toggleProductCode)="store.toggleProductCode()"
      ></app-products-list-signal>
    } @else {
      <div class="text-center p-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    }
  `
})
export class ProductsPageSignalComponent {
  readonly store = inject(ProductsStore);
}