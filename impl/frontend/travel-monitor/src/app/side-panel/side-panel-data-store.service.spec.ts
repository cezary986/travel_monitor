import { TestBed } from '@angular/core/testing';

import { SidePanelDataStoreService } from './side-panel-data-store.service';

describe('SidePanelDataStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SidePanelDataStoreService = TestBed.get(SidePanelDataStoreService);
    expect(service).toBeTruthy();
  });
});
