import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsListElementComponent } from './notifications-list-element.component';

describe('NotificationsListElementComponent', () => {
  let component: NotificationsListElementComponent;
  let fixture: ComponentFixture<NotificationsListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
