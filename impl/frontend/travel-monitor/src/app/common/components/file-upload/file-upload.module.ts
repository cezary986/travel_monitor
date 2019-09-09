import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { FileListComponent } from './file-list/file-list.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatListModule } from '@angular/material/list';
import { FileSizeModule } from 'ngx-filesize';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    FileUploadComponent,
    FileListComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule.forChild(),
    AngularFontAwesomeModule,
    MatListModule,
    MatDividerModule,
    FileSizeModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule {
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
    this.translateService.store.translations.pl['file_upload'] = pl;
  }
}
