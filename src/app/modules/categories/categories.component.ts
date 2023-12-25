import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
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
import { BehaviorSubject, Subject } from 'rxjs';
import { Category } from '@shared/interfaces/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
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
  @ViewChild('lookupSource') lookupSourceElement!: ElementRef;
  private _lookupModeStream = new BehaviorSubject<Partial<Category>>({
    _id: undefined,
  });
  private _lookupStream = new Subject<Category[]>();
  lookupObs = this._lookupStream.asObservable();
  lookupModeObs = this._lookupModeStream.asObservable();

  lookupInfoForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    description: [''],
  });

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastService: HotToastService
  ) {
    this.listenToModeChange();
    this.getLookupInfo();
  }

  listenToModeChange(): void {
    this.lookupModeObs.subscribe((data: Partial<Category>) => {
      if (data) {
        this.patchCategoryForm(data);
        this.lookupSourceElement?.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }

  patchCategoryForm(data: Partial<Category>): void {
    if (!data?._id) {
      return;
    }
    this.lookupInfoForm.patchValue({
      name: data.name,
      type: data.type,
      description: data.description
    });
  }

  submitForm(lookupInfo: Partial<Category>): void {
    if (!this.lookupInfoForm.valid) {
      return;
    }
    const requestData = {
      name: this.lookupInfoForm.value.name ?? '',
      type: this.lookupInfoForm.value.type ?? '',
      description: this.lookupInfoForm.value.description ?? '',
    };
    if (lookupInfo?._id) {
      this.editLookup(lookupInfo._id, requestData);
    } else {
      this.addLookup(requestData);
    }
  }

  addLookup(requestData: Partial<Category>): void {
    this.categoryService.addCategory(requestData).subscribe({
      next: res => {
        this.toastService.success('Lookup added Successfully!');
        this.getLookupInfo();
        this.resetForm();
      },
      error: e => this.toastService.error('Unable to add Lookup!'),
    });
  }

  editLookup(id: string, requestData: Partial<Category>): void {
    this.categoryService.updateCategory(id, requestData).subscribe(data => {
      this.resetLookupMode();
      this.toastService.success('Lookup edited Successfully!');
      this.getLookupInfo();
      this.resetForm();
    });
  }

  deleteLookup(id: string): void {
    this.categoryService.deleteCategory(id).subscribe(data => {
      this.toastService.success('Expense deleted Successfully!');
      this.getLookupInfo();
    });
  }

  resetForm(): void {
    this.lookupInfoForm.reset();
  }

  resetLookupMode(): void {
    this._lookupModeStream.next({
      _id: undefined,
    });
  }

  getLookupInfo(): void {
    this.categoryService
      .getAllcategories()
      .subscribe(data => this._lookupStream.next(data));
  }

  mapAction(id: number, type: string): void {
    console.log(id, type);
  }

  categoryAction(event: any): void {
    if (event.type === 'edit') {
      this._lookupModeStream.next(event.data);
    } else if (event.type === 'delete') {
      this.deleteLookup(event.id);
    }
  }
}
