import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { getImageSrc, generateUUID } from '../utils';
import { MessagingService } from './messaging.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static profile: BehaviorSubject<User> = null;

  constructor(
    private http: HttpClient,
    private messagingService: MessagingService,
    private cookieService: CookieService
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
        })).subscribe(() => {});
    }
    return UserService.profile;
  }

  private subscribeToFirebaseCloudMessaging(username: string) {
    let userId = this.cookieService.get('fcm_use_id');
    if (userId == null) {
      userId = username + '_' + generateUUID();
      this.cookieService.set('fcm_use_id', userId);
    }
    this.messagingService.requestPermission(userId)
    this.messagingService.receiveMessage();
  }
}
