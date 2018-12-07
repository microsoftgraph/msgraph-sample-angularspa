import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Client } from '@microsoft/microsoft-graph-client';

import { AlertsService } from './alerts.service';
import { OAuthSettings } from '../oauth';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authenticated: boolean;
  public user: User;

  constructor(
    private msalService: MsalService,
    private alertsService: AlertsService) {

    this.authenticated = false;
    this.user = null;
  }

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<void> {
    let result = await this.msalService.loginPopup(OAuthSettings.scopes)
      .catch((reason) => {
        this.alertsService.add('Login failed', JSON.stringify(reason, null, 2));
      });

    if (result) {
      this.authenticated = true;

      let graphClient = Client.init({
        // Initialize the Graph client with an auth
        // provider that requests the token from the
        // auth service
        authProvider: async(done) => {
          let token = await this.getAccessToken()
            .catch((reason) => {
              done(reason, null);
            })

          if (token)
          {
            done(null, token);
          } else {
            done("Could not get an access token", null);
          }
        }
      });

      // Get the user from Graph (GET /me)
      let user = await graphClient.api('/me').get();

      this.user = new User();
      this.user.displayName = user.displayName;
      // Prefer the mail property, but fall back to userPrincipalName
      this.user.email = user.mail || user.userPrincipalName;
    }
  }

  // Sign out
  signOut(): void {
    this.msalService.logout();
    this.user = null;
    this.authenticated = false;
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {
    let result = await this.msalService.acquireTokenSilent(OAuthSettings.scopes)
      .catch((reason) => {
        this.alertsService.add('Get token failed', JSON.stringify(reason, null, 2));
      });

    return result;
  }
}
