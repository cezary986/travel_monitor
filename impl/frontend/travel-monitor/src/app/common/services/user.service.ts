import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(
    private http: HttpClient,
    private messagingService: MessagingService,
    private cookieService: CookieService
  ) { }

  public getProfile(): Observable<User> {
    return this.http.get<User>(environment.endpoints.profile())
      .pipe(map((profile: User) => {
        // relative image url to absolute
        if (profile.avatar != null) {
          profile.avatar.image = getImageSrc(profile.avatar.image);
          // this.subscribeToFirebaseCloudMessaging(profile.username);
        }
        return profile;
      }));
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
