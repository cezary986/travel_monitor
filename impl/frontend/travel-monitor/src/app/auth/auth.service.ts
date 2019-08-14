import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES } from '../app-routing.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private router: Router
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
    })
    return res;
  }

  public checkLoginStatus() {
    const status = this.http.get<{logged_in: boolean}>(
      environment.endpoints.checkLogin());
    status.subscribe((res) => {
      this.loggedIn.next(res.logged_in);
    });
  }

  public logout(): Observable<any> {
    const result =  this.http.post(
      environment.endpoints.logout(), {});
    result.subscribe((res) => {
      this.loggedIn.next(false);
    });
    return result;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  public listenToLoginStatus(): Observable<boolean> {
    return this.loggedIn;
  }
}
