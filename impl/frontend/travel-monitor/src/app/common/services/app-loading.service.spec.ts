import { TestBed } from '@angular/core/testing';

import { AppLoadingService } from './app-loading.service';

describe('AppLoadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppLoadingService = TestBed.get(AppLoadingService);
    expect(service).toBeTruthy();
  });
});
