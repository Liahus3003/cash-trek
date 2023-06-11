export interface ExpenseResponse {
  _id: string;
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
    date: Date | string;
    notes: string;
  }
  subscription: {
    subscribed: boolean;
    site: string;
  };
  rebill: string;
  actions?: string[];
}
