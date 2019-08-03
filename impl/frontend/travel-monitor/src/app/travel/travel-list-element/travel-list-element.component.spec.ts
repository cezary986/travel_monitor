import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelListElementComponent } from './travel-list-element.component';

describe('TravelListElementComponent', () => {
  let component: TravelListElementComponent;
  let fixture: ComponentFixture<TravelListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
