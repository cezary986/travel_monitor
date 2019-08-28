import { Component, OnInit, ViewChild } from '@angular/core';
import { SidePanelService } from './common/services/side-panel.service';
import { MessagingService } from './common/services/messaging.service';
import { Observable } from 'rxjs';

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

  constructor(
    private sidePanelService: SidePanelService,
    private messagingService: MessagingService
  ) { }

  ngOnInit(): void {
    this.sidePanelService.setPanel(this.sidePanel, this.sidePanelContainer);

    this.message = this.messagingService.currentMessage
  }
}
