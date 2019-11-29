import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './auth/login/login.module';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuardService } from './auth/guard/auth-guard.service';
import { NavbarModule } from './navbar/navbar.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TravelModule } from './travel/travel.module';
import { SideDrawerModule } from './side-drawer/side-drawer.module';
import { HeadersInterceptor } from './interceptors/headers-interceptor';
import { NgxAsideModule } from 'ngx-aside';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { TimeagoModule, TimeagoIntl } from 'ngx-timeago';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './store';
import { SearchBoxComponent } from './common/components/search-box/search-box.component';

@NgModule({
  declarations: [
    AppComponent,
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
    NgxAsideModule,
    TravelModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    AngularFireMessagingModule,
    InfiniteScrollModule,
    TimeagoModule.forRoot({ intl: { provide: TimeagoIntl, useClass: TimeagoIntl } }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient]
      },
    }),
    NgReduxModule
  ],
  providers: [
    CookieService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    },
    TimeagoIntl
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private translateService: TranslateService,
    ngRedux: NgRedux<IAppState>,
    devTools: DevToolsExtension
  ) {

    this.translateService.setDefaultLang('pl');
    this.translateService.use('pl');

    const enhancers = (isDevMode() && devTools.isEnabled()) ? [devTools.enhancer()] : [];
    ngRedux.configureStore(rootReducer, INITIAL_STATE, [], enhancers);
  }
}

platformBrowserDynamic().bootstrapModule(AppModule);
