import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'travels',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: 'travels',
    loadChildren: () => import('./travel/travel.module').then(mod => mod.TravelModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'travel/:travelId',
    loadChildren: () => import('./offer/offer.module').then(mod => mod.OfferModule),
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
