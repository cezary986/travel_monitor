import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/models/user';
import { NavbarDataStoreService } from '../data-store.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { AppLoadingService } from 'src/app/common/services/app-loading.service';
import { SidePanelService } from 'src/app/side-panel/side-panel.service';
import { TravelListComponent } from 'src/app/travel/travel-list/travel-list.component';
import { SideDrawerService } from 'src/app/side-drawer/service/side-drawer.service';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, USER_LOGOUT } from 'src/app/store';
import { SET_USER } from 'src/app/common/store/user/actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

  @select((s: IAppState) => s.user.loggedIn) loggedIn: Observable<boolean>;
  @select((s: IAppState) => s.user.profile) user: Observable<boolean>;
  @Output() onMenuClick = new EventEmitter<void>();
  public isLoggedIn = false;
  public userPopupOpened: boolean = false;
  public appLoading: Observable<boolean>;

  constructor(
    private userService: UserService,
    private dataStore: NavbarDataStoreService,
    private authService: AuthService,
    private appLoadingService: AppLoadingService,
    private sideDrawerService: SideDrawerService,
    private redux: NgRedux<IAppState>
  ) {
    this.appLoading = this.appLoadingService.listenToAppLoading();
  }

  ngAfterViewInit() {
    this.loggedIn.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.userService.getProfile().subscribe(profile => {
          this.redux.dispatch({type: SET_USER, payload: profile});
        });
      }
    });
  }

  public onLogoutClick() {
    this.authService.logout().subscribe((res) => {
      this.redux.dispatch({type: USER_LOGOUT, payload: null});
    });
  }

  onMenuButtonClick() {
    this.sideDrawerService.toogle();
  }
}
