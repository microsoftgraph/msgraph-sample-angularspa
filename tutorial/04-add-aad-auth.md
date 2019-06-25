<!-- markdownlint-disable MD002 MD041 -->

In this exercise you will extend the application from the previous exercise to support authentication with Azure AD. This is required to obtain the necessary OAuth access token to call the Microsoft Graph. In this step you will integrate the [Microsoft Authentication Library for Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/README.md) into the application.

Create a new file in the `./src` directory named `oauth.ts` and add the following code.

```TypeScript
export const OAuthSettings = {
  appId: 'YOUR_APP_ID_HERE',
  scopes: [
    "user.read",
    "calendars.read"
  ]
};
```

Replace `YOUR_APP_ID_HERE` with the application ID from the Application Registration Portal.

> [!IMPORTANT]
> If you're using source control such as git, now would be a good time to exclude the `oauth.ts` file from source control to avoid inadvertently leaking your app ID.

Open `./src/app/app.module.ts` and add the following `import` statements to the top of the file.

```TypeScript
import { MsalModule } from '@azure/msal-angular';
import { OAuthSettings } from '../oauth';
```

Then add the `MsalModule` to the `imports` array inside the `@NgModule` declaration, and initialize it with the app ID.

```TypeScript
imports: [
  BrowserModule,
  AppRoutingModule,
  NgbModule,
  FontAwesomeModule,
  MsalModule.forRoot({
    clientID: OAuthSettings.appId
  })
],
```

## Implement sign-in

Start by defining a simple `User` class to hold the information about the user that the app displays. Create a new file in the `./src/app` folder named `user.ts` and add the following code.

```TypeScript
export class User {
  displayName: string;
  email: string;
  avatar: string;
}
```

Now create an authentication service. By creating a service for this, you can easily inject it into any components that need access to authentication methods. Run the following command in your CLI.

```Shell
ng generate service auth
```

Once the command finishes, open the `./src/app/auth.service.ts` file and replace its contents with the following code.

```TypeScript
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

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
      // Temporary placeholder
      this.user = new User();
      this.user.displayName = "Adele Vance";
      this.user.email = "AdeleV@contoso.com";
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

    // Temporary to display token in an error box
    if (result) this.alertsService.add('Token acquired', result);
    return result;
  }
}
```

Now that you have the authentication service, it can be injected into the components that do sign-in. Start with the `NavBarComponent`. Open the `./src/app/nav-bar/nav-bar.component.ts` file and make the following changes.

- Add `import { AuthService } from '../auth.service';` to the top of the file.
- Remove the `authenticated` and `user` properties from the class, and remove the code that sets them in `ngOnInit`.
- Inject the `AuthService` by adding the following parameter to the `constructor`: `private authService: AuthService`.
- Replace the existing `signIn` method with the following:

    ```TypeScript
    async signIn(): Promise<void> {
      await this.authService.signIn();
    }
    ```

- Replace the existing `signOut` method with the following:

    ```TypeScript
    signOut(): void {
      this.authService.signOut();
    }
    ```

When you're done, the code should look like the following.

```TypeScript
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  // Should the collapsed nav show?
  showNav: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.showNav = false;
  }

  // Used by the Bootstrap navbar-toggler button to hide/show
  // the nav in a collapsed state
  toggleNavBar(): void {
    this.showNav = !this.showNav;
  }

  async signIn(): Promise<void> {
    await this.authService.signIn();
  }

  signOut(): void {
    this.authService.signOut();
  }
}
```

Since you removed the `authenticated` and `user` properties on the class, you also need to update the `./src/app/nav-bar/nav-bar.component.html` file. Open that file and make the following changes.

- Replace all instances of `authenticated` with `authService.authenticated`.
- Replace all instance of `user` with `authService.user`.

Next update the `HomeComponent` class. Make all of the same changes in `./src/app/home/home.component.ts` that you made to the `NavBarComponent` class with the following exceptions.

