import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Offer } from '../common/models/offer';
import { OfferService } from '../common/services/offer.service';
import { OfferNotification } from '../common/models/offer-notification';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private offers: BehaviorSubject<Offer[]> = new BehaviorSubject<Offer[]>([]);
  private offersHashArray: any = {};
  private offersChangesSubscription: Subscription;

  constructor(
    private offerService: OfferService
  ) { }

  public setOffers(offers: Offer[]) {
    this.offers.next(offers);
    for (let i = 0; i < offers.length; i++) {
      this.offersHashArray[offers[i].id] = offers[i];
    }
  }

  public getOffers(): Observable<Offer[]> {
    return this.offers;
  }

  public addNewOffer(offer: Offer) {
    this.offersHashArray[offer.id] = offer;
    const offers = this.offers.value;
    offers.push(offer);
    this.offers.next(offers);
  }

  public startListeningToOffersChanges() {
    if (this.offersChangesSubscription === undefined) {
      this.offersChangesSubscription = this.offerService.listenToOffersNotifications().subscribe(
        (notification: OfferNotification) => {
          if (notification !== undefined) {
            for (let i = 0; i < notification.offers_that_changed.length; i++) {
              this.offersHashArray[notification.offers_that_changed[i].id] = notification.offers_that_changed[i];
            }
            this.offers.next(this.offers.value);
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
