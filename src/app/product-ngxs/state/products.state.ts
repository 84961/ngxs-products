import { Injectable } from '@angular/core';
import { Action, createSelector, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

// Actions
export namespace ProductsActions {
  export class LoadProducts {
    static readonly type = '[Products] Load Products';
  }

  export class AddProduct {
    static readonly type = '[Products] Add Product';
    constructor(public product: Product) {}
  }

  export class UpdateProduct {
    static readonly type = '[Products] Update Product';
    constructor(public product: Product) {}
  }

  export class DeleteProduct {
    static readonly type = '[Products] Delete Product';
    constructor(public id: number) {}
  }

  export class ToggleShowProductCode {
    static readonly type = '[Products] Toggle Show Product Code';
  }
}

// State model
export interface ProductsStateModel {
  products: Product[];
  showProductCode: boolean;
  loading: boolean;
  errorMessage: string;
}

// State definition
@State<ProductsStateModel>({
  name: 'products',
  defaults: {
    products: [],
    showProductCode: true,
    loading: false,
    errorMessage: ''
  }
})
@Injectable()
export class ProductsState implements NgxsOnInit{
  constructor(private productsService: ProductsService,
    private router: Router
  ) {}
  
  ngxsOnInit(ctx: StateContext<ProductsStateModel>) {
    ctx.dispatch(new ProductsActions.LoadProducts());
  }

  @Selector([ProductsState])
  static getProducts(state: ProductsStateModel) {
    return state.products;
  }

  @Selector([ProductsState])
  static getShowProductCode(state: ProductsStateModel) {
    return state.showProductCode;
  }

  @Selector([ProductsState])
  static getLoading(state: ProductsStateModel) {
    return state.loading;
  }

  @Selector([ProductsState])
  static getErrorMessage(state: ProductsStateModel) {
    return state.errorMessage;
  }

  @Selector([ProductsState])
  static getProductsLength(state: ProductsStateModel) {
    return state.products.length;
  }

  // Create a selector that depends on getProducts
  static getProductById(id: number) {
    return createSelector(
      [ProductsState.getProducts],
      (products: Product[]) => products.find(product => product.id === id)
    );
  }



  @Action(ProductsActions.LoadProducts)
  loadProducts(ctx: StateContext<ProductsStateModel>) {
    ctx.patchState({ loading: true, errorMessage: '' });
    return this.productsService.getAll().pipe(
      tap({
        next: (products) => {
         console.log('Products loaded:', products); // Debug log
          ctx.patchState({ products, loading: false });
        },
        error: (error) => {
          console.error('Load error:', error); // Debug log
          ctx.patchState({ loading: false, errorMessage: error });
        }
      })
    );
  }

  @Action(ProductsActions.AddProduct)
  addProduct(ctx: StateContext<ProductsStateModel>, action: ProductsActions.AddProduct) {
    ctx.patchState({ loading: true, errorMessage: '' });
    return this.productsService.add(action.product).pipe(
      tap({
        next: (product) => {
          const state = ctx.getState();
          ctx.patchState({
            products: [...state.products, product],
            loading: false
          });
          this.router.navigate(['/products-ngxs']);
        },
        error: (error) => {
          ctx.patchState({ loading: false, errorMessage: error });
        }
      })
    );
  }

  @Action(ProductsActions.UpdateProduct)
  updateProduct(ctx: StateContext<ProductsStateModel>, action: ProductsActions.UpdateProduct) {
      ctx.patchState({ loading: true, errorMessage: '' });
      console.log('Updating product:', JSON.stringify(action.product)); 
      return this.productsService.update(action.product).pipe(
        tap({
          next: (response) => {
            const state = ctx.getState();
            // Use the original product if response is null
            const updatedProduct = response || action.product;
            const products = state.products.map(p => 
              p.id === updatedProduct.id ? updatedProduct : p
            );
            ctx.patchState({ products, loading: false });
            this.router.navigate(['/products-ngxs']);
          },
          error: (error) => {
            ctx.patchState({ loading: false, errorMessage: error });
          }
        })
      );
  }

  @Action(ProductsActions.DeleteProduct)
  deleteProduct(ctx: StateContext<ProductsStateModel>, action: ProductsActions.DeleteProduct) {
    ctx.patchState({ loading: true, errorMessage: '' });
    return this.productsService.delete(action.id).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          ctx.patchState({
            products: state.products.filter(p => p.id !== action.id),
            loading: false
          });
          this.router.navigate(['/products-ngxs']);
        },
        error: (error) => {
          ctx.patchState({ loading: false, errorMessage: error });
        }
      })
    );
  }

  @Action(ProductsActions.ToggleShowProductCode)
  toggleShowProductCode(ctx: StateContext<ProductsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      showProductCode: !state.showProductCode
    });
  }
}