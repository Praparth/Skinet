import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/CartService';
import { CartItemComponent   } from "./cart-item/cart-item.component";
import { OrderSummary } from '../../shared/components/order-summary/order-summary';

@Component({
  selector: 'app-cart',
  standalone:true,
  imports: [CartItemComponent,OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  cartService = inject(CartService);
  
}
