import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Account } from '../../../core/services/account';
import { Router } from '@angular/router';
import { Snackbar } from '../../../core/services/snackbar';
import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { TextInput } from "../../../shared/components/text-input/text-input";


@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCard,
    //MatFormField,
    //MatLabel,
    //MatInput,
    MatButton,
    //JsonPipe,
    //MatError,
    TextInput
],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private fb = inject(FormBuilder);
  private accountService = inject(Account);
  private router = inject(Router);
  private snack = inject(Snackbar);
   validationErrors: string[] = [];
  submitted = false;

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.submitted = true;        // ✅ Form submitted flag
    this.validationErrors = [];   // ✅ Clear previous errors

    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snack.success('Registration successful - you can now login');
        this.router.navigateByUrl('/account/login');
      },
      error: error => {
        console.log('Validation error:', error);
        this.validationErrors = error;
        this.cdr.detectChanges();
      }
    });
  }
}
