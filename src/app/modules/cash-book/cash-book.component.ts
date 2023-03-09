import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardWrapperComponent } from '@shared/components/card-wrapper/card-wrapper.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
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

  constructor(private fb: FormBuilder) {}

  submitForm(): void {
    console.log(this.expenseInfoForm.value);
  }

  resetForm(): void {
    this.expenseInfoForm.reset();
  }
}
