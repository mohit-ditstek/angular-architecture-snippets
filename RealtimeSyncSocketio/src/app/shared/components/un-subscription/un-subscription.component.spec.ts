import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnSubscriptionComponent } from './un-subscription.component';

describe('UnSubscriptionComponent', () => {
  let component: UnSubscriptionComponent;
  let fixture: ComponentFixture<UnSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
