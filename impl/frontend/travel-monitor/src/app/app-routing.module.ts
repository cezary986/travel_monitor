import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/guard/auth-guard.service';

export const ROUTES = {
  login: {
    route: 'login',
    url: () => { return 'login'}
  },
  travelsList: {
    route: 'travels',
    url: () => { return 'travels'}
  },
  travelDetails: {
    route: 'travel/:travelId',
    url: (travelId: number) => { return 'travel/' + travelId}
  },
  settings: {
    route: 'settings',
    url: () => { return 'settings'}
  },
}

const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.travelsList.route,
    pathMatch: 'full'
  },
  {
    path: ROUTES.login.route,
    loadChildren: () => import('./auth/login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: ROUTES.travelsList.route,
    loadChildren: () => import('./travel/travel.module').then(mod => mod.TravelModule),
    canActivate: [AuthGuardService]
  },
  {
    path: ROUTES.travelDetails.route,
    loadChildren: () => import('./offer/offer.module').then(mod => mod.OfferModule),
    canActivate: [AuthGuardService],
  },
  {
    path: ROUTES.settings.route,
    loadChildren: () => import('./settings/settings.module').then(mod => mod.SettingsModule),
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
