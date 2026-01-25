import { Component, OnDestroy, OnInit , inject, signal } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { Snackbar } from '../../core/services/snackbar';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { Account } from '../../core/services/account';
import { first, firstValueFrom, single } from 'rxjs';
import { CheckoutDelivery } from './checkout-delivery/checkout-delivery';
import { CheckoutReview } from "./checkout-review/checkout-review";
import { CartService } from '../../core/services/CartService';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummary,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDelivery,
    CheckoutReview,
    CurrencyPipe,
    MatProgressSpinnerModule
],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit , OnDestroy{
  private stripeService = inject(StripeService);
  private accountService = inject(Account);
  private router = inject(Router);
  private snackBar = inject(Snackbar);
  cartService = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completionStatus = signal<{address: boolean, card: boolean, delivery: boolean}>(
    {address: false, card: false, delivery: false}
  )
  confiramtionToken?: ConfirmationToken;
  loading = false;

  async ngOnInit(){
    try{
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
    }catch(error : any){
        this.snackBar.error(error.message);
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
  this.completionStatus.update(status => ({
    ...status,
    address: event.complete
  }));
  };

  handleDeliveryChange = (event: boolean) => {
    this.completionStatus.update(status => ({
      ...status,
      delivery: event
    }));
  };

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    console.log('payment complete:', event.complete);
    this.completionStatus.update(status => ({
      ...status,
      card: event.complete
    }));
  };

  async getConfirmetionToken() {
    try{
      if(Object.values(this.completionStatus()).every(status => status === true)){
        const result =await this.stripeService.createConfirmationToken();
        if(result.error) throw new Error(result.error.message);
        this.confiramtionToken = result.confirmationToken;
        console.log(this.confiramtionToken);
      }

    }catch(error : any){
      this.snackBar.error(error.message);
    }
  }

  async onStepChange(event : StepperSelectionEvent){
    if(event.selectedIndex === 1){
      if(this.saveAddress){
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if(event.selectedIndex === 2){
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if(event.selectedIndex === 3){
      await this.getConfirmetionToken();
    }
  }

  async confirmPayment(stepper: MatStepper){
    this.loading = true;
    try{
      if(this.confiramtionToken){
        const result = await this.stripeService.confirmPayment(this.confiramtionToken);
        if(result.error) throw new Error(result.error.message);
        else{
          this.cartService.deleteCart();
          this.cartService.selectedDelivery.set(null);
          this.router.navigateByUrl('/checkout/success');
        }
      }

    }catch(error : any){
      this.snackBar.error(error.message || "somthing went wrong");
      stepper.previous();
    }finally{
      this.loading = false;
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | null> {
  const result = await this.addressElement?.getValue();
  const address = result?.value.address;

  if (address) {
    return {
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postal_code,      
      country: address.country
    };
  }

  return null;
  }


  onSaveAddressChekcBoxChange(event: MatCheckboxChange){
    this.saveAddress = event.checked;
  }

  ngOnDestroy() : void {
    this.stripeService.disposeElements();
  }

}
