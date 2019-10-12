import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES } from '../app-routing.module';
import { NgRedux } from '@angular-redux/store';
import { IAppState, USER_LOGIN, USER_LOGOUT } from '../store';
import { USER_SET_LOGGED_IN } from '../common/store/user/actions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private router: Router,
    private redux: NgRedux<IAppState>
  ) {
    this.checkLoginStatus();
    this.loggedIn.subscribe((loggedIn: boolean) => {
      if (!loggedIn) {
        this.router.navigate([ROUTES.login.route]);
      }
    });
  }

  public login(username: string, password: string) {
    const body = {
      username: username,
      password: password
    }
    const res = this.http.post<any>(environment.endpoints.login(), JSON.stringify(body));
    res.subscribe((res) => {
      this.loggedIn.next(true);
      this.redux.dispatch({ type: USER_SET_LOGGED_IN, payload: true });
    });
    return res;
  }

  public checkLoginStatus() {
    const status = this.http.get<{ logged_in: boolean }>(
      environment.endpoints.checkLogin());
    status.subscribe((res) => {
      this.loggedIn.next(res.logged_in);
      this.redux.dispatch({ type: USER_SET_LOGGED_IN, payload: res.logged_in });
    });
  }

  public logout(): Observable<any> {
    const result = this.http.post(
      environment.endpoints.logout(), {});
    result.subscribe((res) => {
      this.loggedIn.next(false);
      this.redux.dispatch({ type: USER_SET_LOGGED_IN, payload: false });
    });
    return result;
  }

  public changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch<any>(environment.endpoints.changePassword(), {
      current_password: currentPassword,
      new_password: newPassword,
    }, { observe: 'response' }).pipe(map(res => {
      if (res.status === 200) {
        this.login(this.redux.getState().user.profile.username, newPassword).subscribe(() => { });
      }
      return res;
    }));
  }
}
