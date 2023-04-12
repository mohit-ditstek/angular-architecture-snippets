import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtAvatarComponent } from './tgt-avatar.component';

describe('TgtAvatarComponent', () => {
  let component: TgtAvatarComponent;
  let fixture: ComponentFixture<TgtAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
