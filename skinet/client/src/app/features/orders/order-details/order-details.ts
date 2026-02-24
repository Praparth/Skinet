import { Component, inject, OnInit } from '@angular/core';
import { Order as OrderService } from '../../../core/services/order';
import { Order } from '../../../shared/models/orders';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card-pipe';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe,
    RouterLink
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss'
})
export class OrderDetails implements OnInit {

  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);

  order?: Order;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id) return;

    this.orderService.getOrderDetailed(+id).subscribe({
      next: order => this.order = order
    });

  }

}
