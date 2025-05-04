import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsStore } from './product-signal-store/store/products.store';
import { ProductsSignalService } from './product-signal-store/products-signal.service';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products-signal',
    loadChildren: () =>
      import('./product-signal-store/products-signal.routes').then((m) => m.PRODUCTS_SIGNAL_ROUTES),
    providers: [
      ProductsSignalService,
      ProductsStore
    ]
  },
];
