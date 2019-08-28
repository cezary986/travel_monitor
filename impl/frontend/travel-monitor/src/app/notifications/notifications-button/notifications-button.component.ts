import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PaginatedResponse } from 'src/app/common/paginated-response';
import { NotificationService } from '../service/notification.service';
import { Notification } from 'src/app/notifications/models/notification';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-notifications-button',
  templateUrl: './notifications-button.component.html',
  styleUrls: ['./notifications-button.component.scss']
})
export class NotificationsButtonComponent implements OnInit {
  
  private readonly ELEMENT_COUNT = 5;
  public notifications: Observable<Notification[]>;
  public count: number = null;
  private paginatedResponse: PaginatedResponse<Notification> = null;
  private paginatedResponseSubscription: Subscription;

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.paginatedResponse = this.notificationService.getNotifications();
    this.notifications = this.paginatedResponse.getDataObservable();
    this.paginatedResponse.setLimit(this.ELEMENT_COUNT);
    this.paginatedResponse.firstPage();
    this.paginatedResponseSubscription = this.notifications.subscribe(res => {
      if (res != undefined) {
        this.count = this.paginatedResponse.getTotalCount();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paginatedResponse != null) {
      this.paginatedResponse.discard();
    }
    if (this.paginatedResponseSubscription !== undefined) {
      this.paginatedResponseSubscription.unsubscribe();
    }
  }

}
