import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSkeletonLoaderComponent } from './notification-skeleton-loader.component';

describe('NotificationSkeletonLoaderComponent', () => {
  let component: NotificationSkeletonLoaderComponent;
  let fixture: ComponentFixture<NotificationSkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationSkeletonLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
