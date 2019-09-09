import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideDrawerService {

  private opened: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { 
  }

  public toogle() {
    this.opened.next(!this.opened.value);
  }

  public isOpened(): Observable<boolean> {
    return this.opened;
  }
}
