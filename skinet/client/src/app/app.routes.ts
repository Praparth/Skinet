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
import { Login } from './features/account/login/login';
import { Register } from './features/account/register/register';
import { authGuard } from './core/guards/auth-guard';
import { CheckoutSuccess } from './features/checkout/checkout-success/checkout-success';
import { OrderComponent } from './features/orders/order';
import { OrderDetails } from './features/orders/order-details/order-details';
import { orderCompleteGuard } from './core/guards/order-complete-guard';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', component: Shopcomponent},
    { path: 'shop/:id', component: ProductDetails },
    //{ path: 'cart', component: CartService },
    { path: 'cart', component: Cart }, 
    { path: 'checkout', component: Checkout , canActivate: [authGuard]}, 
    { path: 'checkout/success', component: CheckoutSuccess , canActivate: [authGuard, orderCompleteGuard]}, 
    { path: 'orders', component: OrderComponent , canActivate: [authGuard]}, 
    { path: 'orders/:id', component: OrderDetails , canActivate: [authGuard]}, 
    { path: 'account/login', component: Login }, 
    { path: 'account/register', component: Register }, 
    { path: 'test-error', component: TestError },
    { path: 'not-found', component: NotFound },
    { path: 'server-error', component: ServerError },
    {path: '**', redirectTo: 'not-found',pathMatch: 'full'}
];
