export interface ExpenseInfo {
    expenses: ExpenseSum[];
    averageComparison: number;
    overallTotal: number;
}

export interface ExpenseSum {
    categoryType: string;
    total: number;
}
