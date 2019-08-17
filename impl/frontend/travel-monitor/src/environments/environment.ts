
export const environment = {
  production: false,
  apiAddress: 'http://localhost:90/mymysic-server/api/',
  socketApiAddress: 'ws://localhost:8080/ws/',
  fileServerAddress: 'http://localhost:90/mymysic-server',
  endpoints: {
    login: () => { return environment.apiAddress + 'auth/login';},
    logout: () => { return environment.apiAddress + 'auth/logout';},
    profile: () => { return environment.apiAddress + 'user/profile';},
    checkLogin: () => { return environment.apiAddress + 'auth/check_login';},
    travels: () => { return environment.apiAddress + 'travels';},
    travel: (travelId: number) => { return environment.apiAddress + 'travels/' + travelId;},
    offers: (travelId: number) => { return environment.apiAddress + 'travels/' + travelId + '/offers';},
    offer: (offerId: number) => { return environment.apiAddress + 'offers/' + offerId;},
    prices: (offerId: number) => { return environment.apiAddress + 'offers/' + offerId + '/prices';},
    supportedDomains: () => { return environment.apiAddress + 'supported_domains';},
    offersSocket: () => { return environment.socketApiAddress + 'offers'}
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
