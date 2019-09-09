import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Offer } from '../common/models/offer';
import { OfferService } from '../common/services/offer.service';
import { OfferNotification } from '../common/models/offer-notification';
import { Travel } from '../common/models/travel';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private travel: BehaviorSubject<Travel> = new BehaviorSubject<Travel>(undefined);
  private offers: BehaviorSubject<Offer[]> = new BehaviorSubject<Offer[]>([]);
  private offersIndexedHashArray: any = {};
  private offersChangesSubscription: Subscription;

  constructor(
    private offerService: OfferService
  ) { }

  public setTravel(travel: Travel) {
    this.travel.next(travel);
  }

  public getTravel(): Observable<Travel> {
    return this.travel;
  }

  public setOffers(offers: Offer[]) {
    this.offers.next(offers);
    for (let i = 0; i < offers.length; i++) {
      this.offersIndexedHashArray[offers[i].id] = i;
    }
  }

  public getOffers(): Observable<Offer[]> {
    return this.offers;
  }

  public addNewOffer(offer: Offer) {
    this.offersIndexedHashArray[offer.id] = this.offers.value.length;
    const offers = this.offers.value;
    offers.push(offer);
    this.offers.next(offers);
  }

  public updateOffer(offer: Offer) {
    const array = this.offers.value;
    array[this.offersIndexedHashArray[offer.id]] = offer;
    this.offers.next(array);
  }

  public removeOffer(offer: Offer) {
    let array = this.offers.value;
    array = array.splice(this.offersIndexedHashArray[offer.id], 1);
    this.offers.next(array);
    this.offersIndexedHashArray[offer.id] = undefined;
  }

  public startListeningToOffersChanges() {
    if (this.offersChangesSubscription === undefined) {
      this.offersChangesSubscription = this.offerService.listenToOffersNotifications().subscribe(
        (notification: OfferNotification) => {
          if (notification !== undefined) {
            const array = this.offers.value;
            for (let i = 0; i < notification.updated.length; i++) {
              const index = this.offersIndexedHashArray[notification.updated[i].id];
              array[index] = notification.updated[i];
            }
            this.offers.next(array);
          }
        });
    }
  }

  public stopListeningToOffersChanges() {
    if (this.offersChangesSubscription !== undefined) {
      this.offersChangesSubscription.unsubscribe();
    }
  }
}
