import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportedDomainsService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Returns list of all supported offers domains names
   */
  public getSupportedDomains(): Observable<string[]> {
    return this.http.get<string[]>(environment.endpoints.supportedDomains());
  }
}
