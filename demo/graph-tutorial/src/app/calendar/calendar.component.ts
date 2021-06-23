// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

  // <ngOnInitSnippet>
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
  }
  // </ngOnInitSnippet>

  // <formatDateTimeTimeZoneSnippet>
  formatDateTimeTimeZone(dateTime: MicrosoftGraph.DateTimeTimeZone | undefined | null): Date | undefined {
    if (dateTime == undefined || dateTime == null) {
      return undefined;
    }

    try {
      return parseISO(dateTime.dateTime!);
    }
    catch(error) {
      this.alertsService.addError('DateTimeTimeZone conversion error', JSON.stringify(error));
      return undefined;
    }
  }
  // </formatDateTimeTimeZoneSnippet>
}
