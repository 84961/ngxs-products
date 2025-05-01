import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Product } from './product-ngxs/product.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const products: Product[] = [
      { id: 1, price: 3, name: 'Hammer' },
      { id: 2, price: 2, name: 'Nails' },
      { id: 3, price: 4, name: 'Spanner' },
    ];
    return { products };
  }

  // Optional: Override genId to ensure unique IDs
  genId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }
}
