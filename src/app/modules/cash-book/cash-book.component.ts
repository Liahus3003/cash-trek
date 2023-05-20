import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
import { CashBookService } from './cash-book.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { Wishlist } from '@shared/interfaces/wishlist';
import { CategoryService } from '../categories/categories.service';
import { Category } from '@shared/interfaces/category';
import { ExpenseResponse } from '@shared/interfaces/expense-response';

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
    NgIf,
    NgFor,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBookComponent {
  private _expenseModeStream = new Subject<ExpenseResponse>();
  private _expenseStream = new Subject<ExpenseResponse[]>();
  private _wishlistModeStream = new Subject<Wishlist>();
  private _wishlistStream = new Subject<Wishlist[]>();
  private _lookupStream = new Subject<Category[]>();
  lookupObs = this._lookupStream.asObservable();

  expenseModeObs = this._expenseModeStream.asObservable();
  expenseObs = this._expenseStream.asObservable();
  wishlistModeObs = this._wishlistModeStream.asObservable();
  wishlistObs = this._wishlistStream.asObservable();
  expenseInfoForm = this.fb.group({
    name: ['', Validators.required],
    amount: [0, Validators.required],
    transactionType: ['', Validators.required],
    date: [new Date(), Validators.required],
    notes: [''],
    category: ['', Validators.required],
    paymentMode: ['', Validators.required],
    isSubscription: [false, Validators.required],
    rebill: [false, Validators.required],
    site: ['', Validators.required],
  });

  wishlistForm = this.fb.group({
    name: ['', Validators.required],
    budget: [0, Validators.required],
    notes: [''],
    priority: [false, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private cashBookService: CashBookService,
    private categoryService: CategoryService,
    private toastService: HotToastService
  ) {
    this.listenToModeChange();
    this.getExpenseInfo();
    this.getWishlistInfo();
    this.getLookupInfo();
  }

  listenToModeChange(): void {
    this.expenseModeObs.subscribe(data => {
      if (data) {
        console.log(data);
      }
    });
    this.wishlistModeObs.subscribe(data => {
      if (data) {
        console.log(data);
      }
    });
  }

  patchExpenseForm(data: ExpenseResponse): void {
    this.expenseInfoForm.patchValue({
      name: data.name,
      amount: data.details.amount,
      transactionType: data.meta.transaction,
      date: data.reason.date,
      notes: data.reason.notes,
      category: data.details.category,
      paymentMode: data.meta.payment,
      isSubscription: data.subscription.subscribed,
      rebill: data.rebill,
      site: data.subscription.site,
    });
  }

  patchWishlistForm(data: Wishlist): void {
    this.wishlistForm.patchValue({
      name: data.name,
      budget: data.budget,
      notes: data.notes,
      priority: data.priority,
    });
  }

  getLookupInfo(): void {
    this.categoryService
      .getAllcategories()
      .subscribe(data => {
        this._lookupStream.next(data.filter(info => info.type === 'Category'));
      });
  }

  expenseAction(event: any): void {
    if (event.type === 'edit') {
      // this.editExpense(event.id);
      this._expenseModeStream.next(event.data);
    } else if (event.type === 'delete') {
      this.deleteExpense(event.id);
    }
  }

  editExpense(id: string): void {
    this.cashBookService
    .deleteExpenses(id)
    .subscribe(data => {
      this.toastService.success('Expense edited Successfully!');
      this.getExpenseInfo();
    });
  }

  deleteExpense(id: string): void {
    this.cashBookService
    .deleteExpenses(id)
    .subscribe(data => {
      this.toastService.success('Expense deleted Successfully!');
      this.getExpenseInfo();
    });
  }

  submitExpenseForm(): void {
    const requestData = {
      name: this.expenseInfoForm.value.name ?? '',
      amount: this.expenseInfoForm.value.amount ?? 0,
      category: this.expenseInfoForm.value.category ?? '',
      transactionType: this.expenseInfoForm.value.transactionType ?? '',
      date: this.expenseInfoForm.value.date ?? new Date(),
      notes: this.expenseInfoForm.value.notes ?? '',
      site: this.expenseInfoForm.value.site ?? '',
      isRebill: this.expenseInfoForm.value.rebill ?? false,
      isSubscription: this.expenseInfoForm.value.isSubscription ?? false,
      paymentMode: this.expenseInfoForm.value.paymentMode ?? ''
    };
    this.cashBookService.addExpense(requestData).subscribe({
      next: res => {
        this.toastService.success('Expense added Successfully!');
        this.getExpenseInfo();
        this.resetExpenseForm();
      },
      error: e => this.toastService.error('Unable to add Expense!'),
    });
  }

  getExpenseInfo(): void {
    this.cashBookService
      .getAllExpenses()
      .subscribe(data => this._expenseStream.next(data));
  }

  resetExpenseForm(): void {
    this.expenseInfoForm.reset();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wishlistAction(event: any): void {
    console.log(event);
    if (event.type === 'edit') {
      // this.editWishlist(event.id);
      this._wishlistModeStream.next(event.data);
    } else if (event.type === 'delete') {
      this.deleteWishlist(event.id);
    }
  }

  editWishlist(id: string): void {
    this.cashBookService
    .deleteExpenses(id)
    .subscribe(data => {
      this.toastService.success('Wishlist edited Successfully!');
      this.getExpenseInfo();
    });
  }

  deleteWishlist(id: string): void {
    this.cashBookService
    .deleteExpenses(id)
    .subscribe(data => {
      this.toastService.success('Wishlist deleted Successfully!');
      this.getExpenseInfo();
    });
  }

  submitWishlistForm(): void {
    const requestData = {
      name: this.wishlistForm.value.name ?? '',
      budget: this.wishlistForm.value.budget ?? 0,
      notes: this.wishlistForm.value.notes ?? '',
      priority: this.wishlistForm.value.priority ?? false,
    };
    this.cashBookService.addWishlist(requestData).subscribe({
      next: res => {
        this.toastService.success('Wishlist added Successfully!');
        this.getWishlistInfo();
        this.resetWishlistForm();
      },
      error: e => this.toastService.error('Unable to add Wishlist!'),
    });
  }

  resetWishlistForm(): void {
    this.wishlistForm.reset();
  }

  getWishlistInfo(): void {
    this.cashBookService
      .getAllWishlists()
      .subscribe(data => this._wishlistStream.next(data));
  }

  get isRebill() {
    return this.expenseInfoForm.value.isSubscription;
  }
}
