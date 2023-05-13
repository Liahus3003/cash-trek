export interface Wishlist {
  name: string;
  budget: number;
  createdDate?: Date;
  updatedDate?: Date;
  notes: string;
  priority: boolean;
  actions?: string[];
}
