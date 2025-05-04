import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsSignalService {
  private productsAPIUrl = 'api/products';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<Product[]>(this.productsAPIUrl)
      .pipe(catchError(this.handleError));
  }

  getById(id: number) {
    return this.http
      .get<Product>(`${this.productsAPIUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  add({ name, price }: Product): Observable<Product> {
    return this.http
      .post<Product>(this.productsAPIUrl, { name, price })
      .pipe(catchError(this.handleError));
  }

  update(product: Product): Observable<Product> {
    const url = `${this.productsAPIUrl}/${product.id}`; // Add product.id to URL
    return this.http
      .put<Product>(url, product)
      .pipe(catchError(this.handleError));
}

  delete(id: number): Observable<unknown> {
    const url = `${this.productsAPIUrl}/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  private handleError({ status, error }: HttpErrorResponse) {
    // Only treat non-200 status codes as errors
    if (status !== 200) {
      return throwError(() => `${status}: Something bad happened.`);
    }
    return throwError(() => error);
  }
}
