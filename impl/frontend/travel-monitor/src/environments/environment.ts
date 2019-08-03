
export const environment = {
  production: false,
  serverAddress: 'http://localhost:90/mymysic-server/api/',
  endpoints: {
    login: () => { return environment.serverAddress + 'auth/login';},
    logout: () => { return environment.serverAddress + 'auth/logout';},
    checkLogin: () => { return environment.serverAddress + 'auth/check_login';},
    travels: () => { return environment.serverAddress + 'travels';},
    offers: () => { return environment.serverAddress + 'offers';},
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
