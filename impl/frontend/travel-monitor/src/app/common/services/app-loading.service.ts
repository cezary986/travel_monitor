import { Injectable } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLoadingService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoading.next(true);
          break;
        }
        case event instanceof NavigationEnd: {
          this.isLoading.next(false);
          break;
        }
        case event instanceof NavigationCancel: {
          this.isLoading.next(false);
          break;
        }
        case event instanceof NavigationError: {
          this.isLoading.next(false);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  public listenToAppLoading(): Observable<boolean> {
    return this.isLoading;
  }
}
