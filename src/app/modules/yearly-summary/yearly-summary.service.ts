import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Expense } from '@shared/interfaces/expense';
import { ExpenseSum } from '@shared/interfaces/expense-sum';
import { ExpenseByDay } from '@shared/interfaces/expense-day';
import { YearlySummaryComponent } from './yearly-summary.component';

@Injectable({
  providedIn: YearlySummaryComponent,
})
export class YearlySummaryService {
  private readonly expenseSummaryUrl = 'http://localhost:3100/api/expense-summary';
  
  constructor(private http: HttpClient) {
  }

  // Get all expenses for a year
  getExpensesByYear(year: string, page: number, limit: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.expenseSummaryUrl}/yearly-expense?year=${year}&page=${page}&limit=${limit}`);
  }

  // Get expenses by year for each month
  getExpensesByYearPerDay(year: string, page: number, limit: number): Observable<ExpenseByDay[]> {
    return this.http.get<ExpenseByDay[]>(`${this.expenseSummaryUrl}/expense-per-day?year=${year}&page=${page}&limit=${limit}`);
  }

  // Get Expenses based on Category Type for a year
  getYearlyTransactionsByCategoryType(year: string): Observable<ExpenseSum[]> {
    return this.http.get<ExpenseSum[]>(`${this.expenseSummaryUrl}/grouped-yearly-expense?year=${year}`);
  }
}
