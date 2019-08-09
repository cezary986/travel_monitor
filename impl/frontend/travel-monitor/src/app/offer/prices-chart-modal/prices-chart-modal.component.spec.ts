import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesChartModalComponent } from './prices-chart-modal.component';

describe('PricesChartModalComponent', () => {
  let component: PricesChartModalComponent;
  let fixture: ComponentFixture<PricesChartModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricesChartModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricesChartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
