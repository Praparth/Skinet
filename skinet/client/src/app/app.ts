import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';
import { Product, products } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header], //RouterOutlet
  templateUrl: './app.html',
  styleUrls: ['./app.scss']

})
export class AppComponent implements OnInit  {
  baseurl = 'https://localhost:5001/api/';
  private http = inject(HttpClient)
  protected title = 'Skinet';
  products: Product[] = [];

  ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseurl + 'products').subscribe({
      next: response => {
              console.log('API Response:', response);
              this.products = response.data;
            },

      error: error => console.error(error),
      complete: () => console.log('Complete')
    })
  }
}
