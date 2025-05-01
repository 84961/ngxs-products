import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsService } from './product-ngxs/products.service';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProductsState } from './product-ngxs/state/products.state';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  // NGXS Routes with feature state configuration
  {
    path: 'products-ngxs',
    loadChildren: () => import('./product-ngxs/products-ngxs.routes').then((m) => m.routes),
    providers: [
      ProductsService,
      importProvidersFrom(NgxsModule.forFeature([ProductsState]))
    ]
  }
];
