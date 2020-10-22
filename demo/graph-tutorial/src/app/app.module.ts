// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MsalModule } from '@azure/msal-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { OAuthSettings } from '../oauth';
import { CalendarComponent } from './calendar/calendar.component';
import { NewEventComponent } from './new-event/new-event.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    AlertsComponent,
    CalendarComponent,
    NewEventComponent
  ],
  // <imports>
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    MsalModule.forRoot({
      auth: {
        clientId: OAuthSettings.appId,
        redirectUri: OAuthSettings.redirectUri
      }
    })
  ],
  // </imports>
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
