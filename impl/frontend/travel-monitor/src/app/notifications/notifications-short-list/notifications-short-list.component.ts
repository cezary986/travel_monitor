import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/notifications/models/notification';

@Component({
  selector: 'app-notifications-short-list',
  templateUrl: './notifications-short-list.component.html',
  styleUrls: ['./notifications-short-list.component.scss']
})
export class NotificationsShortListComponent implements OnInit {

  @Input() notifications: Observable<Notification[]>;

  constructor() { }

  ngOnInit() {
  }

}
