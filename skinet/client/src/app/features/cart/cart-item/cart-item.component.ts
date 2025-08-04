import { Component , inject, input } from '@angular/core';
import { CartItem } from '../../../shared/models/cart';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/CartService';

@Component({
  selector: 'app-cart-item',
  standalone:true,
  imports: [
    RouterLink,
    MatIcon,
    MatButton,
    CurrencyPipe
  ],
  templateUrl: './cart-item.component.html',  
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent   {
  item = input.required<CartItem>();
  cartService = inject(CartService);

  
  incrementQuantity(){
    this.cartService.addItemToCart(this.item());
  }

  decrimentQuantity(){
    this.cartService.removeItemFromCart(this.item().productId);
  }

  removeItemFormCart(){
    this.cartService.removeItemFromCart(this.item().productId , this.item().quantity);
  }
}
