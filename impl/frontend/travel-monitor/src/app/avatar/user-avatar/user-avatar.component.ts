import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from 'src/app/common/models/user';
import { AnimationsFactory } from 'src/app/common/animations';
var seedrandom = require('seedrandom');

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {

  @Input() _user: User;
  @Input() set user(user: User) {
    if (user !== undefined && user !== null) {
      this._user = user;
      this.generateBackgroudColor();
    }
 }
  @Input() size: string = '30px';
  public backgroundColor: string = 'transparent';

  constructor() { }

  ngOnInit() { }

  /**
   * Generated unique backgroud color for text base avatars. 
   * It uses username as genrator's seed
   */
  private generateBackgroudColor() {
    var generator = seedrandom(this._user.username);
    this.backgroundColor = 'hsla(' + (generator() * 360) + ', 100%, 45%, 1)';
  }

}
