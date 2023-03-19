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
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CheckboxComponent,
    SelectComponent,
    TextareaComponent,
    RadioComponent,
    InputComponent,
    DefaultButtonComponent,
    CardWrapperComponent,
    CustomTableComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  lookupInfoForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['']
  });
  VIEW_MODE = 'Add';
  categoriesData = [
    { no: 1, name: 'Food', type: 'Category', description: 'Items include food, beverages, snacks and cool drinks', status: 'Active', actions: ['edit', 'delete'] },
    { no: 2, name: 'Movie', type: 'Category', description: 'Items include food, beverages, snacks and cool drinks', status: 'Active', actions: ['edit', 'delete'] },
    { no: 3, name: '$', type: 'Currency', description: 'Currency of the U.S.A', status: 'Active', actions: ['edit', 'delete'] },
  ];

  constructor(private fb: FormBuilder) {}

  submitForm(): void {
    console.log(this.lookupInfoForm.value);
  }

  resetForm(): void {
    this.lookupInfoForm.reset();
  }

  mapAction(id: number, type: string): void {
    console.log(id, type);
  }
}
