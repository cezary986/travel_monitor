
export const environment = {
  production: false,
  serverAddress: 'http://localhost:90/mymysic-server/api/',
  socketServerAddress: 'ws://localhost:8080/ws/',
  endpoints: {
    login: () => { return environment.serverAddress + 'auth/login';},
    logout: () => { return environment.serverAddress + 'auth/logout';},
    profile: () => { return environment.serverAddress + 'user/profile';},
    checkLogin: () => { return environment.serverAddress + 'auth/check_login';},
    travels: () => { return environment.serverAddress + 'travels';},
    travel: (travelId: number) => { return environment.serverAddress + 'travels/' + travelId;},
    offers: (travelId: number) => { return environment.serverAddress + 'travels/' + travelId + '/offers';},
    offer: (offerId: number) => { return environment.serverAddress + 'offers/' + offerId;},
    prices: (offerId: number) => { return environment.serverAddress + 'offers/' + offerId + '/prices';},
    supportedDomains: () => { return environment.serverAddress + 'supported_domains';},
    offersSocket: () => { return environment.socketServerAddress + 'offers'}
  },
  snackBarDuration: 3000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
