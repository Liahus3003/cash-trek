import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { routes } from './router';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MonthlySummaryComponent } from './modules/monthly-summary/monthly-summary.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavigationTabComponent } from './shared/components/navigation-tab/navigation-tab.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';
import { RadioComponent } from '@shared/components/radio/radio.component';
import { InputComponent } from '@shared/components/input/input.component';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { SlimScrollDirective } from '@shared/directives/slimscroll.directive';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CardWrapperComponent } from './shared/components/card-wrapper/card-wrapper.component';
import { CashBookComponent } from './modules/cash-book/cash-book.component';
import { CreditCommitmentComponent } from './modules/credit-commitment/credit-commitment.component';
import { YearlySummaryComponent } from './modules/yearly-summary/yearly-summary.component';
import { CategoriesComponent } from './modules/categories/categories.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MonthlySummaryComponent,
    YearlySummaryComponent,
    CreditCommitmentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgxChartsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HeaderComponent,
    NavigationTabComponent,
    CheckboxComponent,
    SelectComponent,
    TextareaComponent,
    RadioComponent,
    InputComponent,
    DefaultButtonComponent,
    CardWrapperComponent,
    SlimScrollDirective,
    CashBookComponent,
    CategoriesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
