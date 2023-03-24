// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, OnInit } from '@angular/core';
import { AuthenticationResult } from '@azure/msal-browser';

import { AuthService } from '../auth.service';
import { User } from '../user';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // Is a user logged in?
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  // The user
  get user(): User | undefined {
    return this.authService.user;
  }
    // The environment
    get environment(): string | undefined {
      return environment.name;
    }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Necessary to handle logout redirect properly
    // See https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/errors.md
    this.authService.handleRedirects().subscribe({
      next: (result: AuthenticationResult) => {},
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  async signIn(): Promise<void> {
    await this.authService.signIn();
  }
}
