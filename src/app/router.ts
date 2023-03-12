import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cash-book',
    loadComponent: () =>
      import('./modules/cash-book/cash-book.component').then(
        m => m.CashBookComponent
      ),
  },
  {
    path: 'configuration',
    loadComponent: () =>
      import('./modules/categories/categories.component').then(
        m => m.CategoriesComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'monthly-summary',
    loadComponent: () =>
      import('./modules/monthly-summary/monthly-summary.component').then(
        m => m.MonthlySummaryComponent
      ),
  },
  {
    path: 'yearly-summary',
    loadComponent: () =>
      import('./modules/yearly-summary/yearly-summary.component').then(
        m => m.YearlySummaryComponent
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
