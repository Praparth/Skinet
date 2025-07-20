import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { shopService } from '../../../core/services/shop';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  private shopService = inject(shopService);
  private activatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef); // Add ChangeDetectorRef

  product?: Product

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id){ console.log(id); return};
    this.shopService.getProducts(+id).subscribe({
          next: product => {
      this.product = product;
      console.log('Loaded product:', product);
              this.cdr.detectChanges(); 
    },
      error: error => console.log(error)
    })
  }
}
