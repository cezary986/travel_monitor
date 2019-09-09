import { TestBed } from '@angular/core/testing';

import { SidePanelService } from './side-panel.service';

describe('SidePanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SidePanelService = TestBed.get(SidePanelService);
    expect(service).toBeTruthy();
  });
});
