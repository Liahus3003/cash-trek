import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '@shared/interfaces/user';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3100/api/auth';
  private readonly tokenKey = 'token';
  private readonly userKey = 'user-info';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(this.isAuthenticated(token));
  }

  login(email: string, password: string): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(name: string, username: string, password: string): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>(`${this.baseUrl}/signup`, { name, email: username, password })
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(token: string | null): boolean {
    // Check if token is expired or not
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.exp > Date.now() / 1000;
    }
    return false;
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
