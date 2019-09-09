import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/notifications/models/notification';
import { SidePanelService } from 'src/app/side-panel/side-panel.service';
import { SidePanelDataStoreService } from 'src/app/side-panel/side-panel-data-store.service';
import { NotificationsListComponent } from '../notifications-list/notifications-list.component';

@Component({
  selector: 'app-notifications-short-list',
  templateUrl: './notifications-short-list.component.html',
  styleUrls: ['./notifications-short-list.component.scss']
})
export class NotificationsShortListComponent implements OnInit {

  @Input() notifications: Observable<Notification[]>;

  constructor(
    private sidePanelService: SidePanelService,
  ) { }

  ngOnInit() {
  }

  public onShowAllNotificationsClick() {
    this.sidePanelService.show(
      NotificationsListComponent,[{key: 'scrollContainer', value: 'sidePanel'}]
    )
  }
}
