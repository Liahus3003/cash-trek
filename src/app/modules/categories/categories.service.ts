import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Category } from '@shared/interfaces/category';
import { DefaultResponse } from '@shared/interfaces/default-response';
import { CategoriesComponent } from './categories.component';

@Injectable({
  providedIn: CategoriesComponent,
})
export class CategoryService {
  private readonly categoryUrl = 'http://localhost:3100/api/lookup';
  
  constructor(private http: HttpClient) {
  }

  // Get all categories
  getAllcategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.categoryUrl}`);
  }

  // Get Category by ID
  getCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.categoryUrl}/${categoryId}`);
  }

  // Add new Category
  addCategory(categoryReq: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.categoryUrl}`, categoryReq);
  }

  // Update Category
  updateCategory(categoryId: string, categoryReq: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.categoryUrl}/${categoryId}`, categoryReq);
  }

  // Delete Category
  deleteCategory(categoryId: string): Observable<DefaultResponse> {
    return this.http.delete<DefaultResponse>(`${this.categoryUrl}/${categoryId}`);
  }
}
