<!-- markdownlint-disable MD002 MD041 -->

In this exercise you will incorporate the Microsoft Graph into the application. For this application, you will use the [microsoft-graph-client](https://github.com/microsoftgraph/msgraph-sdk-javascript) library to make calls to Microsoft Graph.

## Get calendar events from Outlook

1. Add a new service to hold all of your Graph calls. Run the following command in your CLI.

    ```Shell
    ng generate service graph
    ```

    Just as with the authentication service you created earlier, creating a service for this allows you to inject it into any components that need access to Microsoft Graph.

1. Once the command completes, open **./src/app/graph.service.ts** and replace its contents with the following.

    ```typescript
    import { Injectable } from '@angular/core';
    import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

    import { AuthService } from './auth.service';
    import { AlertsService } from './alerts.service';

    @Injectable({
      providedIn: 'root'
    })

    export class GraphService {

      constructor(
        private authService: AuthService,
        private alertsService: AlertsService) {}

      async getCalendarView(start: string, end: string, timeZone: string): Promise<MicrosoftGraph.Event[] | undefined> {
        if (!this.authService.graphClient) {
          this.alertsService.addError('Graph client is not initialized.');
          return undefined;
        }

        try {
          // GET /me/calendarview?startDateTime=''&endDateTime=''
          // &$select=subject,organizer,start,end
          // &$orderby=start/dateTime
          // &$top=50
          const result =  await this.authService.graphClient
            .api('/me/calendarview')
            .header('Prefer', `outlook.timezone="${timeZone}"`)
            .query({
              startDateTime: start,
              endDateTime: end
            })
            .select('subject,organizer,start,end')
            .orderby('start/dateTime')
            .top(50)
            .get();

          return result.value;
        } catch (error) {
          this.alertsService.addError('Could not get events', JSON.stringify(error, null, 2));
        }
        return undefined;
      }
    }
    ```

    Consider what this code is doing.

    - It initializes a Graph client in the constructor for the service.
    - It implements a `getCalendarView` function that uses the Graph client in the following way:
      - The URL that will be called is `/me/calendarview`.
      - The `header` method includes the `Prefer: outlook.timezone` header, which causes the start and end times of the returned events to be in the user's preferred time zone.
      - The `query` method adds the `startDateTime` and `endDateTime` parameters, defining the window of time for the calendar view.
      - The `select` method limits the fields returned for each events to just those the view will actually use.
      - The `orderby` method sorts the results by start time.

1. Create an Angular component to call this new method and display the results of the call. Run the following command in your CLI.

    ```Shell
    ng generate component calendar
    ```

1. Once the command completes, add the component to the `routes` array in **./src/app/app-routing.module.ts**.

    ```typescript
    import { CalendarComponent } from './calendar/calendar.component';

    const routes: Routes = [
      { path: '', component: HomeComponent },
      { path: 'calendar', component: CalendarComponent },
    ];
    ```

1. Open **./src/app/calendar/calendar.component.ts** and replace its contents with the following.

    ```typescript
    import { Component, OnInit } from '@angular/core';
    import { parseISO } from 'date-fns';
    import { endOfWeek, startOfWeek } from 'date-fns/esm';
    import { zonedTimeToUtc } from 'date-fns-tz';
    import { findIana } from 'windows-iana';
    import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

    import { AuthService } from '../auth.service';
    import { GraphService } from '../graph.service';
    import { AlertsService } from '../alerts.service';

    @Component({
      selector: 'app-calendar',
      templateUrl: './calendar.component.html',
      styleUrls: ['./calendar.component.css']
    })
    export class CalendarComponent implements OnInit {

      public events?: MicrosoftGraph.Event[];

      constructor(
        private authService: AuthService,
        private graphService: GraphService,
        private alertsService: AlertsService) { }

      async ngOnInit() {
        // Convert the user's timezone to IANA format
        const ianaName = findIana(this.authService.user?.timeZone ?? 'UTC');
        const timeZone = ianaName![0].valueOf() || this.authService.user?.timeZone || 'UTC';

        // Get midnight on the start of the current week in the user's timezone,
        // but in UTC. For example, for Pacific Standard Time, the time value would be
        // 07:00:00Z
        const now = new Date();
        const weekStart = zonedTimeToUtc(startOfWeek(now), timeZone);
        const weekEnd = zonedTimeToUtc(endOfWeek(now), timeZone);

        this.events = await this.graphService.getCalendarView(
          weekStart.toISOString(),
          weekEnd.toISOString(),
          this.authService.user?.timeZone ?? 'UTC');

          // Temporary to display raw results
          this.alertsService.addSuccess('Events from Graph', JSON.stringify(events, null, 2));
      }
    }
    ```

For now this just renders the array of events in JSON on the page. Save your changes and restart the app. Sign in and click the **Calendar** link in the nav bar. If everything works, you should see a JSON dump of events on the user's calendar.

## Display the results

Now you can update the `CalendarComponent` component to display the events in a more user-friendly manner.

1. Remove the temporary code that adds an alert from the `ngOnInit` function. Your updated function should look like this.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/calendar/calendar.component.ts" id="ngOnInitSnippet":::

1. Add a function to the `CalendarComponent` class to format a `DateTimeTimeZone` object into an ISO string.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/calendar/calendar.component.ts" id="formatDateTimeTimeZoneSnippet":::

1. Open **./src/app/calendar/calendar.component.html** and replace its contents with the following.

    :::code language="html" source="../demo/graph-tutorial/src/app/calendar/calendar.component.html" id="calendarHtml":::

This loops through the collection of events and adds a table row for each one. Save the changes and restart the app. Click on the **Calendar** link and the app should now render a table of events.

![A screenshot of the table of events](./images/add-msgraph-01.png)
