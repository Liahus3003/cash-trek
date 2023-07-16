import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Expense } from '@shared/interfaces/expense';
import { ExpenseInfo } from '@shared/interfaces/expense-sum';
import { ExpenseByDay } from '@shared/interfaces/expense-day';

@Injectable({
  providedIn: 'root',
})
export class MonthlySummaryService {
  private readonly expenseSummaryUrl = 'http://localhost:3100/api/expense-summary';
  
  constructor(private http: HttpClient) {
  }

  // Get all expenses for a month
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExpensesByMonth(month: string, year: string, page: number, limit: number): Observable<any> {
    return this.http.get<Expense[]>(`${this.expenseSummaryUrl}/monthly-expense?month=${month}&year=${year}&page=${page}&limit=${limit}`).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((data: any) => {
        if (data?.expenses?.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.expenses = data.expenses.map((info: any) => {
            return {
              _id: info._id ?? '',
              name: info.name,
              amount: info.amount,
              type: info.transactionType,
              category: info.category,
              description: info.notes,
              status: info.isActive
            }
          });
        }
        return data;
      })
    );
  }

  // Get expenses by month for each day
  getExpensesByMonthPerDay(month: string, year: string): Observable<ExpenseByDay[]> {
    return this.http.get<ExpenseByDay[]>(`${this.expenseSummaryUrl}/expense-per-day?month=${month}&year=${year}`);
  }

  // Get Expenses based on Category Type for a month
  getMonthlyTransactionsByCategoryType(month: string, year: string): Observable<ExpenseInfo> {
    return this.http.get<ExpenseInfo>(`${this.expenseSummaryUrl}/grouped-monthly-expense?month=${month}&year=${year}`);
  }
}
