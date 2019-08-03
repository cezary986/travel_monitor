import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAddComponent } from './travel-add.component';

describe('TravelAddComponent', () => {
  let component: TravelAddComponent;
  let fixture: ComponentFixture<TravelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
