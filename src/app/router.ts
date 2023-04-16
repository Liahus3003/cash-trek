import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { isLoggedGuardFn } from '@shared/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'cash-book',
    canActivate: [isLoggedGuardFn],
    loadComponent: () =>
      import('./modules/cash-book/cash-book.component').then(
        m => m.CashBookComponent
      ),
  },
  {
    path: 'configuration',
    canActivate: [isLoggedGuardFn],
    loadComponent: () =>
      import('./modules/categories/categories.component').then(
        m => m.CategoriesComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [isLoggedGuardFn],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'monthly-summary',
    canActivate: [isLoggedGuardFn],
    loadComponent: () =>
      import('./modules/monthly-summary/monthly-summary.component').then(
        m => m.MonthlySummaryComponent
      ),
  },
  {
    path: 'yearly-summary',
    canActivate: [isLoggedGuardFn],
    loadComponent: () =>
      import('./modules/yearly-summary/yearly-summary.component').then(
        m => m.YearlySummaryComponent
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
