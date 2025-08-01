import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Snackbar } from '../services/snackbar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(Snackbar);

  return next(req).pipe(
    catchError((err : HttpErrorResponse) => {
      if(err.status === 400){
        if(err.error.errors){
            const modelStateErrors = [];
            for(const key in err.error.errors){
              if(err.error.errors[key]){
                modelStateErrors.push(err.error.errors[key]);
              }
            }
            throw modelStateErrors.flat();
        }else{
          snackbar.error(err.error.title || err.error);
        }
      }
      
      if(err.status === 401){
        snackbar.error(err.error.title || err.error);
      }
      
      if(err.status === 404){
        router.navigateByUrl('/not-found');
      }
      
      if(err.status === 500){
        const navigateByUrl: NavigationExtras = {state: {error :err.error }}
        router.navigateByUrl('/server-error', navigateByUrl);
      }

      return throwError(() => err);
    })
  );
};
