import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/common/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss']
})
export class ThemeSwitchComponent implements OnInit {

  public currentTheme: Observable<string>;
  public defaultTheme = ThemeService.THEMES.DEFAULT;
  public darkTheme = ThemeService.THEMES.DARK;

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
  }
  
  public onThemeToogleChange(event) {
    const value = event.checked;
    this.themeService.setTheme(value ? ThemeService.THEMES.DARK : ThemeService.THEMES.DEFAULT);
  }
}
