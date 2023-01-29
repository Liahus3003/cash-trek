import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { routes } from './router';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MonthlySummaryComponent } from './monthly-summary/monthly-summary.component';
import { YearlySummaryComponent } from './yearly-summary/yearly-summary.component';
import { CreditCommitmentComponent } from './credit-commitment/credit-commitment.component';
import { HeaderComponent } from './header/header.component';
import { NavigationTabComponent } from './navigation-tab/navigation-tab.component';
import { CheckboxComponent } from './shared/components/checkbox/checkbox.component';
import { SelectComponent } from './shared/components/select/select.component';
import { TextareaComponent } from './shared/components/textarea/textarea.component';
import { RadioComponent } from './shared/components/radio/radio.component';
import { InputComponent } from './shared/components/input/input.component';
import { DefaultButtonComponent } from './shared/components/default-button/default-button.component';

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
    DefaultButtonComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
