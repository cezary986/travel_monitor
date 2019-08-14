import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../common/models/user';

@Injectable({
  providedIn: 'root'
})
export class NavbarDataStoreService {

  private user: Observable<User>;

  constructor() { }

  public getUser(): Observable<User> {
    return this.user;
  }

  public setUser(user: Observable<User>) {
    this.user = user;
  }
}
