import { AsyncPipe, NgIf } from '@angular/common';
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
import { CategoryService } from './categories.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { Category } from '@shared/interfaces/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    CheckboxComponent,
    SelectComponent,
    TextareaComponent,
    RadioComponent,
    InputComponent,
    DefaultButtonComponent,
    CardWrapperComponent,
    CustomTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  private _lookupStream = new Subject<Category[]>();
  lookupObs = this._lookupStream.asObservable();

  lookupInfoForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    description: [''],
  });
  VIEW_MODE = 'Add';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastService: HotToastService
  ) {
    this.getLookupInfo();
  }

  submitForm(): void {
    if (!this.lookupInfoForm.valid) {
      return;
    }
    const requestData = {
      name: this.lookupInfoForm.value.name ?? '',
      type: this.lookupInfoForm.value.type ?? '',
      description: this.lookupInfoForm.value.description ?? '',
    };

    this.categoryService.addCategory(requestData).subscribe({
      next: res => {
        this.toastService.success('Lookup added Successfully!');
        this.getLookupInfo();
        this.resetForm();
      },
      error: e => this.toastService.error('Unable to add Lookup!'),
    });
  }

  resetForm(): void {
    this.lookupInfoForm.reset();
  }

  getLookupInfo(): void {
    this.categoryService
      .getAllcategories()
      .subscribe(data => this._lookupStream.next(data));
  }

  mapAction(id: number, type: string): void {
    console.log(id, type);
  }
}
