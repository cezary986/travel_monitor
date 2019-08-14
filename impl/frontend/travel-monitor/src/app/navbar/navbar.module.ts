import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';

@NgModule({
  declarations: [
    NavbarComponent,
    UserAvatarComponent,
    NotificationsListComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    BrowserAnimationsModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
