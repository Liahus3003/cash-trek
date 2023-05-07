import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { DashboardComponent } from './dashboard.component';
import { Transaction } from '@shared/interfaces/transaction';
import { Expense } from '@shared/interfaces/expense';
import { ExpenseSum } from '@shared/interfaces/expense-sum';

@Injectable({
  providedIn: DashboardComponent,
})
export class DashboardService {
  private readonly dashboardUrl = 'http://localhost:3100/api/dashboard';
  
  constructor(private http: HttpClient) {
  }

  // Get all expenses for last 6 months
  getLastSixMonthsExpense(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.dashboardUrl}/last-six-months-expense`);
  }

  // Get expenses by category for last 6 months
  getLastSixMonthsExepnseSum(categoryType: string): Observable<ExpenseSum> {
    return this.http.get<ExpenseSum>(`${this.dashboardUrl}/last-six-months-expense-sum?categoryType=${categoryType}`);
  }

  // Get transactions based on criteria
  getTransactions(page: number, limit: number, transactionType: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.dashboardUrl}/transactions?page=${page}&limit=${limit}&transactionType=${transactionType}`);
  }
}
