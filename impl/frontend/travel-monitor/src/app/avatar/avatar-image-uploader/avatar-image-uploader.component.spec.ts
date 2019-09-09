import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarImageUploaderComponent } from './avatar-image-uploader.component';

describe('AvatarImageUploaderComponent', () => {
  let component: AvatarImageUploaderComponent;
  let fixture: ComponentFixture<AvatarImageUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarImageUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
