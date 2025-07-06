import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';
import { shopService } from './core/services/shop';
import { Shopcomponent } from "./features/shop/shop";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header], //Shopcomponent
  templateUrl: './app.html',
  styleUrls: ['./app.scss']

})
export class AppComponent {
  private cdr = inject(ChangeDetectorRef);
  title = 'Skinet'
}