- There is no `signOut` method in the `HomeComponent` class.
- Replace the `signIn` method with a slightly different version. This code calls `getAccessToken` to get an access token, which, for now, will output the token as an error.

    ```TypeScript
    async signIn(): Promise<void> {
      await this.authService.signIn();

      // Temporary to display the token
      if (this.authService.authenticated) {
        let token = await this.authService.getAccessToken();
      }
    }
    ```

When your done, the file should look like the following.

```TypeScript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async signIn(): Promise<void> {
    await this.authService.signIn();

    // Temporary to display the token
    if (this.authService.authenticated) {
      let token = await this.authService.getAccessToken();
    }
  }
}
```

Finally, make the same replacements in `./src/app/home/home.component.html` that you made for the nav bar.

Save your changes and refresh the browser. Click the **Click here to sign in** button and you should be redirected to `https://login.microsoftonline.com`. Login with your Microsoft account and consent to the requested permissions. The app page should refresh, showing the token.

### Get user details

Right now the authentication service sets constant values for the user's display name and email address. Now that you have an access token, you can get user details from Microsoft Graph so those values correspond to the current user. Open `./src/app/auth.service.ts` and add the following `import` statement to the top of the file.

```TypeScript
import { Client } from '@microsoft/microsoft-graph-client';
```

Add a new function to the `AuthService` class called `getUser`.

```TypeScript
private async getUser(): Promise<User> {
  if (!this.authenticated) return null;

  let graphClient = Client.init({
    // Initialize the Graph client with an auth
    // provider that requests the token from the
    // auth service
    authProvider: async(done) => {
      let token = await this.getAccessToken()
        .catch((reason) => {
          done(reason, null);
        });

      if (token)
      {
        done(null, token);
      } else {
        done("Could not get an access token", null);
      }
    }
  });

  // Get the user from Graph (GET /me)
  let graphUser = await graphClient.api('/me').get();

  let user = new User();
  user.displayName = graphUser.displayName;
  // Prefer the mail property, but fall back to userPrincipalName
  user.email = graphUser.mail || graphUser.userPrincipalName;

  return user;
}
```

Locate and remove the following code from the `signIn` method.

```TypeScript
// Temporary placeholder
this.user = new User();
this.user.displayName = "Adele Vance";
this.user.email = "AdeleV@contoso.com";
```

In its place, add the following code.

```TypeScript
this.user = await this.getUser();
```

This new code uses the Microsoft Graph SDK to get the user's details, then creates a `User` object using values returned by the API call.

Now change the `constructor` for the `AuthService` class to check if the user is already logged in and load their details if so. Replace the existing `constructor` with the following.

```TypeScript
constructor(
  private msalService: MsalService,
  private alertsService: AlertsService) {

  this.authenticated = this.msalService.getUser() != null;
  this.getUser().then((user) => {this.user = user});
}
```

Finally, remove the temporary code from the `HomeComponent` class. Open the `./src/app/home/home.component.ts` file and replace the existing `signIn` function with the following.

```TypeScript
async signIn(): Promise<void> {
  await this.authService.signIn();
}
```

Now if you save your changes and start the app, after sign-in you should end up back on the home page, but the UI should change to indicate that you are signed-in.

![A screenshot of the home page after signing in](./images/add-aad-auth-01.png)

Click the user avatar in the top right corner to access the **Sign Out** link. Clicking **Sign Out** resets the session and returns you to the home page.

![A screenshot of the dropdown menu with the Sign Out link](./images/add-aad-auth-02.png)

## Storing and refreshing tokens

At this point your application has an access token, which is sent in the `Authorization` header of API calls. This is the token that allows the app to access the Microsoft Graph on the user's behalf.

However, this token is short-lived. The token expires an hour after it is issued. Because the app is using the MSAL library, you do not have to implement any token storage or refresh logic. The `MsalService` caches the token in the browser storage. The `acquireTokenSilent` method first checks the cached token, and if it is not expired, it returns it. If it is expired, it makes a silent request to obtain a new one.
