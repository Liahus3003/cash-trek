import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardWrapperComponent } from '@shared/components/card-wrapper/card-wrapper.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { RadioComponent } from '@shared/components/radio/radio.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.less'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxComponent,
    SelectComponent,
    TextareaComponent,
    RadioComponent,
    InputComponent,
    DefaultButtonComponent,
    CardWrapperComponent,
    CustomTableComponent,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBookComponent {
  expenseInfoForm = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    date: ['', Validators.required],
    notes: [''],
    category: ['', Validators.required],
    paymentMode: ['', Validators.required],
    isSubscription: ['', Validators.required],
    rebill: ['', Validators.required],
    site: ['', Validators.required],
  });

  wishlistForm = this.fb.group({
    name: ['', Validators.required],
    budget: ['', Validators.required],
    notes: [''],
    priority: ['', Validators.required]
  });

  transactionData = [
    { no: 1, name: 'Food', type: 'Category', description: 'Items include food, beverages, snacks and cool drinks', status: 'Active', actions: ['edit', 'delete'] },
    { no: 2, name: 'Food', type: 'Category', description: 'Items include food, beverages, snacks and cool drinks', status: 'Active', actions: ['edit', 'delete'] },
    { no: 3, name: 'Food', type: 'Category', description: 'Items include food, beverages, snacks and cool drinks', status: 'Active', actions: ['edit', 'delete'] },
  ];
  wsihlishData = [
    {no: 1, name: 'Food', budget: '$300', description: 'Items include food, beverages, snacks and cool drinks', priority: 'Yes', actions: ['edit', 'delete']},
    {no: 2, name: 'Food', budget: '$300', description: 'Items include food, beverages, snacks and cool drinks', priority: 'No', actions: ['edit', 'delete']},
    {no: 3, name: 'Food', budget: '$300', description: 'Items include food, beverages, snacks and cool drinks', priority: 'Yes', actions: ['edit', 'delete']}
  ];

  constructor(private fb: FormBuilder) {}

  submitExpenseForm(): void {
    console.log(this.expenseInfoForm.value);
  }

  resetExpenseForm(): void {
    this.expenseInfoForm.reset();
  }

  submitWishlistForm(): void {
    console.log(this.wishlistForm.value);
  }

  resetWishlistForm(): void {
    this.wishlistForm.reset();
  }

  get isRebill() {
    return this.expenseInfoForm.value.isSubscription;
  }
}
