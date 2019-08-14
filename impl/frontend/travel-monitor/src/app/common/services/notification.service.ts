import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification';
import { OfferNotification } from '../models/offer-notification';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  constructor(
    private http: HttpClient,
  ) { 
    this.notifications.next(this.notifications.value.concat([
      {
        timestamp: '02.08.2019T08:21:00',
        title: 'Nowa cena oferty: ' + 'Hotel Hilbert' + '!',
        message: 'Cena oferty: ' + 'Hotel Hilbert' + ' została zmieniona z: ' + 324 + ' na: ' + 280
      },
      {
        timestamp: '02.08.2019T08:21:00',
        title: 'Nowa cena oferty: ' + 'Hotel Bałtyk' + '!',
        message: 'Cena oferty: ' + 'Hotel Bałtyk' + ' została zmieniona z: ' + 324 + ' na: ' + 280
      },
      {
        timestamp: '02.08.2019T08:21:00',
        title: 'Nowa cena oferty: ' + 'Hotel Alina' + '!',
        message: 'Cena oferty: ' + 'Hotel Alina' + ' została zmieniona z: ' + 324 + ' na: ' + 280
      },
    ]))
  }

  public addNotification(notifications: Notification[]) {
    this.notifications.next(this.notifications.value.concat(notifications));
  }

  public addOffersNotification(offerNotification: OfferNotification) {
    const array = [];
    const timestamp = offerNotification.timestamp;
    for (let i = 0; i < offerNotification.updated.length; i++) {
      const offer = offerNotification.updated[i];
      if (offer.last_price != null) {
        array.push({
          timestamp: timestamp,
          title: 'Nowa cena oferty: ' + offer.title + '!',
          message: 'Cena oferty: ' + offer.title + ' została zmieniona z: ' + offer.last_price.value + ' na: ' + offer.current_price.value
        });
      }
    }
    this.notifications.next(this.notifications.value.concat(array))
  }

  public listenToNotifications(): Observable<Notification[]> {
    return this.notifications;
  }
}
