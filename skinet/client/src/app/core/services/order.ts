import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order as OrderModel, OrderToCreate } from '../../shared/models/orders';

@Injectable({
  providedIn: 'root'
})
export class Order {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  orderComplete = false;

  createOrder(orderToCreate: OrderToCreate) {
    return this.http.post(this.baseUrl + 'orders', orderToCreate);
  }
  
  getOrdersForUser() {
    return this.http.get<OrderModel[]>(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number) {
    return this.http.get<OrderModel>(this.baseUrl + 'orders/' + id);
  }
}
