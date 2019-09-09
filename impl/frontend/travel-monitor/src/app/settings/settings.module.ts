import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AvatarModule } from '../avatar/avatar.module';

@NgModule({
  declarations: [
    UserSettingsComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    AvatarModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ]
})
export class SettingsModule { 

  constructor(private translateService: TranslateService) {
    // loads module translations
    if (translateService.defaultLang != null) {
      this.setupTranslations();
    } else {
      this.translateService.store.onDefaultLangChange.subscribe(a => {
        this.setupTranslations();
      })
    }
  }

  private setupTranslations() {
    const pl = require("./i18n/pl.json");
    this.translateService.store.translations.pl['settings'] = pl;
  }
}
