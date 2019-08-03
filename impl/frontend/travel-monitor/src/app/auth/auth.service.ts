import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient
  ) {
    this.checkLoginStatus();
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
      environment.endpoints.checkLogin(),
      {withCredentials: true}
    );
    status.subscribe((res) => {
      this.loggedIn.next(res.logged_in);
    });
  }

  public logout(): Observable<any> {
    const result =  this.http.get(
      environment.endpoints.logout(),
      {withCredentials: true});
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
