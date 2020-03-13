import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../alerts.service';
import { Alert } from '../alert';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  constructor(public alertsService: AlertsService) { }

  ngOnInit() {
  }

  close(alert: Alert) {
    this.alertsService.remove(alert);
  }
}
