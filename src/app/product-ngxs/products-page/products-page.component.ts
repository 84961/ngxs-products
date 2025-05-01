import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProductsState, ProductsActions } from '../state/products.state';
import { ProductsListNgxsComponent } from '../products-list/products-list.component';

@Component({
  standalone: true,
  selector: 'app-products-page-ngxs',
  imports: [CommonModule, ProductsListNgxsComponent],
  template: `
    <div class="card error-card" *ngIf="errorMessage()">
      Error: {{ errorMessage() }}
    </div>
    <div *ngIf="!loading(); else loadingElement">
      <div class="container">
        <app-products-list
          [products]="products()"
          [total]="total()"
          [showProductCode]="showProductCode()"
          (toggleProductCode)="onToggleProductCode()"
        ></app-products-list>
      </div>
    </div>
    <ng-template #loadingElement>Loading...</ng-template>
  `,
})
export class ProductsPageNgxsComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  products = this.store.selectSignal(ProductsState.getProducts);
  showProductCode = this.store.selectSignal(ProductsState.getShowProductCode);
  loading = this.store.selectSignal(ProductsState.getLoading);
  errorMessage =this.store.selectSignal(ProductsState.getErrorMessage);
  total = this.store.selectSignal(ProductsState.getProductsLength);

  ngOnInit() {
    // not required as we are using ngxsOnInit in the state
    //this.store.dispatch(new ProductsActions.LoadProducts());
  }

  onToggleProductCode() {
    this.store.dispatch(new ProductsActions.ToggleShowProductCode());
  }
}