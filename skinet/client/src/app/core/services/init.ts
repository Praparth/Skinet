import { inject, Injectable } from '@angular/core';
import { CartService } from './CartService';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Init {
  private cartSevice = inject(CartService);

  init(){
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartSevice.getCart(cartId) : of(null)
    
    return cart$;
  }
  
}
