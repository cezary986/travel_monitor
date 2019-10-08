import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Offer } from '../models/offer';
import { environment } from 'src/environments/environment';
import { OfferNotification } from '../models/offer-notification';
import { NotificationService } from '../../notifications/service/notification.service';
import { SocketConnection } from '../sockets/socket-connection';
import { PaginatedResponse } from 'src/app/pagination/paginated-response';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { ADD_OFFER, UPDATE_OFFER } from 'src/app/offer/store/actions';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private offersNotifications: BehaviorSubject<OfferNotification> = new BehaviorSubject<OfferNotification>(undefined);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private redux: NgRedux<IAppState>
  ) {
    this.connectToOffersSocket();
  }

  public getOffers(travelId: number) {
    return new PaginatedResponse<Offer>(this.http, environment.endpoints.offers(travelId));
  }

  public addOfferToTravel(
    travelId: number,
    url: string
  ): Observable<Offer> {
    return this.http.post<Offer>(
      environment.endpoints.offers(travelId),
      { url: url },
    );
  }

  public deleteOffer(offerId: number): Observable<any> {
    return this.http.delete<Offer>(environment.endpoints.offer(offerId));
  }

  public updateOffer(offer: Offer): Observable<any> {
    return this.http.patch<Offer>(
      environment.endpoints.offer(offer.id),
      JSON.stringify(offer)
    );
  }

  private connectToOffersSocket() {
    const socketConnection = new SocketConnection<OfferNotification>(environment.endpoints.offersSocket());
    socketConnection.connect().subscribe((state: string) => {
      switch(state) {
        case 'opened': {
          console.log('Offers socket connected');
        }
        case 'closed': {
          console.log('Offers socket closed');
        }
      }
    });
    socketConnection.getData().subscribe((offerNotification: OfferNotification) => {
      for (let i = 0; i < offerNotification.updated.length; i++) {
        const element = offerNotification.updated[i];
        this.redux.dispatch({type: UPDATE_OFFER, payload: offerNotification.updated[i]}) 
      }
      this.notificationService.addOffersNotification(offerNotification);
    });
  }

  public listenToOffersNotifications(): Observable<OfferNotification> {
    return this.offersNotifications;
  }
}
