import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  loading = false;
  busyRequeatCount = 0 ;

  busy(){
    this.busyRequeatCount++;
    this.loading = true;
  }

  idle(){
    this.busyRequeatCount--;
    if(this.busyRequeatCount <= 0){
      this.busyRequeatCount = 0;
      this.loading = false;
    }
  }
}
