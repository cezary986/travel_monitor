import { Component, OnInit, Input } from '@angular/core';
import { Notification } from '../models/notification';

@Component({
  selector: 'app-notifications-list-element',
  templateUrl: './notifications-list-element.component.html',
  styleUrls: ['./notifications-list-element.component.scss']
})
export class NotificationsListElementComponent implements OnInit {

  @Input() notification: Notification;

  constructor() { }

  ngOnInit() {
    this.notification.event.author;
  }

}
