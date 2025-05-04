import { Routes } from '@angular/router';

export const PRODUCTS_SIGNAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products-page/products-page.component').then(
        (m) => m.ProductsPageSignalComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-page/product-page.component').then(
        (m) => m.ProductPageSignalComponent
      ),
  },
];