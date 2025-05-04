import { patchState, signalStore, withComputed, withMethods, withState, withProps, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Product } from '../product.model';
import { ProductsSignalService } from '../products-signal.service';
import { Router } from '@angular/router';
import { computed, inject } from '@angular/core';
import { pipe, EMPTY, switchMap, exhaustMap, tap, catchError } from 'rxjs';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export interface ProductsState {
  products: Product[];
  showProductCode: boolean;
  loading: boolean;
  errorMessage: string;
}

const initialState: ProductsState = {
  products: [],
  showProductCode: true,
  loading: false,
  errorMessage: '',
};

export const ProductsStore = signalStore(
  withDevtools('productssignals'), 
  withState(initialState),
  withProps((store) => ({
    productsService: inject(ProductsSignalService),
    router: inject(Router)
  })),
  withComputed((store) => ({
    totalPrice: computed(() => store.products().reduce((sum, product) => sum + product.price, 0))
  })),
  withMethods((store) => ({
    loadProducts: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true, errorMessage: '' })),
      switchMap(() => store.productsService.getAll().pipe(
        tap({
          next: (products) => patchState(store, { products, loading: false }),
          error: (error: Error) => patchState(store, { 
            loading: false, 
            errorMessage: error.message || 'Error loading products'
          })
        }),
        catchError(() => EMPTY)
      ))
    )),

    addProduct: rxMethod<Product>(pipe(
     tap(() => console.log('Adding product')),
      tap(() => patchState(store, { loading: true, errorMessage: '' })),
      exhaustMap((product) => store.productsService.add(product).pipe(
        tap({
          next: (newProduct) => {
            if (newProduct) {
              patchState(store, {
                products: [...store.products(), newProduct],
                loading: false
              });
              store.router.navigate(['/products-signal']);
            }
          },
          error: (error: Error) => patchState(store, { 
            loading: false, 
            errorMessage: error.message || 'Error adding product'
          })
        }),
        catchError(() => EMPTY)
      ))
    )),

    updateProduct: rxMethod<Product>(pipe(
      tap(() => patchState(store, { loading: true, errorMessage: '' })),
      exhaustMap((product) => store.productsService.update(product).pipe(
        tap({
          next: (updatedProduct) => {
            patchState(store, {
              products: store.products().map(p => 
                p.id === product.id ? (updatedProduct || product) : p
              ),
              loading: false
            });
            store.router.navigate(['/products-signal']);
          },
          error: (error: Error) => patchState(store, { 
            loading: false, 
            errorMessage: error.message || 'Error updating product'
          })
        }),
        catchError(() => EMPTY)
      ))
    )),

    deleteProduct: rxMethod<number>(pipe(
      tap(() => patchState(store, { loading: true, errorMessage: '' })),
      exhaustMap((id) => store.productsService.delete(id).pipe(
        tap({
          next: () => {
            patchState(store, {
              products: store.products().filter(p => p.id !== id),
              loading: false
            });
            store.router.navigate(['/products-signal']);
          },
          error: (error: Error) => patchState(store, { 
            loading: false, 
            errorMessage: error.message || 'Error deleting product'
          })
        }),
        catchError(() => EMPTY)
      ))
    )),

    toggleProductCode() {
      patchState(store, {
        showProductCode: !store.showProductCode()
      });
    },

    getProduct(id: number): Product | undefined {
      return store.products().find(p => p.id === id);
    }
  })),
  withHooks({
    onInit({ loadProducts }) {
      loadProducts();
    }
  })
);