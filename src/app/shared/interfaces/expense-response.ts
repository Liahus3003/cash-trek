export interface ExpenseResponse {
  name: string;
  details: {
    amount: number;
    category: string;
  };
  meta: {
    payment: string;
    transaction: string;
  };
  reason: {
    date: Date;
    notes: string;
  }
  subscription: {
    subscribed: boolean;
    site: string;
  };
  rebill: boolean;
  actions?: string[];
}
