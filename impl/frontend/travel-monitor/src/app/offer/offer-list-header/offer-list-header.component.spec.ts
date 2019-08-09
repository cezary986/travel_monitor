import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferListHeaderComponent } from './offer-list-header.component';

describe('OfferListHeaderComponent', () => {
  let component: OfferListHeaderComponent;
  let fixture: ComponentFixture<OfferListHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferListHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
