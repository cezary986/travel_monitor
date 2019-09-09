import { Component, OnInit, ViewChild } from '@angular/core';
import { SidePanelService } from './side-panel/side-panel.service';
import { MessagingService } from './common/services/messaging.service';
import { Observable } from 'rxjs';
import { ScrollService } from './scroll/scroll.service';
import { SideDrawerService } from './side-drawer/service/side-drawer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'travello';
  opened: boolean;
  @ViewChild('sidePanel', null) sidePanel;
  @ViewChild('sidePanelContainer', null) sidePanelContainer;
  message: Observable<any>;
  public sideDrawerOpened: Observable<boolean>;

  constructor(
    private sidePanelService: SidePanelService,
    private scrollService: ScrollService,
    private messagingService: MessagingService,
    private sideDrawerService: SideDrawerService,
    private translateService: TranslateService
  ) { 
    this.sideDrawerOpened = this.sideDrawerService.isOpened();
  }

  ngOnInit(): void {
    this.sidePanelService.setPanel(this.sidePanel, this.sidePanelContainer);

    this.message = this.messagingService.currentMessage
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
