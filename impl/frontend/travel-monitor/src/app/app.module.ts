import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './auth/login/login.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthGuardService } from './auth/guard/auth-guard.service';
import { NavbarModule } from './navbar/navbar.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { TravelModule } from './travel/travel.module';
import { SideDrawerModule } from './side-drawer/side-drawer.module';
import { HeadersInterceptor } from './interceptors/headers-interceptor';
import { ExpandableButtonComponent } from './common/expandable-button/expandable-button.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NavbarModule,
    MatSidenavModule,
    SideDrawerModule,
    TravelModule
  ],
  providers: [
    CookieService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
