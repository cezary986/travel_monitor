import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Price } from '../models/price';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(
    private http: HttpClient,
  ) { }

  public getPrices(offerId: number): Observable<Price[]> {
    return this.http.get<Price[]>(environment.endpoints.prices(offerId));
  }
}
