import { Expense } from "./expense";

export interface Transaction {
    expenses: Expense;
    totalExpenses: number;
}
