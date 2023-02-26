import { CashBookComponent } from "./modules/cash-book/cash-book.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MonthlySummaryComponent } from "./modules/monthly-summary/monthly-summary.component";
import { Routes } from "@angular/router";
import { YearlySummaryComponent } from "./modules/yearly-summary/yearly-summary.component";
import { CategoriesComponent } from "./modules/categories/categories.component";

export const routes: Routes = [
    {path: 'cash-book', component: CashBookComponent},
    {path: 'categories', component: CategoriesComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'monthly-summary', component: MonthlySummaryComponent},
    {path: 'yearly-summary', component: YearlySummaryComponent},
    {path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    {path: '**', redirectTo: 'dashboard'}
];
