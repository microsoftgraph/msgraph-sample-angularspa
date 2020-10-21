// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Is a user logged in?
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  // The user
  get user(): User {
    return this.authService.user;
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {}

  // <signInSnippet>
  async signIn(): Promise<void> {
    await this.authService.signIn();
  }
  // </signInSnippet>
}
