// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { findOneIana } from 'windows-iana';
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

  public events: MicrosoftGraph.Event[];

  constructor(
    private authService: AuthService,
    private graphService: GraphService,
    private alertsService: AlertsService) { }

  // <ngOnInitSnippet>
  ngOnInit() {
    // Convert the user's timezone to IANA format
    const ianaName = findOneIana(this.authService.user.timeZone);
    const timeZone = ianaName!.valueOf() || this.authService.user.timeZone;

    // Get midnight on the start of the current week in the user's timezone,
    // but in UTC. For example, for Pacific Standard Time, the time value would be
    // 07:00:00Z
    var startOfWeek = moment.tz(timeZone).startOf('week').utc();
    var endOfWeek = moment(startOfWeek).add(7, 'day');

    this.graphService.getCalendarView(
      startOfWeek.format(),
      endOfWeek.format(),
      this.authService.user.timeZone)
        .then((events) => {
          this.events = events;
        });
  }
  // </ngOnInitSnippet>

  // <formatDateTimeTimeZoneSnippet>
  formatDateTimeTimeZone(dateTime: MicrosoftGraph.DateTimeTimeZone): string {
    try {
      return moment.tz(dateTime.dateTime, dateTime.timeZone).format();
    }
    catch(error) {
      this.alertsService.addError('DateTimeTimeZone conversion error', JSON.stringify(error));
    }
  }
  // </formatDateTimeTimeZoneSnippet>
}
