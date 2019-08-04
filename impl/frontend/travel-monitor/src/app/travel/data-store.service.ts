import { Injectable } from '@angular/core';
import { Travel } from '../common/models/travel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private travels: BehaviorSubject<Travel[]> = new BehaviorSubject<Travel[]>([]);

  constructor() { }

  public setTravels(travels: Travel[]) {
    this.travels.next(travels);
  }

  public getTravels(): BehaviorSubject<Travel[]> {
    return this.travels;
  }

  public addTravel(travel: Travel) {
    const travelsArray = this.travels.value;
    travelsArray.push(travel);
    this.travels.next(travelsArray);
  }

  public removeTravel(travel: Travel) {
    let travelsArray = [...this.travels.value];
    travelsArray.splice(travelsArray.indexOf(travel), 1);
    this.travels.next(travelsArray);
  }


}
