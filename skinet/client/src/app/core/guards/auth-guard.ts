import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account } from '../services/account';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(Account);
  const router = inject(Router);

  if(accountService.currentUser()){
    return of(true);
  }else{
    router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
};
