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
import { CartService } from '../../../core/services/CartService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  private shopService = inject(shopService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef); // Add ChangeDetectorRef
  private cartService = inject(CartService);
  product?: Product
  quantityInCart = 0;
  quantity = 1;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id){ console.log(id); return};
    this.shopService.getProducts(+id).subscribe({
          next: product => {
      this.product = product;
      this.updateQuantityInCart();
      console.log('Loaded product:', product);
              this.cdr.detectChanges(); 
    },
      error: error => console.log(error)
    })
  }

  updateCart(){
    if(!this.product) return;
    if(this.quantity > this.quantityInCart){
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);
    }else{
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id,itemsToRemove);
    }
  }

  updateQuantityInCart(){
    this.quantityInCart = this.cartService.cart()?.items
      .find(x => x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;  
  }

  getButtonText(){
    return this.quantityInCart > 0 ? 'Update Cart' : 'Add to cart';
  }

}
