import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploadComponent } from 'src/app/common/components/file-upload/file-upload/file-upload.component';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/common/services/user.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { SET_USER, USER_SET_AVATAR } from 'src/app/common/store/user/actions';

@Component({
  selector: 'app-avatar-image-uploader',
  templateUrl: './avatar-image-uploader.component.html',
  styleUrls: ['./avatar-image-uploader.component.scss']
})
export class AvatarImageUploaderComponent implements OnInit {

  private readonly MAX_FILE_SIZE = 5000000; // 5mb
  public state: 'fileSelecting' | 'cropping' = 'fileSelecting';
  public selectedFile: File = null;
  public imageChangeEvent: any = null;

  @ViewChild('fileUploader', null) fileUploaderComponent: FileUploadComponent;
  private fileUploaderFormControl: FormControl = null;

  constructor(
    public dialogRef: MatDialogRef<AvatarImageUploaderComponent>,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private translate: TranslateService,
    private redux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.fileUploaderFormControl = this.fileUploaderComponent.getAsFormControl();
    });
  }

  public onFileChangeEvent(event: any) {
    if (this.fileUploaderFormControl.valid) {
      this.imageChangeEvent = event;
      this.state = 'cropping';
    }
  }

  public imageCropped(event) {
    this.selectedFile = event.file;
  }

  public loadImageFailed() {
    this.snackbarService.error(this.translate.instant('avatar.toast_error'));
  }

  public onSubmit() {
    this.dialogRef.close();
    this.userService.setAvatar(this.selectedFile).subscribe(res => {
      this.snackbarService.info(this.translate.instant('avatar.toast_success'));
      this.redux.dispatch({type: USER_SET_AVATAR, payload: res});
    }, error => {
      this.snackbarService.info(this.translate.instant('avatar.toast_error'));
    });
  }

  public onDismiss() {
    this.dialogRef.close();
  }
}
