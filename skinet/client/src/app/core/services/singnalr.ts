import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Order } from '../../shared/models/orders';

@Injectable({
  providedIn: 'root'
})
export class Singnalr {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  orderSingnal = signal<Order | null>(null);

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl , {withCredentials : true})
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on('OrderCompletedNotification' , (order : Order) => {
        this.orderSingnal.set(order);
    })  
  }

  stopHubConnection() {
    if(this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection?.stop().catch(error => console.log(error));
    }
  }

}
