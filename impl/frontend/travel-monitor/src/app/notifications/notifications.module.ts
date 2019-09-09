import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsButtonComponent } from './notifications-button/notifications-button.component';
import { NotificationsShortListComponent } from './notifications-short-list/notifications-short-list.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationsListElementComponent } from './notifications-list-element/notifications-list-element.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AvatarModule } from '../avatar/avatar.module';
import { TimeagoModule } from 'ngx-timeago';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    NotificationsButtonComponent,
    NotificationsShortListComponent,
    NotificationsListComponent,
    NotificationsListElementComponent,
  ],
  imports: [
    CommonModule,
    AvatarModule,
    MatMenuModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    TimeagoModule.forChild()
  ],
  exports: [
    NotificationsButtonComponent,
    NotificationsListComponent
  ],
  entryComponents: [
    NotificationsListComponent
  ]
})
export class NotificationsModule { }
