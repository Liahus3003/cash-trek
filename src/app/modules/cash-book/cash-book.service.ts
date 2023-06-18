import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Wishlist } from '@shared/interfaces/wishlist';
import { DefaultResponse } from '@shared/interfaces/default-response';
import { Expense } from '@shared/interfaces/expense';
import { User } from '@shared/interfaces/user';
import { ExpenseResponse } from '@shared/interfaces/expense-response';

@Injectable({
  providedIn: 'root',
})
export class CashBookService {
  private readonly wishlistUrl = 'http://localhost:3100/api/wishlists';
  private readonly expensesUrl = 'http://localhost:3100/api/expenses';

  userInfo!: User;
  
  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user-info');
    if (user) {
      this.userInfo = JSON.parse(user);
    }
  }

  // Get all wishlists
  getAllWishlists(): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${this.wishlistUrl}`).pipe(
      map(data => {
        if (data?.length) {
          const response: Wishlist[] = [];
          data.forEach(info => {
            response.push({
              _id: info._id,
              name: info.name,
              date: info.updatedDate,
              budget: info.budget ?? 0,
              notes: info.notes ?? '',
              priority: info.priority ?? false,
              actions: ['edit', 'delete'],
            });
          });
          return response;
        }
        return data;
      })
    );
  }

  // Get wishlist by ID
  getWishlistById(wishlistId: string): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.wishlistUrl}/${wishlistId}`);
  }

  // Add new wishlist
  addWishlist(wishlistReq: Partial<Wishlist>): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${this.wishlistUrl}`, {...wishlistReq});
  }

  // Update wishlist
  updateWishlist(wishlistId: string, wishlistReq: Partial<Wishlist>): Observable<Wishlist> {
    return this.http.put<Wishlist>(`${this.wishlistUrl}/${wishlistId}`, wishlistReq);
  }

  // Delete wishlist
  deleteWishlist(wishlistId: string): Observable<DefaultResponse> {
    return this.http.delete<DefaultResponse>(`${this.wishlistUrl}/${wishlistId}`);
  }

  // Get all expenses
  getAllExpenses(): Observable<ExpenseResponse[]> {
    return this.http.get<Expense[]>(`${this.expensesUrl}`).pipe(
      map(data => {
        if (data?.length) {
          const response: ExpenseResponse[] = [];
          data.forEach(info => {
            response.push({
              _id: info._id ?? '',
              name: info.name,
              details: {
                amount: info.amount ?? 0,
                category: info.category ?? '',
              },
              meta: {
                payment: info.paymentMode ?? '',
                transaction: info.transactionType ?? '',
              },
              reason: {
                date: info.date ?? new Date(),
                notes: info.notes ?? ''
              },
              subscription : {
                subscribed: info.isSubscription ?? false,
                site: info.site || 'NA',
              },
              rebill: info.rebill ?? '',
              actions: ['edit', info.isActive ? 'delete' : 'activate'],
            });
          });
          return response;
        }
        return [];
      })
    );
  }

  // Get expense by ID
  getExpenseById(expenseId: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.expensesUrl}/${expenseId}`);
  }

  // Add new expense
  addExpense(expenseReq: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(`${this.expensesUrl}`, {...expenseReq});
  }

  // Update expenses
  updateExpenses(expenseId: string, expenseReq: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.expensesUrl}/${expenseId}`, expenseReq);
  }

  // Delete expenses
  deleteExpenses(expenseId: string): Observable<DefaultResponse> {
    return this.http.delete<DefaultResponse>(`${this.expensesUrl}/${expenseId}`);
  }
}
