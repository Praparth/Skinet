import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { map, tap } from 'rxjs/operators';
import { Singnalr } from './singnalr';

@Injectable({
  providedIn: 'root'
})
export class Account {
  baseUrl = environment.apiUrl ;
  private http =inject(HttpClient);
  private singnalService = inject(Singnalr);
  currentUser = signal<User | null>(null);

    login (Values: any){
      let params = new HttpParams();
      params = params.append('useCookies', true);
      return this.http.post<User>(this.baseUrl + 'login', Values, {params}).pipe(
        tap(() => this.singnalService.createHubConnection())
      )
    }

    register(values:any){
      return this.http.post(this.baseUrl + 'account/register', values);
    }

    getUserInfo(){
      return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
       map(user => {                 
        this.currentUser.set(user);
        return user;
      })
      );
    }

    logout(){
      return this.http.post(this.baseUrl + 'account/logout', {}).pipe(
        tap(() => this.singnalService.stopHubConnection())
      );
    }

    updateAddress(address: Address){
      return this.http.post(this.baseUrl + 'account/address', address).pipe(
        tap(() => {
          this.currentUser.update(user => {
            if(user) user.address = address;
            return user;
          })
        })
      );
    }

    getAuthState(){
      return this.http.get<{isAuthenticated: boolean}>(this.baseUrl + 'account/auth-status');
    }
}