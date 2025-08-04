import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Shopcomponent } from './features/shop/shop';
import { ProductDetails } from './features/shop/product-details/product-details';
import { TestError } from './features/test-error/test-error';
import { NotFound } from './shared/componets/not-found/not-found';
import { ServerError } from './shared/componets/server-error/server-error';
//import { CartService } from './core/services/CartService';
import { Cart } from './features/cart/cart'; 
import {Checkout} from './features/checkout/checkout'


export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', component: Shopcomponent},
    { path: 'shop/:id', component: ProductDetails },
    //{ path: 'cart', component: CartService },
    { path: 'cart', component: Cart }, 
    { path: 'checkout', component: Checkout }, 
    { path: 'test-error', component: TestError },
    { path: 'not-found', component: NotFound },
    { path: 'server-error', component: ServerError },
    {path: '**', redirectTo: 'not-found',pathMatch: 'full'}
];
