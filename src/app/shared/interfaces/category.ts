export interface Category {
  name: string;
  type: string;
  isActive?: boolean;
  status?: boolean;
  description: string;
  createdDate?: Date;
  updatedDate?: Date;
  actions?: string[];
}
