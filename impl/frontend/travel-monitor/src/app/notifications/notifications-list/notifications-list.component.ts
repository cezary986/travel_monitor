import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from '../service/notification.service';
import { InfiniteScrollDataProvider } from 'src/app/pagination/infinite-scroll-data-provider';
import { Notification } from '../models/notification';
import { ContainerType, ScrollService } from 'src/app/scroll/scroll.service';
import { SidePanelDataStoreService } from 'src/app/side-panel/side-panel-data-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {

  @Input() scrollContainer?: ContainerType = 'mainContainer';
  public notifications: Observable<Notification[]>;
  public loading: Observable<boolean> = null;

  constructor(
    private notificationService: NotificationService,
    private scrollService: ScrollService,
    private sidePanelDataStore: SidePanelDataStoreService
  ) {}

  ngOnInit() {
    const container = this.sidePanelDataStore.getData('scrollContainer');
    this.scrollContainer = container != undefined ? container : 'mainContainer'; 
    
    this.fetchData();
  }

  private fetchData() {
    const paginatedResponse = this.notificationService.getNotifications();
    paginatedResponse.setLimit(20);
    const infiniteScrollData = new InfiniteScrollDataProvider<Notification>(paginatedResponse);
    this.notifications = infiniteScrollData.getDataObservable();
    this.loading = infiniteScrollData.isLoading();
    infiniteScrollData.getFirstPortion();

    this.scrollService.listenToContainerScroll(this.scrollContainer).subscribe((scrolled) => {
      if (scrolled != undefined && scrolled) {
        infiniteScrollData.next();
      }
    });
  }

}
