import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploadComponent } from 'src/app/common/components/file-upload/file-upload/file-upload.component';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-avatar-image-uploader',
  templateUrl: './avatar-image-uploader.component.html',
  styleUrls: ['./avatar-image-uploader.component.scss']
})
export class AvatarImageUploaderComponent implements OnInit {

  private readonly MAX_FILE_SIZE = 5000000; // 5mb
  public state: string = 'fileSelecting';
  public selectedFile: File = null;

  @ViewChild('fileUploader', null) fileUploaderComponent: FileUploadComponent;
  private fileUploaderFormControl: FormControl = null; 

  constructor(public dialogRef: MatDialogRef<AvatarImageUploaderComponent>) { }

  ngOnInit() {
    setTimeout(() => {
      this.fileUploaderFormControl = this.fileUploaderComponent.getAsFormControl();
    }, 0)
  }

  public onFileChosen(files: File[]) {
    if (this.fileUploaderFormControl.valid) {
      this.selectedFile = files[0]; 
      this.state = 'cropping';
    }
  }

  public imageCropped(image) {
    this.selectedFile = image;
  }

  public onSubmit() {
    
  }

  public onDismiss() {
    this.dialogRef.close();
  }
}
