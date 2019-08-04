import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';
import { ROUTES } from 'src/app/app-routing.module';


@Injectable()
export class AuthGuardService implements CanActivate {
  
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate([ROUTES.login.url()]);
      return false;
    }
    return true;
  }
}