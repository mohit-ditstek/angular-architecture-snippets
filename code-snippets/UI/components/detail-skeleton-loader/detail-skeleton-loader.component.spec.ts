import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailSkeletonLoaderComponent } from './detail-skeleton-loader.component';

describe('DetailSkeletonLoaderComponent', () => {
  let component: DetailSkeletonLoaderComponent;
  let fixture: ComponentFixture<DetailSkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailSkeletonLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailSkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
