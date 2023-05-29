export interface Wishlist {
  _id?: string;
  name: string;
  budget: number;
  date?: Date;
  createdDate?: Date;
  updatedDate?: Date;
  notes: string;
  priority: boolean;
  actions?: string[];
}
