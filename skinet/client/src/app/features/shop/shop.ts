import { Component, inject, OnInit } from '@angular/core';
import { shopService } from '../../core/services/shop';
import { Product } from '../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialog } from './filters-dialog/filters-dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule, NgModel } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-shop',
  imports: [
    
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
],
  templateUrl: './shop.html',
  styleUrl: './shop.scss'
})
export class Shopcomponent implements OnInit {

  // Inside the component
  private cdr = inject(ChangeDetectorRef);
  private shopService = inject(shopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;
  sortOptions = [ 
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'},
  ]
  shopParams = new ShopParams();
  pageSizeOptions = [5,10,15,20];

  ngOnInit(): void {
    this.initializeShop();
  }
  
  initializeShop(){
        this.getProducts();
        this.shopService.getBrands();
        this.shopService.getTypes();
    }

    // getProducts() {
    //   this.shopService.getProduct(this.shopParams).subscribe({
    //     next: response => {
    //             console.log('API Response:', response);
    //             this.products = response;
    //           },
    //     error: error => console.error(error),
    //     complete: () => console.log('Complete')
    //   })
    // }

    getProducts() {
  this.shopService.getProduct(this.shopParams).subscribe({
    next: response => {
      console.log('API Response:', response);
      this.products = response;

      // 💡 Manually trigger change detection
      this.cdr.detectChanges();
    },
    error: error => console.error(error),
    complete: () => console.log('Complete')
  });
}


    onSearchChnage(){
      this.shopParams.pageNumber = 1 ;
      this.getProducts();
    }

    handlePageEvent(event: PageEvent){
      this.shopParams.pageNumber = event.pageIndex + 1;
      this.shopParams.pageSize = event.pageSize;
      this.getProducts();
    }

    onSortChange(event: MatSelectionListChange){
      const selectedOption = event.options[0];
      if(selectedOption){
        this.shopParams.sort = selectedOption.value;
        console.log(this.shopParams.sort);
        this.shopParams.pageNumber = 1;
        this.getProducts();
      }
    }

  openFiltersDialpg(){
    const dialogRef = this.dialogService.open(FiltersDialog , {
      minWidth: '500px',
      data:{
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result){
          console.log(result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          // this.shopService.getProduct(this.selectedBrands , this.selectedTypes).subscribe({
          //   next: Response => this.products = Response.data,
          //   error: error => console.log(error)
            
          // })
          this.shopParams.pageNumber = 1;
          this.getProducts();
        }
      }
    })
  }
}
