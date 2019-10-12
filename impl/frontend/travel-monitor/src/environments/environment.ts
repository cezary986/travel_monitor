
export const environment = {
  production: false,
  apiAddress: 'http://localhost:90/travello-server/api/',
  socketApiAddress: 'ws://localhost:8080/ws/',
  fileServerAddress: 'http://localhost:90/travello-server',
  endpoints: {
    login: () => environment.apiAddress + 'auth/login',
    logout: () => environment.apiAddress + 'auth/logout',
    changePassword: () => environment.apiAddress + 'auth/password',
    profile: () => environment.apiAddress + 'user/profile',
    users: () => environment.apiAddress + 'user',
    avatar: () => environment.apiAddress + 'user/avatar',
    checkLogin: () => environment.apiAddress + 'auth/check_login',
    travels: () => environment.apiAddress + 'travels',
    travel: (travelId: number) => environment.apiAddress + 'travels/' + travelId,
    travelUsers: (travelId: number) => environment.apiAddress + 'travels/' + travelId + '/users',
    offers: (travelId: number) => environment.apiAddress + 'travels/' + travelId + '/offers',
    offerArchived: (travelId: number) => environment.apiAddress + 'travels/' + travelId + '/offers/archived',
    offer: (offerId: number) => environment.apiAddress + 'offers/' + offerId,
    offerComments: (offerId: number) => environment.apiAddress + 'offers/' + offerId + '/comments',
    prices: (offerId: number) => environment.apiAddress + 'offers/' + offerId + '/prices',
    notifications: (readed?: string) => { 
      let url = environment.apiAddress + 'notifications';
      if (readed !== undefined) {
        url += '?readed=' + readed;
      }
      return url;
    },
    notification: (notificationId: number) => environment.apiAddress + 'notifications/' + notificationId,
    notificationsFilter: () => environment.apiAddress + 'notifications/filter',
    notificationsTypes: () => environment.apiAddress + 'notifications/types',
    supportedDomains: () => environment.apiAddress + 'supported_domains',
    offersSocket: () => environment.socketApiAddress + 'offers',
    notificationsSocket: () => environment.socketApiAddress + 'notifications'
  },
  snackBarDuration: 3000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
