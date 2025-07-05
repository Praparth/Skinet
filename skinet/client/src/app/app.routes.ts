import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Shopcomponent } from './features/shop/shop';
import { ProductDetails } from './features/shop/product-details/product-details';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', component: Shopcomponent},
    { path: 'shop/:id', component: ProductDetails },
    {path: '**', redirectTo: '',pathMatch: 'full'}
];
