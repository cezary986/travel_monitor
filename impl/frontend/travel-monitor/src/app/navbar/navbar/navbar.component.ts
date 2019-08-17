import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/models/user';
import { NavbarDataStoreService } from '../data-store.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { AppLoadingService } from 'src/app/common/services/app-loading.service';
import { SidePanelService } from 'src/app/common/services/side-panel.service';
import { TravelListComponent } from 'src/app/travel/travel-list/travel-list.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() onMenuClick = new EventEmitter<void>();
  public user: User;
  public isLoggedIn: Observable<boolean>;
  public userPopupOpened: boolean = false;
  public appLoading: Observable<boolean>;

  constructor(
    private userService: UserService,
    private dataStore: NavbarDataStoreService,
    private authService: AuthService,
    private appLoadingService: AppLoadingService,
  ) { 
    this.appLoading = this.appLoadingService.listenToAppLoading();
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.listenToLoginStatus();
    this.isLoggedIn.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.dataStore.setUser(this.userService.getProfile());
        this.dataStore.getUser().subscribe((user: User) => {
          this.user = user;
          console.log(user);
          
        });
      }
    }) 
  }

  public onLogoutClick() {
    this.authService.logout().subscribe((res) => {})
  }
}
