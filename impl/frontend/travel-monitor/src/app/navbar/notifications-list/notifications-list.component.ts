import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/services/notification.service';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/common/models/notification';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {

  public notifications: Observable<Notification[]>;

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notifications = this.notificationService.listenToNotifications();
  }

}
