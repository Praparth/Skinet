import { Component, inject, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card-pipe';
import { Singnalr } from '../../../core/services/singnalr';
import { Order } from '../../../core/services/order';

@Component({
  selector: 'app-checkout-success',
  imports: [
    MatButton,
    RouterLink,
    MatProgressSpinnerModule ,
    DatePipe,
    AddressPipe,
    CurrencyPipe,
    PaymentCardPipe
  ],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss'
})
export class CheckoutSuccess implements OnDestroy {
  singalService = inject(Singnalr);
  private orderService = inject(Order);

  ngOnDestroy(): void {
    this.orderService.orderComplete = false;
    this.singalService.orderSingnal.set(null);
  }
}
