import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsShortListComponent } from './notifications-short-list.component';

describe('NotificationsShortListComponent', () => {
  let component: NotificationsShortListComponent;
  let fixture: ComponentFixture<NotificationsShortListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsShortListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsShortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
