import { Component, OnInit, ViewChild } from '@angular/core';
import { SidePanelService } from './side-panel/side-panel.service';
import { Observable } from 'rxjs';
import { ScrollService } from './scroll/scroll.service';
import { SideDrawerService } from './side-drawer/service/side-drawer.service';
import { TranslateService } from '@ngx-translate/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @select((s: IAppState) => s.user.loggedIn) loggedIn: Observable<boolean>;
  title = 'travello';
  opened: boolean;
  @ViewChild('sidePanel', null) sidePanel;
  @ViewChild('sidePanelContainer', null) sidePanelContainer;
  message: Observable<any>;
  public sideDrawerOpened: Observable<boolean>;

  constructor(
    private sidePanelService: SidePanelService,
    private scrollService: ScrollService,
    private sideDrawerService: SideDrawerService,
    private translateService: TranslateService,
    private redux: NgRedux<IAppState>
  ) {
    this.sideDrawerOpened = this.sideDrawerService.isOpened();
  }

  ngOnInit(): void {
    this.sidePanelService.setPanel(this.sidePanel, this.sidePanelContainer);

    // FIXME: Kiedyś trzeba wymyśleć coś lepszego - najlepiej przenieść całośc razem z bocznym paskiem do nowego "głownego" modułu
    this.loggedIn.subscribe(res => {
      if (!res) {
        setTimeout(() => {
          // @ts-ignore
          document.querySelector('mat-sidenav-content').style.marginLeft = 0;
        }, 100);
      }
    });
  }

  public onContainerScroll() {
    this.scrollService.setContainerScrolled('mainContainer', true);
  }

  public onSidePanelScroll() {
    this.scrollService.setContainerScrolled('sidePanel', true);
  }

  public onSidePanelCloseClick() {
    this.sidePanelService.hide();
  }
}
