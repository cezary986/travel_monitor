import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferListFiltersComponent } from './offer-list-filters.component';

describe('OfferListFiltersComponent', () => {
  let component: OfferListFiltersComponent;
  let fixture: ComponentFixture<OfferListFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferListFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
