import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../models/offer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(
    private http: HttpClient
  ) { }

  public getOffers(travelId: number) {
    return this.http.get<Offer[]>(environment.endpoints.offers(travelId));
  }

  public addOfferToTravel(
    travelId: number,
    offer: Offer
  ): Observable<Offer> {
    return this.http.post<Offer>(
      environment.endpoints.offers(travelId),
      JSON.stringify(offer),
      { withCredentials: true }
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
}
