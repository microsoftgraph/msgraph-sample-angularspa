// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <NewEventSnippet>
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

// Model for the new event form
export class NewEvent {
  subject?: string;
  attendees?: string;
  start?: string;
  end?: string;
  body?: string;

  // Generate a MicrosoftGraph.Event from the model
  getGraphEvent(timeZone: string): MicrosoftGraph.Event {
    const graphEvent: MicrosoftGraph.Event = {
      subject: this.subject,
      start: {
        dateTime: this.start,
        timeZone: timeZone
      },
      end: {
        dateTime: this.end,
        timeZone: timeZone
      }
    };

    // If there are attendees, convert to array
    // and add them
    if (this.attendees && this.attendees.length > 0) {
      graphEvent.attendees = [];

      const emails = this.attendees.split(';');
      emails.forEach(email => {
        graphEvent.attendees.push({
          type: 'required',
          emailAddress: {
            address: email
          }
        });
      });
    }

    // If there is a body, add it as plain text
    if (this.body && this.body.length > 0) {
      graphEvent.body = {
        contentType: 'text',
        content: this.body
      };
    }

    return graphEvent;
  }
}
// </NewEventSnippet>
