import { Injectable } from '@angular/core';

type AppTheme = 'dark-theme' | 'light-theme'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private backgroundUrl: string = ''

  public static THEMES = {
    DARK: 'dark-theme',
    DEFAULT: 'default-theme'
  }

  constructor() { }

  public setTheme(theme: string) {
    document.documentElement.className =  <AppTheme> theme;
  }
}
