import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavbarDataStoreService } from '../data-store.service';
import { User } from 'src/app/common/models/user';
import { Observable } from 'rxjs';
import { AnimationFactory } from '@angular/animations';
import { AnimationsFactory } from 'src/app/common/animations';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  animations: [
    AnimationsFactory.makeEnterLeaveAnimation(
      'avatar',
      AnimationsFactory.animations.enter.scaleIn,
      AnimationsFactory.animations.leave.fadeOut,
      2000
    )
  ]
})
export class UserAvatarComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() { }

}
