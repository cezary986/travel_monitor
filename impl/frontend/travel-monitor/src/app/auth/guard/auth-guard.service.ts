import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';
import { ROUTES } from 'src/app/app-routing.module';
import { Observable } from 'rxjs';
import { IAppState } from 'src/app/store';
import { select, NgRedux } from '@angular-redux/store';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
    private redux: NgRedux<IAppState>
  ) {}
  canActivate(): boolean {
    if (this.redux.getState().user.loggedIn) {
      return true;
    } else {
      this.router.navigate([ROUTES.login.url()]);
      return false;
    }
  }
}
