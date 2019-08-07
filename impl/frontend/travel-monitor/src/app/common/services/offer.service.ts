import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Offer } from '../models/offer';
import { environment } from 'src/environments/environment';
import { OfferNotification } from '../models/offer-notification';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private offersNotifications: BehaviorSubject<OfferNotification> = new BehaviorSubject<OfferNotification>(undefined);

  constructor(
    private http: HttpClient,
  ) {
    this.connectToNotificationSocket();
  }

  public getOffers(travelId: number) {
    return this.http.get<Offer[]>(environment.endpoints.offers(travelId));
  }

  public addOfferToTravel(
    travelId: number,
    url: string
  ): Observable<Offer> {
    return this.http.post<Offer>(
      environment.endpoints.offers(travelId),
      JSON.stringify({ url: url }),
    );
  }

  public deleteOffer(travelId: number, offerId: number): Observable<any> {
    return this.http.delete<Offer>(environment.endpoints.offers(travelId));
  }

  public updateOffer(travelId: number, offer: Offer): Observable<any> {
    return this.http.patch<Offer>(
      environment.endpoints.offers(travelId),
      JSON.stringify(offer)
    );
  }

  private connectToNotificationSocket() {
    var offersSocket = new WebSocket(environment.endpoints.offersSocket());

    offersSocket.onmessage = function (e) {
      const notification = <OfferNotification> JSON.parse(e.data);
      this.offersNotifications.next(notification);
    }.bind(this);

    offersSocket.onclose = function (e) {
      console.error('Offers notification socket closed unexpectedly');
    }.bind(this);
  }

  public listenToOffersNotifications(): Observable<OfferNotification> {
    return this.offersNotifications;
  }
}
