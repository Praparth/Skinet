import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Order as OrderService } from '../../core/services/order';
import { Order } from '../../shared/models/orders';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class OrderComponent implements OnInit {

  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);


  orders: Order[] = [];
  loading = true;

  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
        // 👇 Tell Angular to update UI
      this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}

