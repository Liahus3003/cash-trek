import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { routes } from './router';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MonthlySummaryComponent } from './modules/monthly-summary/monthly-summary.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavigationTabComponent } from './shared/components/navigation-tab/navigation-tab.component';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { SlimScrollDirective } from '@shared/directives/slimscroll.directive';
import { CashBookComponent } from './modules/cash-book/cash-book.component';
import { YearlySummaryComponent } from './modules/yearly-summary/yearly-summary.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HotToastModule } from '@ngneat/hot-toast';
import { AuthInterceptor } from '@shared/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    HotToastModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HeaderComponent,
    NavigationTabComponent,
    DefaultButtonComponent,
    SlimScrollDirective,
    CashBookComponent,
    CategoriesComponent,
    DashboardComponent,
    MonthlySummaryComponent,
    YearlySummaryComponent,
    LoginComponent
  ],
  providers: [{ 
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
