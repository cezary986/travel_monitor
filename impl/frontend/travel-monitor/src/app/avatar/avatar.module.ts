import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarUploaderComponent } from './avatar-uploader/avatar-uploader.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AvatarImageUploaderComponent } from './avatar-image-uploader/avatar-image-uploader.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadModule } from '../common/components/file-upload/file-upload.module';
import { ModalModule } from '../common/components/modal/modal.module';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    UserAvatarComponent,
    AvatarUploaderComponent,
    AvatarImageUploaderComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule.forChild(),
    FileUploadModule,
    ModalModule,
    ImageCropperModule
  ],
  entryComponents: [
    AvatarImageUploaderComponent
  ],
  exports: [
    UserAvatarComponent,
    AvatarUploaderComponent
  ]
})
export class AvatarModule {
  s
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
    this.translateService.store.translations.pl['avatar'] = pl;
  }
}
