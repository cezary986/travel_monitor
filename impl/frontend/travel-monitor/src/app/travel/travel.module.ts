import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { TravelListComponent } from './travel-list/travel-list.component';
import { TravelAddComponent } from './travel-add/travel-add.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { TravelListElementComponent } from './travel-list-element/travel-list-element.component';
import { TravelRoutingModule } from './travel-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExpandableButtonModule } from '../common/components/expandable-button/expandable-button.module';
import { SnackbarModule } from '../snackbar/snackbar.module';
import { TimeagoIntl } from 'ngx-timeago';
import { AvatarModule } from '../avatar/avatar.module';
import { TravelHeaderComponent } from './travel-header/travel-header.component';
import { TravelShareComponent } from './travel-share/travel-share.component';
import { UsersModule } from '../users/users.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { setupModuleTranslations } from '../common/utils/translate_helpers';
import { TRANSLATIONS } from './i18n/pl.js';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { SearchBoxModule } from '../common/components/search-box/search-box.module';

@NgModule({
  declarations: [
    TravelListComponent,
    TravelAddComponent,
    TravelListElementComponent,
    TravelHeaderComponent,
    TravelShareComponent
  ],
  imports: [
    CommonModule,
    TravelRoutingModule,
    ExpandableButtonModule,
    SearchBoxModule,
    MatCardModule,
    MatRippleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatListModule,
    FormsModule,
    SnackbarModule,
    AvatarModule,
    UsersModule,
    InfiniteScrollModule,
    TranslateModule
  ],
  entryComponents: [
    TravelShareComponent
  ],
  exports: [
    TravelListComponent,
    TravelListElementComponent,
    TravelHeaderComponent,
  ],
})
export class TravelModule {

  constructor(private translateService: TranslateService) {
    setupModuleTranslations(
      this.translateService,
      'travels',
      [
        ['pl', TRANSLATIONS]
      ]);
  }
}
