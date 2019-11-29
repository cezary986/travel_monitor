import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from 'src/app/common/models/user';
import { AnimationsFactory } from 'src/app/common/animations';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { IAppState } from 'src/app/store';
import { environment } from 'src/environments/environment';
const seedrandom = require('seedrandom');

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {

  @select((s: IAppState) => s.user.profile) userProfile: Observable<User>;
  @Input() _user: User;
  @Input() set user(user: User) {
    if (user !== undefined && user !== null) {
      this._user = user;
      this.generateBackgroudColor();
      if (user.avatar !== null) {
        if (!user.avatar.image.startsWith("http")) {
          user.avatar.image = environment.fileServerAddress + user.avatar.image;
        }
      }
    }
 }
  @Input() size: string = '30px';
  public backgroundColor: string = 'transparent';
  public reload = false;

  constructor() { }

  ngOnInit() {
    this.userProfile.subscribe((profile: User) => {
      if (profile !== null && this._user !== undefined && profile.id === this._user.id) {
        this._user.avatar = profile.avatar;
      }
    });
  }

  /**
   * Generated unique backgroud color for text base avatars. 
   * It uses username as genrator's seed
   */
  private generateBackgroudColor() {
    const generator = seedrandom(this._user.username);
    this.backgroundColor = 'hsla(' + (generator() * 360) + ', 100%, 45%, 1)';
  }

}
