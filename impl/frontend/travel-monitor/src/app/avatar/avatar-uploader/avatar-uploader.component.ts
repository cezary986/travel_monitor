import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/common/models/user';
import { MatDialog } from '@angular/material/dialog';
import { AvatarImageUploaderComponent } from '../avatar-image-uploader/avatar-image-uploader.component';

@Component({
  selector: 'app-avatar-uploader',
  templateUrl: './avatar-uploader.component.html',
  styleUrls: ['./avatar-uploader.component.scss']
})
export class AvatarUploaderComponent implements OnInit {

  @Input() size?: string = '100px';
  @Input() user: User = null;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public onEditButtonClick() {
    this.dialog.open(AvatarImageUploaderComponent);
  }

}
