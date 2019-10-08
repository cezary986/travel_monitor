import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { getImageSrc, generateUUID } from '../utils';
import { CookieService } from 'ngx-cookie-service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { SET_USER } from '../store/user/actions';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static profile: BehaviorSubject<User> = null;

  constructor(
    private http: HttpClient,
    private redux: NgRedux<IAppState>
  ) { }

  public getProfile(forceReload: boolean = false): Observable<User> {
    if (forceReload || UserService.profile == null) {
      UserService.profile = new BehaviorSubject(null);
      this.http.get<User>(environment.endpoints.profile())
        .pipe(map((profile: User) => {
          // relative image url to absolute
          if (profile.avatar != null) {
            profile.avatar.image = getImageSrc(profile.avatar.image);
          }
          UserService.profile.next(profile);
          this.redux.dispatch({type: SET_USER, payload: profile});
        })).subscribe(() => {});
    }
    return UserService.profile;
  }
}
