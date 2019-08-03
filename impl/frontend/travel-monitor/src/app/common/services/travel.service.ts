import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Travel } from '../models/travel';
import { Offer } from '../models/offer';

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(
    private http: HttpClient
  ) { }

  public getTravels(): Observable<Travel[]> {
    return this.http.get<Travel[]>(
      environment.endpoints.travels(),
      { withCredentials: true }
    );
  }

  public createTravel(title: string): Observable<Travel> {
    return this.http.post<Travel>(
      environment.endpoints.travels(),
      JSON.stringify({ title: title }),
      { withCredentials: true }
    );
  }

  public addOfferToTravel(
    url: string,
    travelId: string,
    dataProvider: string): Observable<Offer> {
    const body = {
      url: url,
      data_provider: dataProvider,
      travel_id: travelId
    }
    return this.http.post<Offer>(
      environment.endpoints.offers(),
      JSON.stringify(body),
      { withCredentials: true }
    );
  }
}
