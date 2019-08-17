import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { getImageSrc } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  public getProfile(): Observable<User> {
    return this.http.get<User>(environment.endpoints.profile())
      .pipe(map((profile: User) => {
        // relative image url to absolute
        profile.avatar.image = getImageSrc(profile.avatar.image);
        return profile;
      }));
  }
}
