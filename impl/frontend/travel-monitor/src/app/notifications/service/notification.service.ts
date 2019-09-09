import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification';
import { OfferNotification } from '../../common/models/offer-notification';
import { environment } from 'src/environments/environment';
import { SocketConnection } from '../../common/sockets/socket-connection';
import { NotificationMessage } from '../models/notification-message';
import { PaginatedResponse, MutablePaginatedResponse } from '../../pagination/paginated-response';
import { console } from 'src/app/common/debug-console';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  private notificationsHashMap = {};
  private paginatedResponses: MutablePaginatedResponse<Notification>[] = []

  constructor(
    private http: HttpClient,
  ) {}

  public getNotifications(readed?: string): PaginatedResponse<Notification> {
    const paginatedResponse = new MutablePaginatedResponse<Notification>(
      this.http, 
      environment.endpoints.notifications()
      );
    paginatedResponse.setOnDiscardListener(() => {
      const index = this.paginatedResponses.indexOf(paginatedResponse);;
      this.paginatedResponses.splice(index, 1);
    });
    this.paginatedResponses.push(paginatedResponse);
    paginatedResponse.getDataObservable().subscribe((data) => {
      //this.addNotifications(data, paginatedResponse);
    })
    this.connectToNotificationSocket();
    return paginatedResponse;
  }

  private updatePaginatedReponses(notifications: Notification[]) {
    for(let i = 0; i < this.paginatedResponses.length; i++) {
      const response = this.paginatedResponses[i];
      for (let j = 0; j < notifications.length; j ++) {
        response._updateRecord(notifications[j]);
      }
    }
  }

  public addNotifications(notifications: Notification[], paginatedResponse?: PaginatedResponse<Notification>) {
    for(let i = 0; i < this.paginatedResponses.length; i++) {
      const response = this.paginatedResponses[i];
      if (response != paginatedResponse) { 
        for (let j = 0; j < notifications.length; j ++) {
          response._add_record(notifications[j]);
        }
      }
    }
  }

  public addOffersNotification(offerNotification: OfferNotification) {
    const array: Notification[] = [];
    const timestamp = offerNotification.timestamp;
    for (let i = 0; i < offerNotification.updated.length; i++) {
      const offer = offerNotification.updated[i];
      if (offer.last_price != null) {
        array.push({
          id: null,
          user: null,
          readed: null,
          event: {
            id: null,
            timestamp: timestamp,
            author: null,
            type: {
              id: null,
              name: 'price_change',
              title: 'Zmiana ceny oferty',
              description: null
            },
            title: 'Nowa cena oferty: ' + offer.title + '!',
            message: 'Cena oferty: ' + offer.title + ' została zmieniona z: ' + offer.last_price.value + ' na: ' + offer.current_price.value,
            data: null
          }
        });
      }
    }
    this.addNotifications(array);
  }

  private connectToNotificationSocket() {
    const socketConnection = new SocketConnection<NotificationMessage>(environment.endpoints.notificationsSocket());
    socketConnection.connect().subscribe((state: string) => {
      switch (state) {
        case 'opened': {
          console.debug('Notification socket connected');
        }
        case 'closed': {
          console.error('Notification socket closed');
        }
      }
    });
    socketConnection.getData().subscribe((NotificationMessage: NotificationMessage) => {
      console.log(NotificationMessage);
      switch (NotificationMessage.action) {
        case 'new': {
          this.addNotifications([NotificationMessage.notification]);
        }
        case 'readed': {
          this.updateNotification(NotificationMessage.notification);
        }
      }
    });
  }

  private updateNotification(notification: Notification) {
    for (let i = 0; i < this.paginatedResponses.length; i++) {
      this.paginatedResponses[i]._updateRecord(notification);
    }
  }

  public markAsReaded(ids: number[]) {
    this.http.patch(environment.endpoints.notifications(), ids).subscribe((res) => {});
  }
}
