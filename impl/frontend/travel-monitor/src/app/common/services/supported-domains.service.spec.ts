import { TestBed } from '@angular/core/testing';

import { SupportedDomainsService } from './supported-domains.service';

describe('SupportedDomainsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupportedDomainsService = TestBed.get(SupportedDomainsService);
    expect(service).toBeTruthy();
  });
});
