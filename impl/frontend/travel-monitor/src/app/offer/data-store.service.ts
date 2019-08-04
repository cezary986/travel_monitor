import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Offer } from '../common/models/offer';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private offers: BehaviorSubject<Offer[]> = new BehaviorSubject<Offer[]>([]);

  constructor() { }

  public setOffers(offers: Offer[]) {
    this.offers.next(offers);
  }

  public getOffers(): Observable<Offer[]> {
    return this.offers;
  }
}
