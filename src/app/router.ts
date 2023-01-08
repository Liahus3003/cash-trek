import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MonthlySummaryComponent } from "./monthly-summary/monthly-summary.component";
import { YearlySummaryComponent } from "./yearly-summary/yearly-summary.component";

export const routes: Routes = [
    {path: 'yearly-summary', component: YearlySummaryComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'monthly-summary', component: MonthlySummaryComponent},
    {path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    {path: '**', redirectTo: 'dashboard'}
];
