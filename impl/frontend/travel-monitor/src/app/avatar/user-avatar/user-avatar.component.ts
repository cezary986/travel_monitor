import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from 'src/app/common/models/user';
import { AnimationsFactory } from 'src/app/common/animations';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {

  @Input() user: User;
  @Input() size: string = '30px';

  constructor() { }

  ngOnInit() { }

}
