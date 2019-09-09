import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Travel } from '../models/travel';
import { PaginatedResponse } from '../../pagination/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(
    private http: HttpClient
  ) { }

  public getTravels(): PaginatedResponse<Travel> {
    return new PaginatedResponse<Travel>(this.http, environment.endpoints.travels())
  }

  public getTravel(id: number): Observable<Travel> {
    return this.http.get<Travel>(
      environment.endpoints.travel(id)
    );
  }

  public createTravel(title: string): Observable<Travel> {
    return this.http.post<Travel>(
      environment.endpoints.travels(),
      JSON.stringify({ title: title })
    );
  }

  public update(travel: Travel): Observable<any> {
    return this.http.patch<any>(environment.endpoints.travel(travel.id), JSON.stringify(travel));
  }

  public deteleTravel(travelId: number): Observable<any> {
    return this.http.delete<any>(environment.endpoints.travel(travelId));
  }
}
