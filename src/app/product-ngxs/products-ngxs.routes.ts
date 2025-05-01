import { Routes } from '@angular/router';
import { ProductsPageNgxsComponent } from './products-page/products-page.component';
import { ProductPageNgxsComponent } from './product-page/product-page.component';
import { ProductEditNgxsComponent } from './product-edit/product-edit.component';


export const routes: Routes = [
  {
    path: '',
    component: ProductsPageNgxsComponent
  },
  {
    path: ':id',
    component: ProductPageNgxsComponent
  },
  {
    path: ':id/edit',
    component: ProductEditNgxsComponent
  }
];