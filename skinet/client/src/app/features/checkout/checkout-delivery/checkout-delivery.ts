import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService  } from '../../../core/services/checkout';
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/CartService';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  standalone: true,
  imports: [
    MatRadioModule,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.html',
  styleUrls: ['./checkout-delivery.scss']
})
export class CheckoutDelivery implements OnInit {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();
  
  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        const deliveryId = this.cartService.cart()?.deliveryMethodId;
        if (!deliveryId) return;

        const method = methods.find(x => x.id === deliveryId);
        if (!method) return;

        queueMicrotask(() => {
          this.cartService.selectedDelivery.set(method);
          this.deliveryComplete.emit(true);
        });
      }
    });
  }

  updateDeliveryMethodById(methodId: number) {
    const method = this.checkoutService.deliveryMethods.find(x => x.id === methodId);
    if (!method) return;

    this.cartService.selectedDelivery.set(method);

    const cart = this.cartService.cart();
    if (cart) {
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);
      this.deliveryComplete.emit(true);
    }
  }
}
