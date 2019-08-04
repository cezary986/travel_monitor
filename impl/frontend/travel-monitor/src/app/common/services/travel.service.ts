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

  public update(travel: Travel): Observable<any> {
    return this.http.patch<any>(environment.endpoints.travel(travel.id), JSON.stringify(travel));
  }

  public deteleTravel(travelId: number): Observable<any> {
    return this.http.delete<any>(environment.endpoints.travel(travelId));
  }
}
