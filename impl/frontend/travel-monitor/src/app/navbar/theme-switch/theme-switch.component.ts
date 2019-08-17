import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/common/services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss']
})
export class ThemeSwitchComponent implements OnInit {

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit() {
  }
  
  public onThemeToogleChange(event) {
    const value = event.checked;
    this.themeService.setTheme(value ? ThemeService.THEMES.DARK : ThemeService.THEMES.DEFAULT);
    
  }
}
