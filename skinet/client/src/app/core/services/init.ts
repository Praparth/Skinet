import { inject, Injectable } from '@angular/core';
import { CartService } from './CartService';
import { forkJoin, of, tap } from 'rxjs';
import { Account } from './account';
import { Singnalr } from './singnalr';

@Injectable({
  providedIn: 'root'
})
export class Init {
  private cartSevice = inject(CartService);
  private accountService = inject(Account);
  private singnalService = inject(Singnalr); 

  init(){
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartSevice.getCart(cartId) : of(null)
    
    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo().pipe(
        tap(user => {
          if(user) this.singnalService.createHubConnection();
        })
      )
    });
  }
  
}
