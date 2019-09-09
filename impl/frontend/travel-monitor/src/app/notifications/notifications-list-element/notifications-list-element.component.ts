import { Component, OnInit, Input } from '@angular/core';
import { Notification } from '../models/notification';
import { strings as polishStrings } from 'ngx-timeago/language-strings/pl';
import { TimeagoIntl } from 'ngx-timeago';
import { console } from 'src/app/common/debug-console';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications-list-element',
  templateUrl: './notifications-list-element.component.html',
  styleUrls: ['./notifications-list-element.component.scss']
})
export class NotificationsListElementComponent implements OnInit {

  @Input() notification: Notification;
  
  constructor(public intl: TimeagoIntl) {    
    intl.strings = polishStrings;
    intl.changes.next();
  }

  ngOnInit() {
    this.notification.event.author;
  }

}
