import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxsModule } from '@ngxs/store';
import { InMemoryDataService } from './in-memory-data.service';
import { ProductsState } from './product-ngxs/state/products.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      InMemoryWebApiModule.forRoot(InMemoryDataService, {
        dataEncapsulation: false,
        delay: 500,
        passThruUnknownUrl: true,
      })
    ),
    importProvidersFrom([
      NgxsModule.forRoot([ProductsState]),
      NgxsReduxDevtoolsPluginModule.forRoot()
    ])
  ]
};
