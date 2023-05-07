import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Expense } from '@shared/interfaces/expense';
import { ExpenseSum } from '@shared/interfaces/expense-sum';
import { MonthlySummaryComponent } from './monthly-summary.component';
import { ExpenseByDay } from '@shared/interfaces/expense-day';

@Injectable({
  providedIn: MonthlySummaryComponent,
})
export class MonthlySummaryService {
  private readonly expenseSummaryUrl = 'http://localhost:3100/api/expense-summary';
  
  constructor(private http: HttpClient) {
  }

  // Get all expenses for a month
  getExpensesByMonth(month: string, year: string, page: number, limit: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.expenseSummaryUrl}/monthly-expense?month=${month}&year=${year}&page=${page}&limit=${limit}`);
  }

  // Get expenses by month for each day
  getExpensesByMonthPerDay(month: string, year: string, page: number, limit: number): Observable<ExpenseByDay[]> {
    return this.http.get<ExpenseByDay[]>(`${this.expenseSummaryUrl}/expense-per-day?month=${month}&year=${year}&page=${page}&limit=${limit}`);
  }

  // Get Expenses based on Category Type for a month
  getMonthlyTransactionsByCategoryType(month: string, year: string): Observable<ExpenseSum[]> {
    return this.http.get<ExpenseSum[]>(`${this.expenseSummaryUrl}/grouped-monthly-expense?month=${month}&year=${year}`);
  }
}
