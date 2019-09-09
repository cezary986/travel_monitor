
export const environment = {
  production: false,
  apiAddress: 'http://localhost:90/travello-server/api/',
  socketApiAddress: 'ws://localhost:8080/ws/',
  fileServerAddress: 'http://localhost:90/travello-server',
  endpoints: {
    login: () => { return environment.apiAddress + 'auth/login';},
    logout: () => { return environment.apiAddress + 'auth/logout';},
    profile: () => { return environment.apiAddress + 'user/profile';},
    checkLogin: () => { return environment.apiAddress + 'auth/check_login';},
    travels: () => { return environment.apiAddress + 'travels';},
    travel: (travelId: number) => { return environment.apiAddress + 'travels/' + travelId;},
    offers: (travelId: number) => { return environment.apiAddress + 'travels/' + travelId + '/offers';},
    offerArchived: (travelId: number) => { return environment.apiAddress + 'travels/' + travelId + '/offers/archived';},
    offer: (offerId: number) => { return environment.apiAddress + 'offers/' + offerId;},
    offerComments: (offerId: number) => { return environment.apiAddress + 'offers/' + offerId + '/comments';},
    prices: (offerId: number) => { return environment.apiAddress + 'offers/' + offerId + '/prices';},
    notifications: (readed?: string) => { 
      let url = environment.apiAddress + 'notifications';
      if (readed !== undefined) {
        url += '?readed=' + readed;
      }
      return url;
    },
    notification: (notificationId: number) => { return environment.apiAddress + 'notifications/' + notificationId;},
    notificationsFilter: () => { return environment.apiAddress + 'notifications/filter';},
    notificationsTypes: () => { return environment.apiAddress + 'notifications/types';},
    supportedDomains: () => { return environment.apiAddress + 'supported_domains';},
    offersSocket: () => { return environment.socketApiAddress + 'offers'},
    notificationsSocket: () => { return environment.socketApiAddress + 'notifications'}
  },
  snackBarDuration: 3000,
  firebase: {
    apiKey: "AIzaSyDiDRUFQz9lOxkHVPYMkLqAR3IZv8uReN0",
    authDomain: "travel-monitor-1c234.firebaseapp.com",
    databaseURL: "https://travel-monitor-1c234.firebaseio.com",
    projectId: "travel-monitor-1c234",
    storageBucket: "",
    messagingSenderId: "802742362191",
    appId: "1:802742362191:web:4882b1a92622785f"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
