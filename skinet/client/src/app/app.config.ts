import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { Init } from './core/services/init';
import { lastValueFrom } from 'rxjs';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])),
    provideAppInitializer( async () => {
      const initService  = inject(Init);
      return  lastValueFrom(initService.init()).finally( () => {
        const splash = document.getElementById('initial-splash');
        if(splash){
          splash.remove();
        }
      })

    }),
    {
      provide : MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { autoFoucs : 'dialog' , restorFocus: true} 
    }
  ]
};
