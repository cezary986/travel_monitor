import { Component, OnInit, ViewChild } from '@angular/core';
import { SidePanelService } from './common/services/side-panel.service';

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

  constructor(
    private sidePanelService: SidePanelService
  ) { }

  ngOnInit(): void {
    this.sidePanelService.setPanel(this.sidePanel, this.sidePanelContainer);
  }
}
