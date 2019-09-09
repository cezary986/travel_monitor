import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ContainerType = 'mainContainer' | 'sidePanel';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private scrollObservables: any = {
    'mainContainer': new Subject(),
    'sidePanel': new Subject(),
  }

  constructor() { }

  public setContainerScrolled(containerType: ContainerType, end: boolean) {
    this.scrollObservables[containerType].next(end);
  }

  public listenToContainerScroll(containerType: ContainerType): Observable<boolean> {
    return this.scrollObservables[containerType];
  }
}
