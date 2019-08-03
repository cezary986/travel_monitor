import { Injectable } from '@angular/core';
import { Travel } from '../common/models/travel';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private travels: Travel[] = [];

  constructor() { }

  public setTravels(travels: Travel[]) {
    this.travels = travels;
  }

  public getTravels(): Travel[] {
    return this.travels;
  }

  public addTravel(travel: Travel) {
    this.travels.push(travel)
  }

  public removeTravel(travel: Travel) {
    this.travels = this.travels.splice(this.travels.indexOf(travel), 1);
  }


}
