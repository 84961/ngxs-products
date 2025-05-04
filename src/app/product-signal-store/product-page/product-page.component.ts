import { Component, inject } from '@angular/core';
import { ProductEditSignalComponent } from '../product-edit/product-edit.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Product } from '../product.model';
import { ProductsStore } from '../store/products.store';

@Component({
  standalone: true,
  selector: 'app-product-page-signal',
  imports: [ProductEditSignalComponent],
  template: `
    @if (store.errorMessage()) {
      <div class="alert alert-danger">
        Error: {{ store.errorMessage() }}
      </div>
    }
    @if (!store.loading()) {
      <app-product-edit-signal
        [product]="currentProduct()"
        (add)="store.addProduct($event)"
        (update)="store.updateProduct($event)"
        (delete)="store.deleteProduct($event)"
      ></app-product-edit-signal>
    } @else {
      <div class="text-center p-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    }
  `,
})
export class ProductPageSignalComponent {
  private route = inject(ActivatedRoute);
  readonly store = inject(ProductsStore);

  protected currentProduct = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const id = Number(params.get('id'));
        return id === 0 ? { id: 0, name: '', price: 0 } : this.store.getProduct(id);
      })
    )
  );
}