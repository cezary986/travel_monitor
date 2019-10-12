import { Component, Input } from '@angular/core';
import { User } from 'src/app/common/models/user';

@Component({
  selector: 'app-user-avatar-list',
  templateUrl: './user-avatar-list.component.html',
  styleUrls: ['./user-avatar-list.component.scss']
})
export class UserAvatarListComponent {

  @Input() users: User[] = [];
  @Input() size = '30px';
}
