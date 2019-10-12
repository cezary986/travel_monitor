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
import { setupModuleTranslations } from '../common/utils/translate_helpers';
import { TRANSLATIONS } from './i18n/pl';
import { UserAvatarListComponent } from './user-avatar-list/user-avatar-list.component';
import { MdePopoverModule } from '@material-extended/mde';
import { SimpleUserListComponent } from './simple-user-list/simple-user-list.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    UserAvatarComponent,
    AvatarUploaderComponent,
    AvatarImageUploaderComponent,
    UserAvatarListComponent,
    SimpleUserListComponent
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
    ImageCropperModule,
    MdePopoverModule,
    MatListModule,
    MatCardModule
  ],
  entryComponents: [
    AvatarImageUploaderComponent
  ],
  exports: [
    UserAvatarComponent,
    UserAvatarListComponent,
    AvatarUploaderComponent,
  ]
})
export class AvatarModule {

  constructor(private translateService: TranslateService) {
    setupModuleTranslations(
      this.translateService,
      'avatar',
      [
        ['pl', TRANSLATIONS]
      ]);
  }
}
