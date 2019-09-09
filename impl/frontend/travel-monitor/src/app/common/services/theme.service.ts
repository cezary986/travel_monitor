import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ThenableWebDriver } from 'selenium-webdriver';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

type AppTheme = 'dark-theme' | 'light-theme'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private static readonly THEME_COOKIE_KEY: string = 'app_theme'
  private backgroundUrl: string = ''
  private currentTheme: BehaviorSubject<AppTheme> = new BehaviorSubject(null);

  public static THEMES = {
    DARK: 'dark-theme',
    DEFAULT: 'default-theme'
  }

  constructor(
    private cookieService: CookieService
  ) {
    const savedTheme = this.getSaveThemeSelection();
    this.setTheme(savedTheme != null ? savedTheme: ThemeService.THEMES.DEFAULT);
  }

  public setTheme(theme: string) {
    this.currentTheme.next(<AppTheme> theme);
    document.documentElement.className =  <AppTheme> theme;
    this.saveThemeSelectionInCookie(theme);
  }

  private getSaveThemeSelection(): string {
    if (this.cookieService.check(ThemeService.THEME_COOKIE_KEY)) {
      return this.cookieService.get(ThemeService.THEME_COOKIE_KEY);
    } else {
      return null;
    }
  }

  private saveThemeSelectionInCookie(theme: string) {    
    this.cookieService.set(ThemeService.THEME_COOKIE_KEY, theme);
  }

  public getCurrentTheme(): Observable<AppTheme> {
    return this.currentTheme;
  }
}
