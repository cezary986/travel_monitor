import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/models/user';
import { NavbarDataStoreService } from '../data-store.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() onMenuClick = new EventEmitter<void>();
  public user: User;
  public isLoggedIn: Observable<boolean>;

  constructor(
    private userService: UserService,
    private dataStore: NavbarDataStoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.listenToLoginStatus();
    this.dataStore.setUser(this.userService.getProfile());
    this.dataStore.getUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  public onLogoutClick() {
    this.authService.logout().subscribe((res) => {})
  }

}
