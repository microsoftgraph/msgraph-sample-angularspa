<!-- markdownlint-disable MD002 MD041 -->

In this exercise you will incorporate the Microsoft Graph into the application. For this application, you will use the [microsoft-graph-client](https://github.com/microsoftgraph/msgraph-sdk-javascript) library to make calls to Microsoft Graph.

## Get calendar events from Outlook

1. Create a new file in the `./src/app` directory called `event.ts` and add the following code.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/event.ts" id="eventClasses":::

1. Add a new service to hold all of your Graph calls. Run the following command in your CLI.

    ```Shell
    ng generate service graph
    ```

    Just as with the authentication service you created earlier, creating a service for this allows you to inject it into any components that need access to Microsoft Graph.

1. Once the command completes, open the `./src/app/graph.service.ts` file and replace its contents with the following.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/graph.service.ts" id="graphService":::

    Consider what this code is doing.

    - It initializes a Graph client in the constructor for the service.
    - It implements a `getEvents` function that uses the Graph client in the following way:
      - The URL that will be called is `/me/events`.
      - The `select` method limits the fields returned for each events to just those the view will actually use.
      - The `orderby` method sorts the results by the date and time they were created, with the most recent item being first.

1. Create an Angular component to call this new method and display the results of the call. Run the following command in your CLI.

    ```Shell
    ng generate component calendar
    ```

1. Once the command completes, add the component to the `routes` array in `./src/app/app-routing.module.ts`.

    ```TypeScript
    import { CalendarComponent } from './calendar/calendar.component';

    const routes: Routes = [
      { path: '', component: HomeComponent },
      { path: 'calendar', component: CalendarComponent }
    ];
    ```

1. Open the `./src/app/calendar/calendar.component.ts` file and replace its contents with the following.

    ```TypeScript
    import { Component, OnInit } from '@angular/core';
    import * as moment from 'moment-timezone';

    import { GraphService } from '../graph.service';
    import { Event, DateTimeTimeZone } from '../event';
    import { AlertsService } from '../alerts.service';

    @Component({
      selector: 'app-calendar',
      templateUrl: './calendar.component.html',
      styleUrls: ['./calendar.component.css']
    })
    export class CalendarComponent implements OnInit {

      public events: Event[];

      constructor(
        private graphService: GraphService,
        private alertsService: AlertsService) { }

      ngOnInit() {
        this.graphService.getEvents()
          .then((events) => {
            this.events = events;
            // Temporary to display raw results
            this.alertsService.add('Events from Graph', JSON.stringify(events, null, 2));
          });
      }
    }
    ```

For now this just renders the array of events in JSON on the page. Save your changes and restart the app. Sign in and click the **Calendar** link in the nav bar. If everything works, you should see a JSON dump of events on the user's calendar.

## Display the results

Now you can update the `CalendarComponent` component to display the events in a more user-friendly manner.

1. Remove the temporary code that adds an alert from the `ngOnInit` function. Your updated function should look like this.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/calendar/calendar.component.ts" id="ngOnInit":::

1. Add a function to the `CalendarComponent` class to format a `DateTimeTimeZone` object into an ISO string.

    :::code language="typescript" source="../demo/graph-tutorial/src/app/calendar/calendar.component.ts" id="formatDateTimeTimeZone":::

1. Open the `./src/app/calendar/calendar.component.html` file and replace its contents with the following.

    :::code language="html" source="../demo/graph-tutorial/src/app/calendar/calendar.component.html" id="calendarHtml":::

This loops through the collection of events and adds a table row for each one. Save the changes and restart the app. Click on the **Calendar** link and the app should now render a table of events.

![A screenshot of the table of events](./images/add-msgraph-01.png)
