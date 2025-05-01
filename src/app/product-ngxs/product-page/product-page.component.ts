import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Product } from '../product.model';
import { ProductEditNgxsComponent } from '../product-edit/product-edit.component';
import { ProductsActions, ProductsState } from '../state/products.state';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    standalone: true,
    selector: 'app-product-page',
    imports: [ProductEditNgxsComponent],
    template: `
      @if (!loading()) {
      <app-product-edit
        (add)="addProduct($event)"
        (update)="updateProduct($event)"
        (delete)="deleteProduct($event)"
        [product]="product()"
      ></app-product-edit>
    } @else {
      <div>Loading...</div>
    }
  `,
})
export class ProductPageNgxsComponent {
    private store = inject(Store);
    private route = inject(ActivatedRoute);

    // Get the id from the route parameter
    private productId = toSignal(
        this.route.paramMap.pipe(
            map(params => Number(params.get('id'))),
            distinctUntilChanged()
        )
    );

    product = toSignal(
        this.store.select(ProductsState.getProductById(this.productId() ?? 0))
      );

    loading = this.store.selectSignal(ProductsState.getLoading);

    constructor() { }

    addProduct(product: Product) {
        this.store.dispatch(new ProductsActions.AddProduct(product));
    }

    updateProduct(product: Product) {
        this.store.dispatch(new ProductsActions.UpdateProduct(product));
    }

    deleteProduct(id: number) {
        this.store.dispatch(new ProductsActions.DeleteProduct(id));
    }
}
