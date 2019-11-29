import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelShareComponent } from './travel-share.component';

describe('TravelShareComponent', () => {
  let component: TravelShareComponent;
  let fixture: ComponentFixture<TravelShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
