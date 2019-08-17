import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    NavbarComponent,
    UserAvatarComponent,
    NotificationsListComponent,
    ThemeSwitchComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MdePopoverModule,
    BrowserAnimationsModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
