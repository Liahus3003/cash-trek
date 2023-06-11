import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
import { BehaviorSubject, Subject } from 'rxjs';
import { Wishlist } from '@shared/interfaces/wishlist';
import { CategoryService } from '../categories/categories.service';
import { Category } from '@shared/interfaces/category';
import { ExpenseResponse } from '@shared/interfaces/expense-response';
import { Expense } from '@shared/interfaces/expense';

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
    AsyncPipe,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBookComponent {
  @ViewChild('transactionSource') transactionSourceElement!: ElementRef;
  @ViewChild('wishlistSource') wishlistSourceElement!: ElementRef;

  private _expenseModeStream = new BehaviorSubject<Partial<ExpenseResponse>>({
    _id: undefined,
  });
  private _expenseStream = new Subject<ExpenseResponse[]>();
  private _wishlistModeStream = new BehaviorSubject<Partial<Wishlist>>({
    _id: undefined,
  });
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
    date: ['', Validators.required],
    notes: [''],
    category: ['', Validators.required],
    paymentMode: ['', Validators.required],
    isSubscription: [false, Validators.required],
    rebill: ['', Validators.required],
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
    this.expenseModeObs.subscribe((data: Partial<ExpenseResponse>) => {
      if (data) {
        this.patchExpenseForm(data);
        this.transactionSourceElement?.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
    this.wishlistModeObs.subscribe((data: Partial<Wishlist>) => {
      if (data) {
        this.patchWishlistForm(data);
        this.wishlistSourceElement?.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patchExpenseForm(data: Partial<ExpenseResponse>): void {
    if (!data?._id) {
      return;
    }
    this.expenseInfoForm.patchValue({
      name: data.name,
      amount: data?.details?.amount,
      transactionType: data?.meta?.transaction,
      date: data?.reason?.date?.toLocaleString().substring(0, 10),
      notes: data?.reason?.notes,
      category: data?.details?.category,
      paymentMode: data?.meta?.payment,
      isSubscription: data?.subscription?.subscribed,
      rebill: data.rebill,
      site: data?.subscription?.site,
    });
  }

  patchWishlistForm(data: Partial<Wishlist>): void {
    if (!data?._id) {
      return;
    }
    this.wishlistForm.patchValue({
      name: data.name,
      budget: data.budget,
      notes: data.notes,
      priority: data.priority,
    });
  }

  getLookupInfo(): void {
    this.categoryService.getAllcategories().subscribe(data => {
      this._lookupStream.next(data.filter(info => info.type === 'Category'));
    });
  }

  expenseAction(event: any): void {
    if (event.type === 'edit') {
      this._expenseModeStream.next(event.data);
    } else if (event.type === 'delete') {
      this.deleteExpense(event.id);
    }
  }

  getExpenseInfo(): void {
    this.cashBookService
      .getAllExpenses()
      .subscribe(data => this._expenseStream.next(data));
  }

  editExpense(id: string, requestData: Partial<Expense>): void {
    this.cashBookService.updateExpenses(id, requestData).subscribe(data => {
      this.resetExpenseMode();
      this.toastService.success('Transaction edited Successfully!');
      this.getExpenseInfo();
      this.resetExpenseForm();
    });
  }

  resetExpenseMode(): void {
    this._expenseModeStream.next({
      _id: undefined,
    });
  }

  deleteExpense(id: string): void {
    this.cashBookService.deleteExpenses(id).subscribe(data => {
      this.toastService.success('Transaction deleted Successfully!');
      this.getExpenseInfo();
    });
  }

  submitExpenseForm(expenseInfo?: Partial<ExpenseResponse>): void {
    const requestData = {
      name: this.expenseInfoForm.value.name ?? '',
      amount: this.expenseInfoForm.value.amount ?? 0,
      category: this.expenseInfoForm.value.category ?? '',
      transactionType: this.expenseInfoForm.value.transactionType ?? '',
      date: this.expenseInfoForm.value.date ?? new Date(),
      notes: this.expenseInfoForm.value.notes ?? '',
      site: this.expenseInfoForm.value.site ?? '',
      rebill: this.expenseInfoForm.value.rebill ?? '',
      isSubscription: this.expenseInfoForm.value.isSubscription ?? false,
      paymentMode: this.expenseInfoForm.value.paymentMode ?? '',
    };
    if (expenseInfo?._id) {
      this.editExpense(expenseInfo._id, requestData);
    } else {
      this.addExpense(requestData);
    }
  }

  addExpense(requestData: Partial<Expense>): void {
    this.cashBookService.addExpense(requestData).subscribe({
      next: res => {
        this.toastService.success('Transaction added Successfully!');
        this.getExpenseInfo();
        this.resetExpenseForm();
      },
      error: e => this.toastService.error('Unable to add Transaction!'),
    });
  }

  resetExpenseForm(): void {
    this.expenseInfoForm.reset();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wishlistAction(event: any): void {
    if (event.type === 'edit') {
      this._wishlistModeStream.next(event.data);
    } else if (event.type === 'delete') {
      this.deleteWishlist(event.id);
    }
  }

  getWishlistInfo(): void {
    this.cashBookService
      .getAllWishlists()
      .subscribe(data => this._wishlistStream.next(data));
  }

  addWishlist(requestData: Partial<Wishlist>): void {
    this.cashBookService.addWishlist(requestData).subscribe({
      next: res => {
        this.toastService.success('Wishlist added Successfully!');
        this.getWishlistInfo();
        this.resetWishlistForm();
      },
      error: e => this.toastService.error('Unable to add Wishlist!'),
    });
  }

  editWishlist(id: string, wishlist: Partial<Wishlist>): void {
    this.cashBookService.updateWishlist(id, wishlist).subscribe(data => {
      this.resetWishlistMode();
      this.resetWishlistForm();
      this.toastService.success('Wishlist edited Successfully!');
      this.getExpenseInfo();
    });
  }

  deleteWishlist(id: string): void {
    this.cashBookService.deleteExpenses(id).subscribe(data => {
      this.toastService.success('Wishlist deleted Successfully!');
      this.getExpenseInfo();
    });
  }

  submitWishlistForm(wishlistInfo?: Partial<Wishlist>): void {
    const requestData = {
      name: this.wishlistForm.value.name ?? '',
      budget: this.wishlistForm.value.budget ?? 0,
      notes: this.wishlistForm.value.notes ?? '',
      priority: this.wishlistForm.value.priority ?? false,
    };
    if (wishlistInfo?._id) {
      this.editWishlist(wishlistInfo._id, requestData);
    } else {
      this.addWishlist(requestData);
    }
  }

  resetWishlistForm(): void {
    this.wishlistForm.reset();
  }

  resetWishlistMode(): void {
    this._wishlistModeStream.next({
      _id: undefined,
    });
  }

  get isRebill() {
    return this.expenseInfoForm.value.isSubscription;
  }
}
