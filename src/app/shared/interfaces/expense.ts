export interface Expense {
  name: string;
  amount: number;
  category: string;
  transactionType: string;
  date: Date;
  notes: string;
  site: string;
  isRebill: boolean;
  isSubscription: boolean;
  paymentMode: string;
  createdDate: Date;
  updatedDate: Date;
}
