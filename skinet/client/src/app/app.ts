import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';
import { shopService } from './core/services/shop';
import { Shopcomponent } from "./features/shop/shop";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Shopcomponent], //RouterOutlet
  templateUrl: './app.html',
  styleUrls: ['./app.scss']

})
export class AppComponent {
  title = 'Skinet'
}
