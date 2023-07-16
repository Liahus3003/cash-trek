import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ExpenseInfo } from '@shared/interfaces/expense-sum';
import { ExpenseByDay } from '@shared/interfaces/expense-day';

@Injectable({
  providedIn: 'root',
})
export class YearlySummaryService {
  private readonly expenseSummaryUrl = 'http://localhost:3100/api/expense-summary';
  
  constructor(private http: HttpClient) {
  }

  // Get all expenses for a year
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExpensesByYear(year: string, page: number, limit: number): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any>(`${this.expenseSummaryUrl}/yearly-expense?year=${year}&page=${page}&limit=${limit}`).pipe(
      map(data => {
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

  // Get expenses by year for each month
  getExpensesByYearPerMonth(year: string): Observable<ExpenseByDay[]> {
    return this.http.get<ExpenseByDay[]>(`${this.expenseSummaryUrl}/expense-per-month?year=${year}`);
  }

  // Get Expenses based on Category Type for a year
  getYearlyTransactionsByCategoryType(year: string): Observable<ExpenseInfo> {
    return this.http.get<ExpenseInfo>(`${this.expenseSummaryUrl}/grouped-yearly-expense?year=${year}`);
  }
}
