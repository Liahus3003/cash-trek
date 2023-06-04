export interface Expense {
  _id?: string;
  name: string;
  amount: number;
  category: string;
  transactionType: string;
  date: Date | string;
  notes: string;
  site: string;
  isRebill: boolean;
  isSubscription: boolean;
  paymentMode: string;
  createdDate?: Date;
  updatedDate?: Date;
  isActive?: boolean,
  actions?: string[];
}
