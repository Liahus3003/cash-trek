import { NgIf } from '@angular/common';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  categoryInfoForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });
  VIEW_MODE = 'Add';
  constructor(private fb: FormBuilder) {}
}
