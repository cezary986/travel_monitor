import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferListElementComponent } from './offer-list-element.component';

describe('OfferListElementComponent', () => {
  let component: OfferListElementComponent;
  let fixture: ComponentFixture<OfferListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
