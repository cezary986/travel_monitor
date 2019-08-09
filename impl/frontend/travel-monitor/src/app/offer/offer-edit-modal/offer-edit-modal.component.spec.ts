import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferEditModalComponent } from './offer-edit-modal.component';

describe('OfferEditModalComponent', () => {
  let component: OfferEditModalComponent;
  let fixture: ComponentFixture<OfferEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
