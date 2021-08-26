---
ms.localizationpriority: medium
---

<!-- markdownlint-disable MD002 MD041 -->

In this section, you'll create a new Angular project.

1. Open your command-line interface (CLI), navigate to a directory where you have rights to create files, and run the following commands to install the [Angular CLI](https://www.npmjs.com/package/@angular/cli) tool and create a new Angular app.

    ```Shell
    npm install -g @angular/cli
    ng new graph-tutorial
    ```

1. The Angular CLI will prompt for more information. Answer the prompts as follows.

    ```Shell
    ? Would you like to add Angular routing? Yes
    ? Which stylesheet format would you like to use? CSS
    ```

1. Once the command finishes, change to the `graph-tutorial` directory in your CLI and run the following command to start a local web server.

    ```Shell
    ng serve --open
    ```

1. Your default browser opens to [https://localhost:4200/](https://localhost:4200) with a default Angular page. If your browser doesn't open, open it and browse to [https://localhost:4200/](https://localhost:4200) to verify that the new app works.

## Add Node packages

Before moving on, install some additional packages that you will use later:

- [ng-bootstrap](https://github.com/ng-bootstrap/ng-bootstrap) for using Bootstrap components from Angular.
- [moment](https://github.com/moment/moment) for formatting dates and times.
- [windows-iana](https://github.com/rubenillodo/windows-iana)
- [msal-angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/README.md) for authenticating to Azure Active Directory and retrieving access tokens.
- [microsoft-graph-client](https://github.com/microsoftgraph/msgraph-sdk-javascript) for making calls to Microsoft Graph.

1. Run the following commands in your CLI.

    ```Shell
    ng add @ng-bootstrap/ng-bootstrap
    npm install @azure/msal-browser@2.16.1 @azure/msal-angular@2.0.2
    npm install date-fns@2.23.0 date-fns-tz@1.1.6 windows-iana@5.0.2
    npm install @microsoft/microsoft-graph-client@3.0.0
    npm install @microsoft/microsoft-graph-types --save-dev
    ```

## Design the app

In this section you'll create the user interface for the app.

1. Open **./src/styles.css** and add the following lines.

    :::code language="css" source="../demo/graph-tutorial/src/styles.css":::

1. Create a new file in the **./src/app** folder named **user.ts** and add the following code.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/user.ts" id="UserSnippet":::

1. Generate an Angular component for the top navigation on the page. In your CLI, run the following command.

    ```Shell
    ng generate component nav-bar
    ```

1. Once the command completes, open **./src/app/nav-bar/nav-bar.component.ts** and replace its contents with the following.

    ```typescript
    import { Component, OnInit } from '@angular/core';

    import { User } from '../user';

    @Component({
      selector: 'app-nav-bar',
      templateUrl: './nav-bar.component.html',
      styleUrls: ['./nav-bar.component.css']
    })
    export class NavBarComponent implements OnInit {

      // Should the collapsed nav show?
      showNav: boolean = false;
      // Is a user logged in?
      authenticated: boolean = false;
      // The user
      user?: User = undefined;

      constructor() { }

      ngOnInit() { }

      // Used by the Bootstrap navbar-toggler button to hide/show
      // the nav in a collapsed state
      toggleNavBar(): void {
        this.showNav = !this.showNav;
      }

      signIn(): void {
        // Temporary
        this.authenticated = true;
        this.user = {
          displayName: 'Adele Vance',
          email: 'AdeleV@contoso.com',
          avatar: '/assets/no-profile-photo.png',
          timeZone: ''
        };
      }

      signOut(): void {
        // Temporary
        this.authenticated = false;
        this.user = undefined;
      }
    }
    ```

1. Open **./src/app/nav-bar/nav-bar.component.html** and replace its contents with the following.

    :::code language="html" source="../demo/graph-tutorial/src/app/nav-bar/nav-bar.component.html" id="navHtml":::

1. Create a home page for the app. Run the following command in your CLI.

    ```Shell
    ng generate component home
    ```

1. Once the command completes, open **./src/app/home/home.component.ts** and replace its contents with the following.

    ```typescript
    import { Component, OnInit } from '@angular/core';

    import { User } from '../user';

    @Component({
      selector: 'app-home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css']
    })
    export class HomeComponent implements OnInit {

      // Is a user logged in?
      authenticated: boolean = false;
      // The user
      user?: User = undefined;

      constructor() { }

      ngOnInit() { }

      signIn(): void {
        // Temporary
        this.authenticated = true;
        this.user = {
          displayName: 'Adele Vance',
          email: 'AdeleV@contoso.com',
          avatar: '',
          timeZone: ''
        };
      }
    }
    ```

1. Open **./src/app/home/home.component.html** and replace its contents with the following.

    :::code language="html" source="../demo/graph-tutorial/src/app/home/home.component.html" id="homeHtml":::

1. Create a simple `Alert` class. Create a new file in the **./src/app** directory named **alert.ts** and add the following code.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/alert.ts" id="AlertSnippet":::

1. Create an alert service that the app can use to display messages to the user. In your CLI, run the following command.

    ```Shell
    ng generate service alerts
    ```

1. Open **./src/app/alerts.service.ts** and replace its contents with the following.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/alerts.service.ts" id="alertsService":::

1. Generate an alerts component to display alerts. In your CLI, run the following command.

    ```Shell
    ng generate component alerts
    ```

1. Once the command completes, open **./src/app/alerts/alerts.component.ts** and replace its contents with the following.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/alerts/alerts.component.ts" id="AlertsComponentSnippet":::

1. Open **./src/app/alerts/alerts.component.html** and replace its contents with the following.

    :::code language="html" source="../demo/graph-tutorial/src/app/alerts/alerts.component.html" id="AlertHtml":::

1. Open **./src/app/app-routing.module.ts** and replace the `const routes: Routes = [];` line with the following code.

    ```typescript
    import { HomeComponent } from './home/home.component';

    const routes: Routes = [
      { path: '', component: HomeComponent },
    ];
    ```

1. Open **./src/app/app.component.html** and replace its entire contents with the following.

    :::code language="html" source="../demo/graph-tutorial/src/app/app.component.html" id="AppHtml":::

1. Add an image file of your choosing named **no-profile-photo.png** in the **./src/assets** directory. This image will be used as the user's photo when the user has no photo in Microsoft Graph.

Save all of your changes and refresh the page. Now, the app should look very different.

![A screenshot of the redesigned home page](images/create-app-01.png)
